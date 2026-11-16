/* Privacy-friendly analytics (Umami, no cookies). Does nothing until a Website ID is set in content.js. */
(function () {
  "use strict";
  var A = (window.SITE && window.SITE.analytics) || {};
  var ID = A.umamiWebsiteId;
  if (!ID) { return; }

  var queue = [];
  function send(name, data) {
    try {
      if (window.umami && typeof window.umami.track === "function") { window.umami.track(name, data || {}); }
      else { queue.push([name, data]); }
    } catch (e) { /* analytics must never break the page */ }
  }

  var s = document.createElement("script");
  s.defer = true;
  s.src = A.scriptUrl || "https://cloud.umami.is/script.js";
  s.setAttribute("data-website-id", ID);
  if (A.domains) { s.setAttribute("data-domains", A.domains); }   // ignores localhost, github.io previews, etc.
  s.setAttribute("data-do-not-track", "true");                     // respects the browser's Do Not Track setting
  s.onload = function () { queue.splice(0).forEach(function (q) { send(q[0], q[1]); }); };
  document.head.appendChild(s);

  var path = location.pathname;
  var m = path.match(/projects\/([^/]+)/);
  var project = m ? m[1] : null;

  /* Where visitors came from: ?ref=company-name on a link you send is recorded as an event */
  try {
    var ref = new URLSearchParams(location.search).get("ref");
    if (ref) { send("campaign_visit", { ref: ref.slice(0, 60) }); }
  } catch (e) { /* ignore */ }

  /* Clicks. One delegated listener covers buttons that are built by script after load. */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest ? ev.target.closest("a, button") : null;
    if (!t) { return; }
    var href = t.getAttribute("href") || "";
    var label = (t.getAttribute("aria-label") || t.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);

    if (t.matches(".hero .btn-primary")) { return send("cta_view_projects"); }
    if (t.matches(".hero .btn")) { return send("cta_view_cv"); }
    if (t.closest("#nav")) { return send("nav_click", { to: href }); }
    if (t.matches(".pbanner")) { return send("project_open", { project: (href.match(/projects\/([^/]+)/) || [])[1] || href }); }
    if (t.matches(".cv-download, .v-btn-dl")) { return send("cv_download"); }
    if (t.matches(".v-btn, .v-exit")) { return send("cv_viewer_action", { action: label }); }
    if (t.id === "ct-mail-link") { return send("contact_email_click"); }
    if (t.id === "ct-copy") { return send("contact_email_copy"); }
    if (t.id === "ct-in") { return send("contact_linkedin_click"); }
    if (t.matches(".back")) { return send("project_back", { project: project }); }
    if (t.matches(".gal-item.is-video")) { return send("project_video_play", { project: project }); }
    if (t.matches(".gal-item")) { return send("project_gallery_open", { project: project }); }
    if (t.closest(".plinks")) { return send("project_link_click", { project: project, link: label }); }
    if (t.target === "_blank" && /^https?:/.test(href)) { return send("outbound_click", { to: href.replace(/^https?:\/\//, "").slice(0, 80) }); }
  }, true);

  /* Which sections were actually looked at (once per visit each) */
  if ("IntersectionObserver" in window && !project) {
    var seen = {}, timers = {};
    // a section counts as "looked at" only after it stays on screen for ~1.2 s, so scrolling past it does not count
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var id = e.target.id;
        if (e.isIntersecting && !seen[id]) {
          timers[id] = setTimeout(function () { seen[id] = 1; send("section_view", { section: id }); }, 1200);
        } else if (!e.isIntersecting && timers[id]) { clearTimeout(timers[id]); timers[id] = 0; }
      });
    }, { threshold: 0.4 });
    ["top", "about", "projects", "experience", "cv", "contact"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) { io.observe(n); }
    });
  }

  /* How far down the page, and how long they stayed */
  var maxDepth = 0, marks = [25, 50, 75, 100], sent = {};
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) { return; }
    var p = Math.min(100, Math.round(window.scrollY / h * 100));
    if (p > maxDepth) { maxDepth = p; }
    marks.forEach(function (m) { if (p >= m && !sent[m]) { sent[m] = 1; send("scroll_depth", { depth: m, page: project || "home" }); } });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  var visible = 0, since = document.visibilityState === "visible" ? Date.now() : 0, reported = false;
  function report() {
    if (reported) { return; }
    if (since) { visible += Date.now() - since; since = 0; }
    var sec = Math.round(visible / 1000);
    if (sec < 3) { return; }
    reported = true;
    var bucket = sec < 10 ? "3-10s" : sec < 30 ? "10-30s" : sec < 60 ? "30-60s" : sec < 180 ? "1-3min" : "3min+";
    send("time_on_page", { page: project || "home", time: bucket });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { report(); }
    else { since = Date.now(); reported = false; }
  });
  window.addEventListener("pagehide", report);
})();
