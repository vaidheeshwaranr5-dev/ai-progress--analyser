/* AI Progress Analyser backend. No dependencies (Node 18+). Run: cd server && node server.js
   Serves the frontend AND the /api routes, so the browser never sees the API key. */
const http = require("http"), fs = require("fs"), path = require("path");
try { // minimal .env loader
  fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/).forEach((l) => {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
} catch (_) {}
const KEY = process.env.GENAI_API_KEY, MODEL = process.env.GENAI_MODEL || "claude-sonnet-5-5", PORT = +process.env.PORT || 3000;
const API_URL = process.env.GENAI_URL || "https://api.anthropic.com/v1/messages";
const ROOT = path.join(__dirname, "..");

/* ---------- GenAI call (only place the key is used) ---------- */
async function callAI(system, messages, maxTokens = 1800) {
  if (!KEY || KEY === "your_api_key_here") throw httpErr(503, "GENAI_API_KEY is not set in server/.env");
  let res;
  try {
    res = await fetch(API_URL, { method: "POST", signal: AbortSignal.timeout(40000),
      headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }) });
  } catch (e) { throw httpErr(e.name === "TimeoutError" ? 504 : 502, e.name === "TimeoutError" ? "The AI took too long to respond" : "Could not reach the AI service"); }
  if (!res.ok) throw httpErr(502, "The AI service returned an error (" + res.status + ")");
  const d = await res.json().catch(() => null);
  const text = d && Array.isArray(d.content) ? d.content.map((b) => b.text || "").join("") : "";
  if (!text) throw httpErr(502, "Empty AI response");
  return text;
}
const httpErr = (status, message) => Object.assign(new Error(message), { status });
function parseJSON(t) { // tolerate code fences / extra prose
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b < a) throw httpErr(502, "AI returned an unreadable response");
  try { return JSON.parse(t.slice(a, b + 1)); } catch (_) { throw httpErr(502, "AI returned an unreadable response"); }
}
const str = (v, n = 400) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const arr = (v, n = 10) => (Array.isArray(v) ? v.map((x) => str(x, 300)).filter(Boolean).slice(0, n) : []);

/* ---------- 1. analyze-performance ---------- */
function validatePerf(b) {
  const subject = str(b.subject, 60), tp = b.topicPerformance;
  if (!subject || !tp || typeof tp !== "object" || Array.isArray(tp)) throw httpErr(400, "Invalid performance data");
  const topics = {}, keys = Object.keys(tp);
  if (!keys.length || keys.length > 40) throw httpErr(400, "Invalid topic data");
  keys.forEach((k) => { const v = Number(tp[k]); if (!Number.isFinite(v) || v < 0 || v > 100 || k.length > 60) throw httpErr(400, "Invalid topic score"); topics[k] = Math.round(v); });
  const n = (v, max) => { v = Number(v); if (!Number.isFinite(v) || v < 0 || v > max) throw httpErr(400, "Invalid numbers"); return v; };
  return { subject, topics, total: n(b.totalQuestions, 500), correct: n(b.correctAnswers, 500), wrong: n(b.wrongAnswers, 500), unanswered: n(b.unanswered || 0, 500), percentage: n(b.percentage, 100) };
}
async function analyze(body) {
  const p = validatePerf(body);
  const weak = Object.keys(p.topics).filter((t) => p.topics[t] <= 70).sort((a, b) => p.topics[a] - p.topics[b]);
  const strong = Object.keys(p.topics).filter((t) => p.topics[t] > 70).sort((a, b) => p.topics[b] - p.topics[a]);
  const system = "You are an expert tutor inside a student learning dashboard. Analyse ONLY the test data given; never invent scores or topics. Be specific (name concepts inside each weak topic), not generic. Reply with a single JSON object and nothing else.";
  const user = `Test data: ${JSON.stringify({ subject: p.subject, total: p.total, correct: p.correct, wrong: p.wrong, unanswered: p.unanswered, percentage: p.percentage, topicScores: p.topics })}
Weak topics (<=70%): ${weak.join(", ") || "none"}. Strong topics (>70%): ${strong.join(", ") || "none"}.
Return JSON with exactly these keys: {"summary":string,"overallLevel":string,"strongTopics":string[],"weakTopics":string[],"topicsNeedingImprovement":string[],"reasoning":string[],"recommendations":string[],"studyOrder":string[],"recommendedStudyTime":string,"difficultyLevel":"Easy|Medium|Hard","studyPlan":[{"day":"TODAY|TOMORROW|DAY 3","tasks":[{"minutes":number,"topic":string,"activity":string}]}],"recommendedPractice":string[],"encouragement":string}`;
  const o = parseJSON(await callAI(system, [{ role: "user", content: user }]));
  const plan = (Array.isArray(o.studyPlan) ? o.studyPlan : []).slice(0, 7).map((d) => ({
    day: str(d && d.day, 30) || "DAY", tasks: (Array.isArray(d && d.tasks) ? d.tasks : []).slice(0, 6).map((t) => ({ minutes: Math.min(180, Math.max(5, Math.round(Number(t && t.minutes)) || 15)), topic: str(t && t.topic, 80), activity: str(t && t.activity, 200) })).filter((t) => t.topic) })).filter((d) => d.tasks.length);
  if (!str(o.summary) || !plan.length) throw httpErr(502, "AI response was incomplete");
  return { summary: str(o.summary, 600), overallLevel: str(o.overallLevel, 40) || "—",
    strongTopics: strong, weakTopics: weak,                      // grounded in the real scores, not the model
    topicsNeedingImprovement: arr(o.topicsNeedingImprovement).length ? arr(o.topicsNeedingImprovement) : weak,
    reasoning: arr(o.reasoning), recommendations: arr(o.recommendations), studyOrder: arr(o.studyOrder),
    recommendedStudyTime: str(o.recommendedStudyTime, 100), difficultyLevel: ["Easy", "Medium", "Hard"].includes(o.difficultyLevel) ? o.difficultyLevel : "Medium",
    studyPlan: plan, recommendedPractice: arr(o.recommendedPractice), encouragement: str(o.encouragement, 300) };
}

