/* ---------- Auth guard ---------- */
let email = "";
try { email = sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || ""; } catch (_) {}
if (!email) window.location.replace("index.html");
const name = (email.split("@")[0] || "Student").replace(/[^a-z]/gi, " ").trim().split(" ")[0] || "Student";
const Name = name[0].toUpperCase() + name.slice(1);
const $ = (id) => document.getElementById(id);
const logout = () => { try { sessionStorage.clear(); localStorage.removeItem("userEmail"); } catch (_) {} location.href = "index.html"; };

/* ---------- Data ---------- */
const subjects = [
  { n: "Data Structures", s: [78, 82, 86, 88, 90, 92], weak: ["Tree Traversal", "Graph Algorithms"], strong: ["Arrays", "Stacks"] },
  { n: "Database Management", s: [84, 80, 76, 70, 68, 66], weak: ["SQL Joins", "Normalization"], strong: ["ER Diagrams"] },
  { n: "Computer Networks", s: [66, 70, 65, 69, 70, 68], weak: ["Subnetting", "Routing"], strong: ["OSI Model"] },
  { n: "Operating Systems", s: [90, 92, 89, 93, 91, 91], weak: ["OS Scheduling"], strong: ["Memory Management", "Deadlocks"] },
  { n: "Artificial Intelligence", s: [72, 75, 78, 80, 84, 85], weak: ["Search Algorithms"], strong: ["Intro to ML"] },
];
const topics = [
  { t: "Tree Traversal", sub: "Data Structures", score: 42, tip: "Redo in-order, pre-order and post-order on 5 sample trees." },
  { t: "Graph Algorithms", sub: "Data Structures", score: 48, tip: "Revisit BFS vs DFS, then try 10 shortest-path problems." },
  { t: "SQL Joins", sub: "Database Management", score: 56, tip: "Practice INNER vs LEFT joins with two small tables." },
  { t: "OS Scheduling", sub: "Operating Systems", score: 64, tip: "Compare FCFS, SJF and Round Robin on one example." },
];
const tests = [
  ["Data Structures Quiz", "Data Structures", "Oct 05", 86, "Improved"], ["DBMS Unit Test", "Database", "Oct 03", 64, "Needs Improvement"],
  ["OS Quiz", "Operating Systems", "Oct 01", 91, "Excellent"], ["Networks Quiz", "Computer Networks", "Sep 28", 68, "Needs Improvement"],
  ["AI Mid Test", "Artificial Intelligence", "Sep 25", 85, "Improved"], ["DS Unit Test", "Data Structures", "Sep 20", 92, "Excellent"],
];
const charts = {
  7: { l: ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Test 6"], me: [68, 72, 70, 78, 80, 86], avg: [65, 66, 68, 70, 71, 73] },
  30: { l: ["Week 1", "Week 2", "Week 3", "Week 4"], me: [70, 74, 79, 84], avg: [66, 68, 71, 73] },
  90: { l: ["Aug", "Sep", "Oct"], me: [64, 74, 83], avg: [62, 68, 72] },
};

/* ---------- AI analysis logic ---------- */
const LEVELS = ["LOW", "MEDIUM", "HIGH"];
const priorityOf = (score) => (score < 50 ? "HIGH" : score <= 70 ? "MEDIUM" : "LOW");
function analyse(sub) {
  const s = sub.s, avg = Math.round(s.reduce((a, b) => a + b, 0) / s.length);
  const falling = s[3] > s[4] && s[4] > s[5];
  let p = LEVELS.indexOf(priorityOf(avg));
  if (falling) p = Math.min(2, p + 1);               // decreasing trend raises priority
  const gain = s[5] - s[0];
  const status = Math.min(...s.slice(-3)) >= 85 ? "Mastered" : falling ? "Declining" : gain >= 5 ? "Improving" : "Stable";
  return { ...sub, avg, priority: LEVELS[p], status, gain };
}
const A = subjects.map(analyse);
const arrow = (st) => ({ Mastered: "★", Improving: "▲", Declining: "▼", Stable: "▬" }[st]);

/* ---------- Header / sidebar ---------- */
const h = new Date().getHours();
$("greeting").textContent = `Good ${h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"}, ${Name} 👋`;
["avatarSm", "avatarBtn"].forEach((i) => ($(i).textContent = Name[0]));
$("uName").textContent = $("pName").textContent = Name;
$("uEmail").textContent = $("pEmail").textContent = email;
const navItems = [["🏠", "Dashboard", "top"], ["📊", "My Performance", "performance"], ["📚", "Subjects", "subjects"], ["✦", "AI Recommendations", "recs"],
  ["🕘", "Quiz History", "history"], ["🗓️", "Study Planner", "planner"], ["🏆", "Achievements", "achievements"], ["👤", "Profile", "profile"], ["⚙️", "Settings", "settings"]];
$("nav").innerHTML = navItems.map(([i, l, t], k) => `<a data-t="${t}" class="${k ? "" : "active"}"><span>${i}</span>${l}</a>`).join("");
$("nav").addEventListener("click", (e) => {
  const a = e.target.closest("a"); if (!a) return;
  document.querySelectorAll("nav a").forEach((x) => x.classList.toggle("active", x === a));
  const t = a.dataset.t;
  if (t === "profile") $("profMenu").hidden = false;
  else if (t === "settings") modal(`<h2>Settings</h2><p class="muted">Signed in as ${email}</p><button class="btn" onclick="closeModal()">Close</button>`);
  else if (t === "top") scrollTo({ top: 0, behavior: "smooth" });
  else $(t).scrollIntoView({ behavior: "smooth" });
  $("sidebar").classList.remove("open");
});
$("menuBtn").onclick = () => $("sidebar").classList.toggle("open");
$("logoutBtn").onclick = $("logoutBtn2").onclick = logout;
$("bellBtn").onclick = () => { $("bellMenu").hidden = !$("bellMenu").hidden; $("profMenu").hidden = true; document.querySelector(".dot").remove?.(); };
$("avatarBtn").onclick = () => { $("profMenu").hidden = !$("profMenu").hidden; $("bellMenu").hidden = true; };
document.addEventListener("click", (e) => { if (!e.target.closest(".dd-wrap, nav")) { $("bellMenu").hidden = $("profMenu").hidden = true; } });

/* ---------- Summary cards ---------- */
$("stats").innerHTML = `
 <div class="stat"><div><small>Overall Progress</small><b>78%</b><span class="up">+8% this month</span></div><div class="ring" style="--p:78"><span>78%</span></div></div>
 <div class="stat"><div><small>Average Score</small><b>82%</b><span class="up">▲ +5% from last test</span></div></div>
 <div class="stat"><div><small>Topics Mastered</small><b>24 / 32</b><span class="up">75% completed</span></div><div class="ring" style="--p:75"><span>75%</span></div></div>
 <div class="stat"><div><small>Study Streak</small><b>day 1 🔥</b><span class="up">Keep going!</span></div></div>`;

/* ---------- AI insight + recommendations ---------- */
const worst = [...topics].sort((a, b) => a.score - b.score);
const ds = A[0];
$("aiText").textContent = `Your performance in ${ds.n} has improved by ${ds.gain}%, but you are still struggling with ${worst[0].t} and ${worst[1].t}. Focus on these first.`;
const detail = () => `<b>Why the AI says this</b><br>` + A.map((x) => `• ${x.n}: avg ${x.avg}%, ${x.status.toLowerCase()}, <b>${x.priority}</b> priority${x.weak.length ? ` (weak: ${x.weak.join(", ")})` : ""}`).join("<br>")
  + `<br><br>Priority rules: below 50% = High, 50–70% = Medium, above 70% = Low. A falling trend over the last 3 tests raises the priority one level.`;
$("detailBtn").onclick = () => { const d = $("aiDetail"); d.innerHTML = detail(); d.hidden = !d.hidden; $("detailBtn").textContent = d.hidden ? "View Detailed Analysis →" : "Hide Detailed Analysis ↑"; };
$("analyzeBtn").onclick = () => {
  const b = $("analyzeBtn"); b.textContent = "Analyzing…"; b.disabled = true;
  setTimeout(() => { b.textContent = "Analysis updated ✓"; b.disabled = false; $("aiDetail").innerHTML = detail(); $("aiDetail").hidden = false; }, 1200);
};
const recs = [
  ["Practice Tree Traversal", "You scored below 50% in your last 2 attempts.", "Start Practice", "Tree Traversal"],
  ["Revise SQL Joins", "Your accuracy decreased by 15%.", "Review Topic", "SQL Joins"],
  ["Take a Graph Algorithms Quiz", "You have not practiced this topic recently.", "Take Quiz", "Graph Algorithms"],
];
$("recList").innerHTML = recs.map(([t, r, b, k]) => `<div class="mini"><b>${t}</b><p>${r}</p><button class="btn p sm" data-quiz="${k}">${b}</button></div>`).join("");

/* ---------- Chart ---------- */
let chart;
function drawChart(r) {
  const d = charts[r];
  if (chart) chart.destroy();
  chart = new Chart($("chart"), {
    type: "line",
    data: { labels: d.l, datasets: [
      { label: "Your score", data: d.me, borderColor: "#6d5bd6", backgroundColor: "rgba(109,91,214,.12)", fill: true, tension: .4, borderWidth: 3, pointRadius: 4 },
      { label: "Running average", data: d.avg, borderColor: "#9aa0ae", borderDash: [6, 5], tension: .4, pointRadius: 0 } ] },
    options: { maintainAspectRatio: false, animation: { duration: 900 }, interaction: { mode: "index", intersect: false },
      scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } }, x: { grid: { display: false } } },
      plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}%` } } } },
  });
}
$("range").onchange = (e) => drawChart(e.target.value);
if (window.Chart) drawChart(7); else $("chart").parentElement.innerHTML = "<p class='muted'>Chart needs an internet connection to load Chart.js.</p>";
const tag = (arr) => arr.map((x) => `<span>${x}</span>`).join("");
$("strong").innerHTML = tag(["Operating Systems", "Data Structures Basics"]);
$("weak").innerHTML = tag(["Graph Algorithms", "SQL Joins", "Computer Networks"]);

/* ---------- Subjects ---------- */
function renderSubjects() {
  const f = $("subFilter").value;
  $("subList").innerHTML = A.filter((x) => f === "all" || x.priority === f).map((x, i) => `
   <div class="sub" data-i="${A.indexOf(x)}"><b>${x.n}</b>
     <div class="bar bg-${x.priority}"><u data-w="${x.avg}"></u></div><b>${x.avg}%</b>
     <div class="meta"><span class="pill ${x.priority}">${x.priority}</span> <small>${arrow(x.status)} ${x.status} · ${x.weak.length} weak</small></div></div>`).join("") || "<p class='muted'>No subjects match this filter.</p>";
  requestAnimationFrame(() => document.querySelectorAll(".bar u").forEach((u) => (u.style.width = u.dataset.w + "%")));
}
$("subFilter").onchange = renderSubjects;
$("subList").onclick = (e) => {
  const r = e.target.closest(".sub"); if (!r) return;
  const x = A[r.dataset.i], d = $("subDetail");
  d.innerHTML = `<b>${x.n} — detailed analysis</b><br>Average ${x.avg}% · ${x.status} (${x.gain >= 0 ? "+" : ""}${x.gain}% since first test) · <b>${x.priority}</b> priority<br>
   Recent scores: ${x.s.join("% → ")}%<br>Weak topics: ${x.weak.join(", ") || "none"}<br>Strong topics: ${x.strong.join(", ")}<br>
   <button class="btn p sm" style="margin-top:10px" data-quiz="${x.weak[0] || x.n}">Practice ${x.weak[0] || x.n}</button>`;
  d.hidden = false;
};
renderSubjects();

/* ---------- Topics ---------- */
function renderTopics(q = "") {
  const dot = { HIGH: "🔴", MEDIUM: "🟠", LOW: "🟡" };
  $("topicList").innerHTML = topics.filter((x) => (x.t + x.sub).toLowerCase().includes(q)).map((x) => { const p = priorityOf(x.score); return `
   <div class="mini topic"><h4>${dot[p]} ${x.t}</h4><div class="meta"><span>${x.sub}</span><b>${x.score}%</b></div>
   <span class="pill ${p}" style="align-self:flex-start">${p} priority</span><p>💡 ${x.tip}</p>
   <button class="btn p sm" ${APA.ready(x.sub) ? `data-act="practice" data-sub="${x.sub}"` : `data-quiz="${x.t}"`}>Practice Now</button></div>`; }).join("") || "<p class='muted'>No topics found.</p>";
}
renderTopics();

/* ---------- Study plan ---------- */
const plan = [["09:00 AM", "Revise Tree Traversal", "30 minutes", "High"], ["11:00 AM", "Practice SQL Joins", "20 minutes", "Medium"], ["04:00 PM", "Take Graph Algorithms Quiz", "15 questions", "High"]];
$("plan").innerHTML = plan.map(([t, n, d, p], i) => `<label class="task"><input type="checkbox" data-i="${i}"><div><b>${n}</b><small>${t} · ${d}</small></div><span class="pill ${p.toUpperCase()}">${p}</span></label>`).join("");
const upd = () => { const c = document.querySelectorAll(".task input:checked").length; $("planCount").textContent = `${c} / ${plan.length} tasks completed`; };
$("plan").onchange = (e) => { e.target.closest(".task").classList.toggle("done", e.target.checked); upd(); };
upd();

/* ---------- Achievements ---------- */
const badges = [["🏆", "10 Day Streak", 1], ["🔥", "Quiz Master", 1], ["📈", "Improved 20%", 1], ["🎯", "90% Score", 1], ["📚", "25 Topics Completed", 0], ["🌟", "30 Day Streak", 0]];
$("badges").innerHTML = badges.map(([i, l, on]) => `<div class="badge ${on ? "on" : "off"}" title="${on ? "Unlocked" : "Locked"}"><span>${i}</span>${l}</div>`).join("");

/* ---------- Assessments ---------- */
let showAll = false;
const cls = { Excellent: "LOW", Improved: "LOW", "Needs Improvement": "MEDIUM" };
function renderTests(q = "") {
  const f = $("testFilter").value;
  const rows = tests.filter((t) => (f === "all" || t[4] === f) && t.join(" ").toLowerCase().includes(q)).slice(0, showAll ? 99 : 3);
  $("tbody").innerHTML = rows.map((t) => `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td><b>${t[3]}%</b></td><td><span class="pill ${cls[t[4]]}">${t[4]}</span></td>
    <td><button class="btn ghost sm" data-test="${tests.indexOf(t)}">${t[4] === "Needs Improvement" ? "Review" : "View"}</button></td></tr>`).join("") || "<tr><td colspan='6' class='muted'>No results.</td></tr>";
}
$("testFilter").onchange = () => renderTests();
$("viewAll").onclick = () => { showAll = !showAll; $("viewAll").textContent = showAll ? "Show fewer ↑" : "View All Results →"; renderTests(); };
renderTests();


/* ---------- Modal + practice quiz ---------- */
function modal(html) { $("modalBox").innerHTML = html; $("modal").hidden = false; }
function closeModal() { $("modal").hidden = true; }
$("modal").onclick = (e) => { if (e.target === $("modal")) closeModal(); };
const bank = {
  "Tree Traversal": [["Which traversal visits the root first?", ["Pre-order", "In-order", "Post-order"], 0], ["In-order traversal of a BST gives…", ["Random order", "Sorted order", "Reverse order"], 1], ["Which structure does level-order use?", ["Stack", "Queue", "Heap"], 1]],
  "SQL Joins": [["Which join keeps all rows from the left table?", ["INNER", "LEFT", "CROSS"], 1], ["INNER JOIN returns…", ["Only matching rows", "All rows", "Unmatched rows"], 0], ["A join without a condition is a…", ["Self join", "Cross join", "Left join"], 1]],
  default: [["Which data structure uses FIFO?", ["Stack", "Queue", "Tree"], 1], ["BFS typically uses a…", ["Queue", "Stack", "Array only"], 0], ["Round Robin scheduling is…", ["Non-preemptive", "Preemptive", "Random"], 1]],
};
function startQuiz(topic) {
  const qs = bank[topic] || bank.default; let i = 0, score = 0;
  const show = () => {
    if (i >= qs.length) return modal(`<h2>${topic}: ${score} / ${qs.length}</h2><p class="muted">${score === qs.length ? "Great work — this topic is getting stronger." : "Keep practicing; the AI will update your plan."}</p><button class="btn" onclick="closeModal()">Done</button>`);
    const [q, o, a] = qs[i];
    modal(`<small>${topic} · Question ${i + 1} of ${qs.length}</small><h2>${q}</h2>` + o.map((t, k) => `<button class="opt" data-k="${k}">${t}</button>`).join(""));
    $("modalBox").querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
      const ok = +b.dataset.k === a; if (ok) score++;
      b.classList.add(ok ? "right" : "wrong"); $("modalBox").querySelectorAll(".opt").forEach((x) => (x.onclick = null));
      setTimeout(() => { i++; show(); }, 700);
    }));
  };
  show();
}
document.addEventListener("click", (e) => {
  const q = e.target.closest("[data-quiz]"); if (q) return startQuiz(q.dataset.quiz);
  const t = e.target.closest("[data-test]");
  if (t) { const r = tests[t.dataset.test]; if (r[5]) return modal(resultHTML(r[5])); modal(`<h2>${r[0]}</h2><p>${r[1]} · ${r[2]}</p><p><b>Score ${r[3]}%</b> — ${r[4]}</p><p class="muted">${r[3] < 70 ? "AI suggests revisiting the weak topics in this subject." : "Strong result. Keep revising to maintain it."}</p><button class="btn" onclick="closeModal()">Close</button>`); }
});

/* ---------- AI chat ---------- */
const prompts = ["What should I study today?", "Why is my score low?", "Explain my weak topics", "Create a study plan", "Give me a quiz"];
$("chips").innerHTML = prompts.map((p) => `<button>${p}</button>`).join("");
const say = (t, who) => { const m = document.createElement("div"); m.className = "msg " + who; m.innerHTML = t; $("chatBody").append(m); $("chatBody").scrollTop = 1e6; };
function reply(q) {
  q = q.toLowerCase();
  if (q.includes("quiz")) { setTimeout(() => startQuiz("Tree Traversal"), 400); return "Starting a quick Tree Traversal quiz — your lowest topic (42%)."; }
  if (q.includes("plan")) return "Today: <br>1. 09:00 Revise Tree Traversal (30 min)<br>2. 11:00 Practice SQL Joins (20 min)<br>3. 16:00 Graph Algorithms quiz (15 questions)";
  if (q.includes("low") || q.includes("why")) return `Your lowest results are ${worst[0].t} (${worst[0].score}%) and ${worst[1].t} (${worst[1].score}%). Database Management is also declining over your last 3 tests.`;
  if (q.includes("weak") || q.includes("explain")) return worst.map((x) => `• <b>${x.t}</b> (${x.score}%): ${x.tip}`).join("<br>");
  if (q.includes("study") || q.includes("today")) return `Start with <b>${worst[0].t}</b>, then <b>${worst[2].t}</b>. They have the biggest effect on your overall score.`;
  return "I can help with what to study, why a score is low, your weak topics, a study plan, or a quick quiz.";
}
const ask = (q) => { if (!q.trim()) return; say(q, "me"); setTimeout(() => say(reply(q), "bot"), 500); };
$("askBtn").onclick = () => { $("chat").hidden = !$("chat").hidden; if (!$("chatBody").children.length) say(`Hi ${Name}! I've analysed your recent tests. Ask me anything.`, "bot"); };
$("chatClose").onclick = () => ($("chat").hidden = true);
$("chips").onclick = (e) => e.target.tagName === "BUTTON" && ask(e.target.textContent);
$("chatSend").onclick = () => { ask($("chatInput").value); $("chatInput").value = ""; };
$("chatInput").onkeydown = (e) => e.key === "Enter" && $("chatSend").click();

/* ========== Subject picker, practice session, stored results (added) ========== */
$("subjectPick").innerHTML = '<option value="">Select subject…</option>' + Object.keys(APA.bank).map((s) => `<option>${s}</option>`).join("");
$("subjectPick").onchange = (e) => { const s = e.target.value; e.target.value = ""; if (s) chooseSubject(s); };
function chooseSubject(s) {
  modal(`<small>Selected Subject</small><h2>${s}</h2>` + (APA.ready(s)
    ? `<p class="muted">Choose how you want to learn.</p><button class="btn p" data-act="practice" data-sub="${s}">Practice Session</button><button class="btn" data-act="test" data-sub="${s}">Start Test (40 questions)</button>`
    : `<p class="muted">Questions for ${s} have not been added yet. Add them to the bank in questions.js.</p>`) + `<button class="btn ghost" onclick="closeModal()">Cancel</button>`);
}
let P = null;   // current practice session
function startPractice(s) { P = { s, qs: APA.questions(s, 15), i: 0 }; P.ans = P.qs.map(() => -1); drawPractice(); }
function drawPractice() {
  const { qs, ans, i } = P, q = qs[i];
  modal(`<small>${P.s} · Practice Session · Question ${i + 1} of ${qs.length}</small><div class="bar"><u style="width:${((i + 1) / qs.length) * 100}%;background:var(--primary)"></u></div><h2>${q.q.replace(/</g, "&lt;")}</h2>`
    + q.o.map((t, k) => `<button class="opt" data-pa="${k}"${ans[i] === k ? ' style="border-color:var(--primary);background:var(--primary-soft)"' : ""}>${"ABCD"[k]}. ${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</button>`).join("")
    + `<div class="row"><button class="btn ghost" data-pn="-1"${i ? "" : " disabled"}>← Previous</button><button class="btn p" data-pn="1">${i === qs.length - 1 ? "Finish" : "Next →"}</button></div>`);
}
function finishPractice() {
  const r = APA.analyse(P.s, P.qs, P.ans, "practice"); APA.save(r); P = null; applyStored();
  modal(`<h2>Practice Completed</h2><p><b>${r.correct} / ${r.total}</b> correct · ${r.percentage}%</p><p class="muted">Wrong ${r.wrong} · Unanswered ${r.unanswered}</p>
    <p class="label bad">Weak topics</p><p class="tags">${tag(r.weakTopics) || "None"}</p><p class="label ok">Strong topics</p><p class="tags">${tag(r.strongTopics) || "None"}</p>
    <button class="btn" onclick="closeModal()">Done</button>`);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-act]");
  if (a) { if (a.dataset.act === "test") { try { sessionStorage.setItem("apaSubject", a.dataset.sub); } catch (_) {} location.href = "test.html"; } else startPractice(a.dataset.sub); return; }
  if (!P) return;
  const o = e.target.closest("[data-pa]"); if (o) { P.ans[P.i] = +o.dataset.pa; return drawPractice(); }
  const n = e.target.closest("[data-pn]");
  if (n) { const d = +n.dataset.pn; if (P.i + d >= P.qs.length) return finishPractice(); P.i = Math.max(0, P.i + d); drawPractice(); }
});
function resultHTML(r) {
  const rows = Object.keys(r.topics).map((t) => `<tr><td>${t}</td><td>${r.topicStats[t][0]}/${r.topicStats[t][1]}</td><td>${r.topics[t]}%</td><td><span class="pill ${APA.pill(r.topics[t])}">${APA.status(r.topics[t])}</span></td></tr>`).join("");
  return `<div style="max-height:75vh;overflow:auto;display:flex;flex-direction:column;gap:10px"><h2>${r.subject} ${r.type === "test" ? "Assessment" : "Practice Session"}</h2>
   <p><b>${r.correct} / ${r.total}</b> · ${r.percentage}% · ${r.performance}</p><p class="muted">Correct ${r.correct} · Wrong ${r.wrong} · Unanswered ${r.unanswered}</p>
   <div class="table-wrap"><table style="min-width:0"><thead><tr><th>Topic</th><th>Right</th><th>Score</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
   <p class="label bad">Weak topics</p><p class="tags">${tag(r.weakTopics) || "None"}</p><p class="label ok">Strong topics</p><p class="tags">${tag(r.strongTopics) || "None"}</p>
   <b>AI recommendations</b>${r.recommendations.map((x) => `<small>✦ ${x}</small>`).join("")}<button class="btn" onclick="closeModal()">Close</button></div>`;
}
/* Replace demo data with the student's stored results (demo data stays when nothing is stored) */
function applyStored() {
  const all = APA.load(); if (!all.length) return;
  Object.assign(cls, { "Very Good": "LOW", Good: "LOW", "Critical Improvement Required": "HIGH" });
  const lab = (r) => new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  tests.length = 0;
  all.forEach((r) => tests.push([`${r.subject} ${r.type === "test" ? "Assessment" : "Practice Session"}`, r.subject, lab(r), r.percentage, r.performance, r]));
  const T = all.filter((r) => r.type === "test");
  if (T.length) {
    const chrono = T.slice().reverse(), by = {};
    chrono.forEach((r) => (by[r.subject] = by[r.subject] || []).push(r));
    A.length = 0;
    Object.entries(by).forEach(([n, rs]) => {
      const s = rs.map((r) => r.percentage).slice(-6), L = s.length, last = rs[rs.length - 1];
      const avg = Math.round(s.reduce((a, b) => a + b, 0) / L), falling = L >= 3 && s[L - 3] > s[L - 2] && s[L - 2] > s[L - 1], gain = Math.round(s[L - 1] - s[0]);
      const p = Math.min(2, LEVELS.indexOf(priorityOf(avg)) + (falling ? 1 : 0));
      const status = L >= 3 && Math.min(...s.slice(-3)) >= 85 ? "Mastered" : falling ? "Declining" : gain >= 5 ? "Improving" : "Stable";
      A.push({ n, s, weak: last.weakTopics, strong: last.strongTopics, avg, priority: LEVELS[p], status, gain });
    });
    topics.length = 0;
    Object.values(by).forEach((rs) => { const l = rs[rs.length - 1]; l.weakTopics.forEach((t) => topics.push({ t, sub: l.subject, score: l.topics[t], tip: `Revise ${t} and practice 10 ${t} MCQs.` })); });
    topics.sort((a, b) => a.score - b.score); topics.splice(6);
    const build = (arr, byDate) => ({ l: arr.map((r) => (byDate ? lab(r) : `Test ${chrono.indexOf(r) + 1}`)), me: arr.map((r) => r.percentage),
      avg: arr.map((_, i) => Math.round(arr.slice(0, i + 1).reduce((a, r) => a + r.percentage, 0) / (i + 1))) });
    const within = (d) => { const f = chrono.filter((r) => Date.now() - new Date(r.date) <= d * 864e5); return f.length ? f : chrono; };
    charts[7] = build(chrono.slice(-6)); charts[30] = build(within(30), 1); charts[90] = build(within(90), 1);
    const l = T[0];
    $("aiText").textContent = l.insight;
    $("strong").innerHTML = tag(l.strongTopics.slice(0, 4)); $("weak").innerHTML = tag(l.weakTopics.slice(0, 4));
    document.querySelectorAll(".stat b")[1].textContent = Math.round(T.reduce((a, r) => a + r.percentage, 0) / T.length) + "%";
    const w = l.weakTopics.slice(0, 3);
    if (w.length) $("recList").innerHTML = w.map((t) => `<div class="mini"><b>Practice ${t}</b><p>You scored ${l.topics[t]}% in ${t} (${l.subject}).</p><button class="btn p sm" data-act="practice" data-sub="${l.subject}">Start Practice</button></div>`).join("");
    renderSubjects(); renderTopics();
    if (window.Chart) drawChart($("range").value);
  }
  renderTests();
}
applyStored();
addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); });