(function () {
  "use strict";

  var LANG = "en";
  var T = (window.SITE && window.SITE[LANG]) || null;
  if (!T) { return; }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") { node.textContent = attrs[k]; }
      else if (k === "class") { node.className = attrs[k]; }
      else { node.setAttribute(k, attrs[k]); }
    });
    (children || []).forEach(function (c) { if (c) { node.appendChild(c); } });
    return node;
  }
  function svg(markup, cls) {
    var s = document.createElement("span");
    s.innerHTML = markup;
    var node = s.firstChild;
    if (cls) { node.setAttribute("class", cls); }
    return node;
  }

  var ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CALENDAR = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 6.500h12M5.500 1.500v3M10.500 1.500v3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var CHEVRON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Small animated icons for the expertise strip. Animations live in style.css. */
  var ICONS = {
    bulb: '<svg viewBox="0 0 24 24" class="ico-bulb" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.900c.6.5 1 1.200 1 2V16h5v-.1c0-.8.4-1.500 1-2A6 6 0 0 0 12 3Z"/><path class="ray" d="M3 9H1.500"/><path class="ray" d="M21 9h1.500"/><path class="ray" d="M5 3.500 4 2.500"/></svg>',
    layers: '<svg viewBox="0 0 24 24" class="ico-layers" aria-hidden="true"><path class="top" d="M12 3 2.500 8 12 13l9.500-5L12 3Z"/><path class="mid" d="m2.500 12 9.500 5 9.500-5"/><path d="m2.500 16 9.500 5 9.500-5"/></svg>',
    code: '<svg viewBox="0 0 24 24" class="ico-code" aria-hidden="true"><path class="l" d="m8 7-5 5 5 5"/><path class="r" d="m16 7 5 5-5 5"/><path d="m14 5-4 14"/></svg>',
    bars: '<svg viewBox="0 0 24 24" class="ico-bars" aria-hidden="true"><path class="b" d="M5 21v-7"/><path class="b" d="M12 21V4"/><path class="b" d="M19 21v-11"/></svg>'
  };

  /* ---------- Static text ---------- */
  document.documentElement.lang = LANG;
  document.title = T.meta.title;
  var desc = document.querySelector('meta[name="description"]');
  if (desc) { desc.setAttribute("content", T.meta.description); }

  $("skip-link").textContent = T.ui.skipToContent;
  $("brand-name").textContent = T.person.name;
  $("nav-toggle-label").textContent = T.ui.menu;

  /* ---------- Navigation ---------- */
  var nav = $("nav");
  T.nav.forEach(function (n) { nav.appendChild(el("a", { href: n.href, text: n.label })); });
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll("a"));

  var toggle = $("nav-toggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) { setMenu(false); } });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 48.01rem)").addEventListener("change", function () { setMenu(false); });

  /* ---------- Hero ---------- */
  var H = T.hero;
  $("hero-label").textContent = H.label;
  var title = $("hero-title");
  title.appendChild(document.createTextNode(H.headline + " "));
  var accent = el("span", { class: "accent", text: H.headlineAccent });
  accent.appendChild(svg('<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 8c30-5 62-6 95-4 35 2 62 2 98-2"/></svg>'));
  title.appendChild(accent);
  $("hero-text").textContent = H.text;

  var primary = el("a", { class: "btn btn-primary", href: H.primary.href }, [document.createTextNode(H.primary.label)]);
  primary.appendChild(svg(ARROW));
  $("hero-actions").appendChild(primary);
  $("hero-actions").appendChild(el("a", { class: "btn", href: H.secondary.href, text: H.secondary.label }));

  var art = $("hero-art");
  art.appendChild(svg('<svg class="art-spark" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 20 15 17M9 6l8 8M26 4l-3 11"/></svg>'));
  art.appendChild(el("span", { class: "art-dot art-dot-a" }));
  art.appendChild(el("span", { class: "art-dot art-dot-b" }));
  H.art.forEach(function (a, i) {
    art.appendChild(el("div", { class: "art-card art-" + (i + 1) }, [el("img", { src: a.src, alt: "", width: "676", height: "1200", decoding: "async" })]));
  });

  /* Expertise strip */
  T.expertise.forEach(function (x) {
    var ico = el("span", { class: "exp-ico" });
    ico.appendChild(svg(ICONS[x.icon] || ICONS.bulb));
    $("expertise").appendChild(el("li", { class: "exp-item reveal" }, [
      ico,
      el("div", {}, [el("div", { class: "exp-title", text: x.title }), el("p", { class: "exp-text", text: x.text })])
    ]));
  });

  /* ---------- About, experience, CV, contact ---------- */
  /* ---------- About ---------- */
  var A = T.about;
  $("about-eyebrow").textContent = A.eyebrow;
  (function () {
    var h = $("about-h");
    var parts = A.heading.split(A.headingAccent);
    h.appendChild(document.createTextNode(parts[0]));
    var acc = el("span", { class: "accent", text: A.headingAccent });
    acc.appendChild(svg('<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 8c30-5 62-6 95-4 35 2 62 2 98-2"/></svg>'));
    h.appendChild(acc);
    if (parts[1]) { h.appendChild(document.createTextNode(parts[1])); }
  })();

  A.steps.forEach(function (st, i) {
    var body = el("div", { class: "ab-body" }, [
      el("h3", { text: st.title }),
      highlight(el("p", { class: "ab-text" }), st.text, st.highlights)
    ]);
    $("about-steps").appendChild(el("li", { class: "ab-step reveal" }, [el("span", { class: "ab-num", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }), body]));
  });

  var AB = {
    cap: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11.200V16c0 1.200 2.700 3 6 3s6-1.800 6-3v-4.800M22 9v6"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 5l-4 14"/></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.500 8 12 13l9.500-5L12 3Z"/><path d="m2.500 12 9.500 5 9.500-5"/><path d="m2.500 16 9.500 5 9.500-5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.200"/><path d="M3 20c0-3.400 2.700-5.500 6-5.500s6 2.100 6 5.500"/><circle cx="17.500" cy="9" r="2.400"/><path d="M17 14.600c2.400.1 4 1.700 4 4.400"/></svg>'
  };
  function pills(list) {
    var ul = el("ul", { class: "ab-pills" });
    list.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
    return ul;
  }
  function glanceRow(iconKey, label, content) {
    var ico = el("span", { class: "gl-ico" });
    ico.appendChild(svg(AB[iconKey]));
    return el("div", { class: "gl-row" }, [ico, el("div", { class: "gl-main" }, [el("h4", { text: label }), content])]);
  }
  var G = A.glance;
  $("gl-h").textContent = G.heading;
  var edu = el("div", {}, [
    el("p", { class: "gl-title", text: G.education.title }),
    el("p", { class: "gl-sub", text: G.education.school }),
    el("span", { class: "gl-years", text: G.education.years })
  ]);
  $("glance-list").appendChild(glanceRow("cap", G.educationLabel, edu));
  $("glance-list").appendChild(glanceRow("code", G.toolkitLabel, pills(G.toolkit)));
  $("glance-list").appendChild(glanceRow("layers", G.expertiseLabel, pills(G.expertise)));

  $("now-label").textContent = A.currently.label;
  $("now-role").appendChild(el("strong", { text: A.currently.role }));
  $("now-role").appendChild(document.createTextNode(" · " + A.currently.company));

  $("how-label").textContent = A.how.label;
  A.how.items.forEach(function (it) {
    var ico = el("span", { class: "gl-ico" });
    ico.appendChild(svg(AB[it.icon] || AB.bolt));
    $("how-list").appendChild(el("li", { class: "how-item" }, [ico, el("div", {}, [el("h4", { text: it.title }), el("p", { text: it.text })])]));
  });
  // entrance: heading block, steps one by one, side panels, then the "how I work" strip
  Array.prototype.forEach.call($("about-steps").children, function (n, i) { n.style.setProperty("--d", i * 140 + "ms"); });
  Array.prototype.forEach.call(document.querySelectorAll(".ab-panel"), function (n, i) { n.classList.add("reveal"); n.style.setProperty("--d", 120 + i * 140 + "ms"); });
  $("about-how").classList.add("reveal");

  /* ---------- Experience: career journey ---------- */
  var X = T.experience;
  $("exp-eyebrow").textContent = X.eyebrow;
  $("exp-h").textContent = X.heading;
  $("exp-sub").textContent = X.text;
  X.items.forEach(function (it) {
    var tags = el("ul", { class: "jc-tags" });
    (it.tags || []).forEach(function (t) { tags.appendChild(el("li", { text: t })); });
    var meta = el("div", { class: "jc-meta" });
    if (it.current) { meta.appendChild(el("span", { class: "jc-pill", text: T.ui.currentRole })); }
    meta.appendChild(el("span", { class: "jc-date" }, [svg(CALENDAR), document.createTextNode(it.dates)]));
    var card = el("div", { class: "jcard" + (it.current ? " is-current" : "") }, [
      el("div", { class: "jc-main" }, [el("h3", { class: "jc-role", text: it.role }), el("p", { class: "jc-company", text: it.company }), tags]),
      el("div", { class: "jc-side" }, [meta, el("p", { class: "jc-text", text: it.summary })])
    ]);
    $("journey").appendChild(el("li", { class: "jitem reveal" + (it.current ? " is-current" : "") }, [card]));
  });
  $("core-h").textContent = X.core.heading;
  X.core.items.forEach(function (x) {
    var ico = el("span", { class: "exp-ico" });
    ico.appendChild(svg(ICONS[x.icon] || ICONS.bulb));
    $("core-list").appendChild(el("li", { class: "exp-item" }, [
      ico,
      el("div", {}, [el("div", { class: "exp-title", text: x.title }), el("p", { class: "exp-text", text: x.text })])
    ]));
  });

  /* ---------- CV: introduction column (the PDF viewer itself lives in cv.js) ---------- */
  var C = T.cv;
  function highlight(node, text, words) {
    var list = (words || []).filter(Boolean).sort(function (x, y) { return y.length - x.length; });
    if (!list.length) { node.textContent = text; return node; }
    var re = new RegExp("(" + list.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "ig");
    text.split(re).forEach(function (part, i) {
      if (i % 2) { node.appendChild(el("span", { class: "hl", text: part })); }
      else if (part) { node.appendChild(document.createTextNode(part)); }
    });
    return node;
  }
  $("cv-eyebrow").textContent = C.eyebrow;
  highlight($("cv-h"), C.heading, [C.headingHighlight]);
  highlight($("cv-text"), C.text, C.highlights);

  var DL = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="dl-arrow" d="M12 4v11M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>';
  var EYE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var fileName = decodeURIComponent(C.file.split("/").pop());
  var dl = el("a", { class: "cv-download", href: C.file, download: fileName }, [
    svg(DL),
    el("span", { class: "cv-dl-label", text: C.downloadLabel }),
    el("span", { class: "cv-size", hidden: "" })
  ]);
  var read = el("button", { type: "button", class: "cv-read", id: "cv-read" }, [svg(EYE), document.createTextNode(C.readLabel)]);
  $("cv-actions").appendChild(dl);
  $("cv-actions").appendChild(read);
  read.addEventListener("click", function () {
    var v = $("cv-viewer");
    if (!v) { return; }
    v.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.setTimeout(function () { var f = v.querySelector(".v-scroll"); if (f) { f.focus({ preventScroll: true }); } }, reduceMotion ? 0 : 500);
  });

  var FEAT = {
    doc: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6M9 9h2"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 3 14 7-6 2-2 6Z"/><path d="m13 12 5 5"/></svg>',
    printer: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7Z"/></svg>'
  };
  C.features.forEach(function (f, i) {
    var ico = el("span", { class: "feat-ico" });
    ico.appendChild(svg(FEAT[f.icon] || FEAT.doc));
    $("cv-feats").appendChild(el("li", { class: "feat" }, [
      ico,
      el("div", {}, [el("h3", { text: f.title }), el("p", { text: f.text })])
    ]));
  });
  // entrance order: label, heading, text, buttons, features one by one, then the viewer
  var cvSteps = [$("cv-eyebrow"), $("cv-h"), $("cv-text"), $("cv-actions")].concat(Array.prototype.slice.call($("cv-feats").children));
  cvSteps.forEach(function (n, i) { n.classList.add("reveal"); n.style.setProperty("--d", i * 90 + "ms"); });

  $("proj-h").textContent = T.projects.heading;
  $("proj-intro").textContent = T.projects.intro;
  /* ---------- Contact ---------- */
  var K = T.contact, P = T.person;
  $("contact-eyebrow").textContent = K.eyebrow;
  (function () {
    var h = $("contact-h");
    K.heading.split("\n").forEach(function (line, i) {
      var row = el("span", { class: "ct-line" });
      var at = line.indexOf(K.headingAccent);
      if (at < 0) { row.textContent = line; }
      else {
        row.appendChild(document.createTextNode(line.slice(0, at)));
        var acc = el("span", { class: "accent" });
        var words = K.headingAccent.split(" "), last = words.pop();
        if (words.length) { acc.appendChild(document.createTextNode(words.join(" ") + " ")); }
        var u = el("span", { class: "ct-ul", text: last });
        u.appendChild(svg('<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 8c30-5 62-6 95-4 35 2 62 2 98-2"/></svg>'));
        acc.appendChild(u);
        acc.appendChild(document.createTextNode(line.slice(at + K.headingAccent.length)));
        row.appendChild(acc);
      }
      h.appendChild(row);
    });
  })();
  $("contact-text").textContent = K.text;
  $("ct-mail-link").href = "mailto:" + P.email;
  $("ct-mail-label").textContent = K.emailLabel;
  $("ct-mail-addr").textContent = P.email;
  $("ct-copy").setAttribute("aria-label", K.copyLabel);
  $("ct-copy").title = K.copyLabel;
  $("ct-in").href = P.linkedin;
  (function () {
    var t = $("ct-in-text"), i = K.linkedinLabel.indexOf(K.linkedinBold);
    if (i < 0) { t.textContent = K.linkedinLabel; return; }
    t.appendChild(document.createTextNode(K.linkedinLabel.slice(0, i)));
    t.appendChild(el("strong", { text: K.linkedinBold }));
    t.appendChild(document.createTextNode(K.linkedinLabel.slice(i + K.linkedinBold.length)));
  })();
  // copy to clipboard, with a fallback for browsers that refuse the Clipboard API
  (function () {
    var btn = $("ct-copy"), box = $("ct-mail"), toast = $("ct-toast"), timer;
    function say(msg, ok) {
      toast.textContent = msg;
      box.classList.toggle("copied", !!ok);
      box.classList.add("toasting");
      clearTimeout(timer);
      timer = setTimeout(function () { box.classList.remove("toasting", "copied"); toast.textContent = ""; }, 2000);
    }
    function legacy() {
      var ta = el("textarea", { readonly: "", "aria-hidden": "true" });
      ta.value = P.email; ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
    btn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(P.email).then(function () { say(K.copiedLabel, true); }, function () {
          if (legacy()) { say(K.copiedLabel, true); } else { say(K.copyFailedLabel, false); }
        });
      } else if (legacy()) { say(K.copiedLabel, true); } else { say(K.copyFailedLabel, false); }
    });
  })();
  $("copyright").textContent = "\u00a9 " + new Date().getFullYear() + " " + P.name;
  highlight($("ct-tag"), K.footerRight, [K.footerHighlight]);
  // entrance: label, headline, text, email card, LinkedIn, then the illustration from the right
  [$("contact-eyebrow"), $("contact-h"), $("contact-text"), $("ct-mail"), $("ct-in")].forEach(function (n, i) { n.classList.add("reveal"); n.style.setProperty("--d", i * 100 + "ms"); });
  $("ct-art").classList.add("reveal"); $("ct-art").style.setProperty("--d", "250ms");
  $("ct-art").classList.add("reveal"); 
  [document.querySelector(".ct-foot")].forEach(function (n) { n.classList.add("reveal"); n.style.setProperty("--d", "300ms"); });

  /* ---------- Projects: stacked banners that open each project's own page ---------- */
  var PJ = T.projects;
  $("proj-eyebrow").textContent = PJ.eyebrow;
  $("proj-h").textContent = PJ.heading;
  $("proj-intro").textContent = PJ.intro;

  PJ.items.forEach(function (p) {
    var bg = el("span", { class: "pb-bg", "aria-hidden": "true" });
    bg.style.backgroundImage = 'url("' + p.bg + '")';
    var shape = el("span", { class: "pb-shape", "aria-hidden": "true" }, [bg]);

    var tags = el("ul", { class: "pb-tags" });
    p.tags.forEach(function (t) { tags.appendChild(el("li", { text: t })); });
    var cta = el("span", { class: "pb-cta" }, [document.createTextNode(T.ui.viewProject)]);
    cta.appendChild(svg(ARROW));
    var copy = el("span", { class: "pb-copy" }, [el("span", { class: "pb-short", text: p.short }), tags, cta]);
    var body = el("span", { class: "pb-body" }, [el("img", { class: "pb-logo", src: p.logo, alt: p.title }), copy]);

    var phones = el("span", { class: "pb-phones", "aria-hidden": "true" });
    (p.phones || []).forEach(function (src) { phones.appendChild(el("img", { src: src, alt: "", loading: "lazy", width: "676", height: "1200" })); });

    var a = el("a", { class: "pbanner reveal", href: "projects/" + p.id + "/", "aria-label": p.title + ": " + T.ui.viewProject }, [shape, body, phones]);
    a.style.setProperty("--accent", p.accent || "#33dbf0");
    $("banners").appendChild(el("li", {}, [a]));
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".section > h2, .sec-head, .core, .reveal"));
  revealEls.forEach(function (n) { n.classList.add("reveal"); });
  // stagger siblings that share a parent
  [$("expertise"), $("journey")].forEach(function (parent) {
    Array.prototype.forEach.call(parent.children, function (c, i) { c.style.setProperty("--d", Math.min(i, 5) * 80 + "ms"); });
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (n) { io.observe(n); });
  } else {
    revealEls.forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- Nav state: solid bar after scrolling, current section highlighted ---------- */
  var bar = $("topbar");
  var sectionMap = [
    { id: "top", nav: "#top" },
    { id: "about", nav: "#about" }, { id: "projects", nav: "#projects" },
    { id: "experience", nav: "#experience" }, { id: "cv", nav: "#cv" }, { id: "contact", nav: "#contact" }
  ];
  function setCurrent(href) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === href) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
    });
  }
  function updateCurrent() {
    var line = window.innerHeight * 0.4, current = "#top";
    sectionMap.forEach(function (s) {
      var n = $(s.id);
      if (n && n.getBoundingClientRect().top <= line) { current = s.nav; }
    });
    setCurrent(current);
  }

  /* ---------- Career journey: the line fills in as you scroll, nodes light up ---------- */
  var journey = $("journey");
  var jitems = Array.prototype.slice.call(journey.children);
  function updateJourney() {
    if (jitems.length < 2) { return; }
    var first = jitems[0], last = jitems[jitems.length - 1];
    var lh = last.offsetTop - first.offsetTop;
    var fill = reduceMotion ? lh : Math.max(0, Math.min(lh, window.innerHeight * 0.72 - journey.getBoundingClientRect().top - first.offsetTop));
    journey.style.setProperty("--lh", lh + "px");
    journey.style.setProperty("--p", lh ? (fill / lh).toFixed(4) : "1");
    jitems.forEach(function (li) { li.classList.toggle("reached", li.offsetTop - first.offsetTop <= fill + 1); });
  }
  window.addEventListener("load", updateJourney);

  /* ---------- Parallax (transform only, one frame per scroll or pointer event) ---------- */
  var hero = $("top");
  var ticking = false, px = 0, py = 0;
  function frame() {
    ticking = false;
    var y = window.scrollY;
    bar.classList.toggle("scrolled", y > 8);
    updateCurrent();
    updateJourney();
    if (!reduceMotion && y < 1400) {
      hero.style.setProperty("--sy", y.toFixed(1));
      hero.style.setProperty("--px", px.toFixed(1));
      hero.style.setProperty("--py", py.toFixed(1));
    }
  }
  function request() { if (!ticking) { ticking = true; window.requestAnimationFrame(frame); } }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 22;
      py = ((e.clientY - r.top) / r.height - 0.5) * 14;
      request();
    });
  }
  frame();
})();