/* ---------- 2. ask-ai ---------- */
async function askAI(b) {
  const q = str(b.question, 500); if (!q) throw httpErr(400, "Question is empty");
  const hist = (Array.isArray(b.history) ? b.history : []).slice(-6).filter((h) => h && (h.role === "user" || h.role === "assistant") && str(h.content, 800)).map((h) => ({ role: h.role, content: str(h.content, 800) }));
  while (hist.length && hist[0].role !== "user") hist.shift();
  const ctx = b.context ? JSON.stringify(b.context).slice(0, 4000) : "No test has been taken yet.";
  const system = `You are the InsideBox AI Learning Assistant for a student. Use the student's latest performance data below; quote their real scores and never invent any. If they ask about results but no data exists, ask them to take a test. Keep answers short, specific and encouraging; plain text, no markdown tables.\nStudent data: ${ctx}`;
  const msgs = hist.concat([{ role: "user", content: q }]);
  return { reply: str(await callAI(system, msgs, 700), 3000) };
}

/* ---------- 3. generate-practice ---------- */
async function practice(b) {
  const subject = str(b.subject, 60), topic = str(b.topic, 80), count = Math.min(10, Math.max(1, Math.round(Number(b.count)) || 5));
  const difficulty = ["Easy", "Medium", "Hard"].includes(b.difficulty) ? b.difficulty : "Medium";
  if (!subject || !topic) throw httpErr(400, "Subject and topic are required");
  const system = "You write accurate multiple-choice questions for students. Reply with a single JSON object and nothing else.";
  const user = `Write ${count} ${difficulty} MCQs on "${topic}" in ${subject}. Exactly 4 options each, one correct. JSON: {"questions":[{"question":string,"options":[string,string,string,string],"correctAnswer":"A|B|C|D","explanation":string,"topic":"${topic}","difficulty":"${difficulty}"}]}`;
  const o = parseJSON(await callAI(system, [{ role: "user", content: user }], 2500));
  const questions = (Array.isArray(o.questions) ? o.questions : []).map((q) => ({ question: str(q.question, 400), options: arr(q.options, 4), correctAnswer: str(q.correctAnswer, 1).toUpperCase(),
    explanation: str(q.explanation, 400), topic, difficulty })).filter((q) => q.question && q.options.length === 4 && "ABCD".includes(q.correctAnswer) && q.correctAnswer);
  if (!questions.length) throw httpErr(502, "AI could not generate valid questions");
  return { questions };
}

/* ---------- HTTP server ---------- */
const routes = { "/api/analyze-performance": analyze, "/api/ask-ai": askAI, "/api/generate-practice": practice };
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const send = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };
function readBody(req) {
  return new Promise((ok, no) => { let d = ""; req.on("data", (c) => { d += c; if (d.length > 100000) { no(httpErr(413, "Request too large")); req.destroy(); } });
    req.on("end", () => { try { ok(JSON.parse(d || "{}")); } catch (_) { no(httpErr(400, "Invalid JSON")); } }); });
}
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (routes[url.pathname]) {
    if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
    try { send(res, 200, await routes[url.pathname](await readBody(req))); }
    catch (e) { console.error(url.pathname, e.message); send(res, e.status || 500, { error: e.status ? e.message : "Something went wrong on the server" }); }
    return;
  }
  let f = path.join(ROOT, url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname));
  const safe = f.startsWith(ROOT + path.sep) && !f.startsWith(__dirname + path.sep) && MIME[path.extname(f)];
  fs.readFile(safe ? f : "", (err, data) => { if (err) { res.writeHead(404); return res.end("Not found"); } res.writeHead(200, { "content-type": MIME[path.extname(f)] }); res.end(data); });
}).listen(PORT, () => console.log(`Open http://localhost:${PORT}  (API key ${KEY && KEY !== "your_api_key_here" ? "loaded" : "MISSING in server/.env"})`));