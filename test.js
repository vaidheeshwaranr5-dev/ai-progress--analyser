/* ---------- Auth + subject guard ---------- */
let email = "";
try { email = sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || ""; } catch (_) {}
const subject = (() => { try { return sessionStorage.getItem("apaSubject"); } catch (_) { return null; } })();
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const note = (m) => (document.body.innerHTML = `<div style="padding:32px;font-family:Outfit,sans-serif"><p>${m}</p><p><a href="dashboard.html">Back to Dashboard</a></p></div>`);
if (!email) location.replace("index.html");
else if (typeof APA === "undefined") note("questions.js was not found. Keep it in the same folder as test.html.");
else if (!subject) location.replace("dashboard.html");
else if (!APA.ready(subject)) note("No questions have been added for " + subject + " yet.");
else init();

function init() {
  const qs = APA.questions(subject, 40);         // 40 questions drawn from the subject's bank
  const ans = qs.map(() => -1);
  let cur = 0, submitted = false;
  $("tSubject").textContent = subject;
  document.title = subject + " Assessment | AI Progress Analyser";

  function render() {
    const q = qs[cur], n = qs.length;
    $("tCount").textContent = `Question ${cur + 1} of ${n}`;
    $("tBar").style.width = ((cur + 1) / n) * 100 + "%";
    $("qNo").textContent = `Question ${cur + 1}`;
    $("qText").textContent = q.q;
    $("opts").innerHTML = q.o.map((t, k) => `<button class="opt${ans[cur] === k ? " sel" : ""}" data-k="${k}">${"ABCD"[k]}. ${esc(t)}</button>`).join("");
    $("prev").disabled = cur === 0;
    $("next").textContent = cur === n - 1 ? "Submit Test" : "Next →";
    $("qnav").innerHTML = qs.map((_, i) => `<button class="${i === cur ? "cur" : ans[i] >= 0 ? "ans" : ""}" data-i="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`).join("");
  }
  $("opts").onclick = (e) => { const b = e.target.closest("[data-k]"); if (b) { ans[cur] = +b.dataset.k; render(); } };
  $("qnav").onclick = (e) => { const b = e.target.closest("[data-i]"); if (b) { cur = +b.dataset.i; render(); } };
  $("prev").onclick = () => { if (cur > 0) { cur--; render(); } };
  $("next").onclick = () => {
    if (cur < qs.length - 1) { cur++; render(); return; }
    const left = ans.filter((a) => a < 0).length;
    $("confirmInfo").textContent = left ? `You have ${left} unanswered question${left > 1 ? "s" : ""}.` : "All questions are answered.";
    $("confirm").hidden = false;
  };
  $("cancelSub").onclick = () => ($("confirm").hidden = true);
  $("okSub").onclick = () => {
    if (submitted) return; submitted = true;
    const r = APA.analyse(subject, qs, ans, "test");
    APA.save(r);                                   // persisted to localStorage for the dashboard
    $("confirm").hidden = true; $("quiz").hidden = true;
    showReport(r); scrollTo(0, 0);
  };
  render();

  function showReport(r) {
    const col = (p) => (p < 50 ? "#d6334f" : p <= 70 ? "#e8890c" : p > 85 ? "#1f9d63" : "#6d5bd6");
    const dot = (p) => (p < 50 ? "🔴" : "🟠");
    const rows = Object.keys(r.topics).map((t) => `<tr><td>${t}</td><td>${r.topicStats[t][0]}</td><td>${r.topicStats[t][1]}</td><td><b>${r.topics[t]}%</b></td><td><span class="pill ${APA.pill(r.topics[t])}">${APA.status(r.topics[t])}</span></td></tr>`).join("");
    $("report").innerHTML = `
     <section class="card ai-card">
       <div class="ai-head"><span class="ai-icon">✦</span><div><h2>AI Performance Analysis</h2><small class="muted">Subject: <b>${subject}</b></small></div></div>
       <p class="ai-text">${esc(r.insight)}</p>
       <div class="grid-4">
         <div class="stat"><div><small>Score</small><b>${r.correct} / ${r.total}</b></div></div>
         <div class="stat"><div><small>Percentage</small><b>${r.percentage}%</b></div></div>
         <div class="stat"><div><small>Performance</small><b style="font-size:1.15rem">${r.performance}</b></div></div>
         <div class="stat"><div><small>Wrong · Unanswered</small><b>${r.wrong} · ${r.unanswered}</b></div></div>
       </div>
     </section>
     <div class="charts">
       <section class="card"><h2>Overall Score</h2><div class="cbox"><canvas id="c1"></canvas></div></section>
       <section class="card"><h2>Topic Performance</h2><div class="cbox"><canvas id="c2"></canvas></div></section>
       <section class="card"><h2>Strong vs Weak Topics</h2><div class="cbox"><canvas id="c3"></canvas></div></section>
     </div>
     <section class="card"><h2>Topic-wise Analysis</h2><div class="table-wrap"><table><thead><tr><th>Topic</th><th>Correct</th><th>Total</th><th>Score</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div></section>
     <div class="two-col">
       <section class="card list"><h2>Topics That Need Improvement</h2>${r.weakTopics.map((t) => `<p>${dot(r.topics[t])} ${t} — ${r.topics[t]}%</p>`).join("") || "<p class='muted'>None. Great work!</p>"}</section>
       <section class="card list"><h2>Strong Areas</h2>${r.strongTopics.map((t) => `<p>🟢 ${t} — ${r.topics[t]}%</p>`).join("") || "<p class='muted'>None yet.</p>"}</section>
     </div>
     <section class="card"><h2>AI Recommendations</h2><div class="list">${r.recommendations.map((t) => `<p>✦ ${t}</p>`).join("")}</div></section>
     <div class="row"><a class="btn p" href="dashboard.html" style="text-decoration:none">Back to Dashboard</a></div>`;
    $("report").hidden = false;
    if (!window.Chart) return;
    const base = { maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } };
    new Chart($("c1"), { type: "doughnut", data: { labels: ["Correct", "Wrong", "Unanswered"], datasets: [{ data: [r.correct, r.wrong, r.unanswered], backgroundColor: ["#6d5bd6", "#d6334f", "#c9ccd6"] }] }, options: { ...base, cutout: "68%" } });
    const names = Object.keys(r.topics);
    new Chart($("c2"), { type: "bar", data: { labels: names, datasets: [{ label: "Score %", data: names.map((t) => r.topics[t]), backgroundColor: names.map((t) => col(r.topics[t])), borderRadius: 6 }] },
      options: { ...base, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 }, x: { grid: { display: false } } } } });
    new Chart($("c3"), { type: "doughnut", data: { labels: ["Strong", "Needs work"], datasets: [{ data: [r.strongTopics.length, r.weakTopics.length], backgroundColor: ["#1f9d63", "#d6334f"] }] }, options: base });
  }
}