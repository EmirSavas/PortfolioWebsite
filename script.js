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
    gamepad: '<svg viewBox="0 0 24 24" class="ico-pad" aria-hidden="true"><path d="M6 8h12a4 4 0 0 1 3.900 3.100l.8 4.200a2.800 2.800 0 0 1-4.900 2.300L16 16H8l-1.800 1.600a2.800 2.800 0 0 1-4.900-2.300l.8-4.200A4 4 0 0 1 6 8Z"/><path class="dpad" d="M8 10.500v3M6.500 12h3"/><circle class="btn-a" cx="15.500" cy="11" r=".6"/><circle class="btn-b" cx="17.500" cy="13" r=".6"/></svg>',
    cycle: '<svg viewBox="0 0 24 24" class="ico-cycle" aria-hidden="true"><g class="spin"><path d="M20 11a8 8 0 0 0-14.500-4M4 13a8 8 0 0 0 14.500 4"/><path d="M5.500 3v4h4M18.500 21v-4h-4"/></g></svg>',
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
  $("hero-name").textContent = T.person.name;
  $("hero-label").textContent = H.label;
  (function () {
    // two lines: the lead-in, then the highlighted phrase with a hand-drawn underline under its last word
    var t = $("hero-title"), at = H.headline.indexOf(H.headlineHighlight);
    if (at < 0) { t.textContent = H.headline; return; }
    var lead = H.headline.slice(0, at).trim(), tail = H.headline.slice(at + H.headlineHighlight.length);
    if (lead) { t.appendChild(el("span", { class: "hl-lead", text: lead })); }
    var words = H.headlineHighlight.split(" "), last = words.pop() + tail;
    var hl = el("span", { class: "hl hl-main" });
    if (words.length) { hl.appendChild(document.createTextNode(words.join(" ") + " ")); }
    var u = el("span", { class: "hl-ul", text: last });
    u.appendChild(svg('<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 8c30-5 62-6 95-4 35 2 62 2 98-2"/></svg>'));
    hl.appendChild(u);
    t.appendChild(hl);
  })();
  $("hero-text").textContent = H.text;

  var PAD = '<svg class="btn-ico" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12a4 4 0 0 1 3.900 3.100l.8 4.200a2.800 2.800 0 0 1-4.900 2.300L16 16H8l-1.800 1.600a2.800 2.800 0 0 1-4.900-2.300l.8-4.200A4 4 0 0 1 6 8Z"/><path d="M8 10.500v3M6.500 12h3M15.500 11h.01M17.500 13h.01"/></svg>';
  var DOC = '<svg class="btn-ico" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>';
  var primary = el("a", { class: "btn btn-primary", href: H.primary.href });
  primary.appendChild(svg(PAD));
  primary.appendChild(document.createTextNode(H.primary.label));
  primary.appendChild(svg(ARROW));
  $("hero-actions").appendChild(primary);
  var secondary = el("a", { class: "btn", href: H.secondary.href });
  secondary.appendChild(svg(DOC));
  secondary.appendChild(document.createTextNode(H.secondary.label));
  $("hero-actions").appendChild(secondary);

  var art = $("hero-art");
  art.appendChild(svg('<svg class="art-spark" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 20 15 17M9 6l8 8M26 4l-3 11"/></svg>'));
  art.appendChild(el("span", { class: "art-dot art-dot-a" }));
  art.appendChild(el("span", { class: "art-dot art-dot-b" }));
  H.art.forEach(function (a, i) {
    art.appendChild(el("div", { class: "art-card art-" + (i + 1) }, [el("img", { src: a.src, alt: "", width: "676", height: "1200", decoding: "async" })]));
  });


  /* Very few, very slow particles in the hero background (CSS-animated, transform + opacity only) */
  (function () {
    var box = $("particles"), spots = [[8, 22], [18, 70], [31, 40], [44, 84], [57, 18], [66, 62], [74, 30], [83, 76], [91, 14], [95, 52]];
    spots.forEach(function (p, i) {
      var d = el("i", {});
      d.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;--s:" + (2 + (i % 3)) + "px;--t:" + (14 + (i * 3) % 11) + "s;--w:" + (-i * 2.3).toFixed(1) + "s";
      box.appendChild(d);
    });
    [[58, 34, 0], [88, 62, 5], [47, 78, 9]].forEach(function (p) {
      var r = el("b", {});
      r.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;--w:" + p[2] + "s";
      box.appendChild(r);
    });
  })();

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
  $("about-h").textContent = A.heading;

  A.steps.forEach(function (st, i) {
    var body = el("div", { class: "ab-body" }, [
      el("h3", { text: st.title }),
      highlight(el("p", { class: "ab-text" }), st.text, st.highlights)
    ]);
    var li = el("li", { class: "ab-step reveal" }, [el("span", { class: "ab-num", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }), body]);
    li.style.setProperty("--d", i * 220 + "ms");
    $("about-steps").appendChild(li);
  });

  var AB = {
    cap: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11.200V16c0 1.200 2.700 3 6 3s6-1.800 6-3v-4.800M22 9v6"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 5l-4 14"/></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.500 8 12 13l9.500-5L12 3Z"/><path d="m2.500 12 9.500 5 9.500-5"/><path d="m2.500 16 9.500 5 9.500-5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.500 10.900c.6.500 1 1.200 1 2V16h5v-.100c0-.800.400-1.500 1-2A6 6 0 0 0 12 3Z"/></svg>',
    bars: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M7 20v-6M12 20V6M17 20v-9"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.200"/><path d="M3 20c0-3.400 2.700-5.500 6-5.500s6 2.100 6 5.500"/><circle cx="17.500" cy="9" r="2.400"/><path d="M17 14.600c2.400.1 4 1.700 4 4.400"/></svg>'
  };
  function icon(key) {
    var ico = el("span", { class: "gl-ico" });
    ico.appendChild(svg(AB[key] || AB.bolt));
    return ico;
  }
  function chips(list) {
    var ul = el("ul", { class: "ab-pills" });
    list.forEach(function (t, i) {
      var li = el("li", { text: t });
      li.style.setProperty("--i", i);
      ul.appendChild(li);
    });
    return ul;
  }
  function glanceCard(iconKey, label, content, n) {
    var card = el("section", { class: "gl-card reveal" }, [
      el("div", { class: "gl-top" }, [icon(iconKey), el("h4", { text: label })]),
      content
    ]);
    card.style.setProperty("--d", 120 + n * 140 + "ms");
    return card;
  }
  var G = A.glance;
  $("gl-h").textContent = G.heading;
  var edu = el("div", { class: "gl-edu" }, [
    el("div", {}, [
      el("p", { class: "gl-title", text: G.education.title }),
      el("p", { class: "gl-sub", text: G.education.school })
    ]),
    el("span", { class: "gl-years", text: G.education.years })
  ]);
  $("glance-list").appendChild(glanceCard("cap", G.educationLabel, edu, 0));
  $("glance-list").appendChild(glanceCard("code", G.toolkitLabel, chips(G.toolkit), 1));
  $("glance-list").appendChild(glanceCard("layers", G.expertiseLabel, chips(G.expertise), 2));

  $("how-label").textContent = A.how.label;
  A.how.items.forEach(function (it, i) {
    var li = el("li", { class: "how-item reveal" }, [
      icon(it.icon),
      el("div", { class: "how-copy" }, [
        el("span", { class: "how-n", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }),
        el("h4", { text: it.title }),
        el("p", { text: it.text })
      ])
    ]);
    li.style.setProperty("--d", i * 120 + "ms");
    $("how-list").appendChild(li);
  });

  // a few very quiet particles in the About background
  (function () {
    var xs = $("exp-stars");
    if (xs) {
      var n = Math.max(40, Math.round(xs.parentNode.offsetHeight / 24));
      for (var k = 0; k < n; k++) {
        var s = el("i", {});
        var side = Math.random();
        var x = side < 0.25 ? Math.random() * 14 : side < 0.7 ? 62 + Math.random() * 38 : Math.random() * 100;
        s.style.left = x.toFixed(1) + "%";
        s.style.top = (Math.random() * 100).toFixed(1) + "%";
        var big = Math.random() < 0.16;
        s.style.setProperty("--s", (big ? 2.4 + Math.random() * 1.4 : 1 + Math.random() * 1.4).toFixed(1) + "px");
        s.style.setProperty("--t", (3 + Math.random() * 5).toFixed(1) + "s");
        s.style.setProperty("--w", (-Math.random() * 8).toFixed(1) + "s");
        if (big) { s.className = "big"; }
        if (Math.random() < 0.3) { s.className += " dr"; s.style.setProperty("--dt", (11 + Math.random() * 10).toFixed(1) + "s"); }
        xs.appendChild(s);
      }
    }
    ["ab-dots", "pj-dots"].forEach(function (id) {
    var box = $(id);
    if (!box) { return; }
    for (var i = 0; i < 14; i++) {
      var d = el("i", {});
      d.style.left = (Math.random() * 100).toFixed(1) + "%";
      d.style.top = (Math.random() * 100).toFixed(1) + "%";
      d.style.setProperty("--s", (1 + Math.random() * 1.5).toFixed(1) + "px");
      d.style.setProperty("--t", (9 + Math.random() * 9).toFixed(1) + "s");
      d.style.setProperty("--w", (-Math.random() * 12).toFixed(1) + "s");
      box.appendChild(d);
    }
    });
  })();

  /* ---------- Experience: career journey ---------- */
  var X = T.experience;
  $("exp-eyebrow").textContent = X.eyebrow;
  $("exp-h").textContent = X.heading;
  $("exp-sub").textContent = X.text;
  var XI = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var XICONS = {
    roadmap: XI('<path d="M5 21V4"/><path d="M5 4h12l-2.500 4 2.500 4H5"/>'),
    map: XI('<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>')
  };
  X.items.forEach(function (it, i) {
    var tags = el("ul", { class: "jc-tags" });
    (it.tags || []).forEach(function (t) { tags.appendChild(el("li", { text: t })); });
    var head = el("div", { class: "jc-head" }, [
      el("div", { class: "jc-id" }, [el("h3", { class: "jc-role", text: it.role }), el("p", { class: "jc-company", text: it.company })]),
      el("span", { class: "jc-date" }, [svg(CALENDAR), document.createTextNode(it.dates)])
    ]);
    var list = el("ul", { class: "jc-points" });
    (it.points || []).forEach(function (pt) {
      list.appendChild(highlight(el("li", {}), pt.text, pt.hl));
    });
    var card = el("div", { class: "jcard jc-" + (it.level || "normal") }, [
      head, tags,
      highlight(el("p", { class: "jc-intro" }), it.intro, it.introHl),
      el("p", { class: "jc-label", text: X.keyLabel || "Key responsibilities" }),
      list
    ]);
    var node = el("span", { class: "jn", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") });
    $("journey").appendChild(el("li", { class: "jitem reveal" + (it.level === "primary" ? " is-primary" : "") }, [node, card]));
  });
  $("core-h").textContent = X.core.heading;
  X.core.items.forEach(function (x) {
    var ico = el("span", { class: "exp-ico" });
    ico.appendChild(svg(XICONS[x.icon] || ICONS[x.icon] || ICONS.bulb));
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
  highlight($("cv-h"), C.heading, [C.headingHighlight]);
  highlight($("cv-text"), C.text, C.highlights);

  var DL = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="dl-arrow" d="M12 4v11M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>';
  var fileName = decodeURIComponent(C.file.split("/").pop());
  var dl = el("a", { class: "cv-download", href: C.file, download: fileName }, [
    svg(DL),
    el("span", { class: "cv-dl-label", text: C.downloadLabel }),
    el("span", { class: "cv-size", hidden: "" })
  ]);
  $("cv-actions").appendChild(dl);

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
  // entrance order: heading, text, buttons, features one by one, then the viewer
  var cvSteps = [$("cv-h"), $("cv-text"), $("cv-actions")].concat(Array.prototype.slice.call($("cv-feats").children));
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
  // one-time: the paper airplane glides in along its trail to where it rests, then stays put
  (function () {
    var art = $("ct-art"), plane = art && art.querySelector(".ct-plane"), svgEl = art && art.querySelector(".ct-svg");
    if (!plane || !svgEl || reduceMotion || !plane.animate || !("IntersectionObserver" in window)) { return; }
    svgEl.classList.add("ct-pending");
    // the trail's own curve: M40 410 C120 400 220 360 262 300; offsets are relative to where the plane rests
    var B = [[40, 410], [120, 400], [220, 360], [262, 300]], N = 32, move = [], end = null;
    function pt(u) {
      var m = 1 - u;
      return [m * m * m * B[0][0] + 3 * m * m * u * B[1][0] + 3 * m * u * u * B[2][0] + u * u * u * B[3][0],
              m * m * m * B[0][1] + 3 * m * m * u * B[1][1] + 3 * m * u * u * B[2][1] + u * u * u * B[3][1]];
    }
    function ang(u) {
      var m = 1 - u;
      var dx = 3 * m * m * (B[1][0] - B[0][0]) + 6 * m * u * (B[2][0] - B[1][0]) + 3 * u * u * (B[3][0] - B[2][0]);
      var dy = 3 * m * m * (B[1][1] - B[0][1]) + 6 * m * u * (B[2][1] - B[1][1]) + 3 * u * u * (B[3][1] - B[2][1]);
      return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    end = pt(1);
    var endAng = ang(1);
    // arc length lookup so the tail head stays glued to the plane
    var cum = [0], prev = pt(0);
    for (var j = 1; j <= 120; j++) { var q = pt(j / 120); cum.push(cum[j - 1] + Math.hypot(q[0] - prev[0], q[1] - prev[1])); prev = q; }
    function arc(u) { var f = u * 120, k = Math.min(119, Math.floor(f)); return (cum[k] + (cum[k + 1] - cum[k]) * (f - k)) / cum[120]; }
    var tails = Array.prototype.slice.call(art.querySelectorAll(".ct-tail path")), tailKeys = tails.map(function () { return []; });
    for (var i = 0; i <= N; i++) {
      var t = i / N, u = 1 - Math.pow(1 - t, 2.3), p = pt(u), hd = arc(u);
      move.push({ translate: (p[0] - end[0]).toFixed(2) + "px " + (p[1] - end[1]).toFixed(2) + "px", rotate: ((ang(u) - endAng) * 0.4).toFixed(2) + "deg", offset: t });
      tails.forEach(function (tp, k) { var L = parseFloat(tp.style.getPropertyValue("--l")); tailKeys[k].push({ strokeDashoffset: (L - hd).toFixed(4), offset: t }); });
    }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) { return; }
      io.disconnect();
      window.setTimeout(function () {
        plane.animate(move, { duration: 1700, easing: "linear", composite: "add" });
        plane.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0.16 }, { opacity: 1, offset: 1 }], { duration: 1700, easing: "linear" });
        tails.forEach(function (tp, k) { tp.animate(tailKeys[k], { duration: 1700, easing: "linear" }); });
        var lk = art.querySelector(".ct-link");
        if (lk) { lk.animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: 0.7 }, { opacity: 0.7, offset: 1 }], { duration: 1700, easing: "linear" }); }
        svgEl.classList.remove("ct-pending");
      }, 900);
    }, { threshold: 0.45 });
    io.observe(art);
  })();
  [document.querySelector(".ct-foot")].forEach(function (n) { n.classList.add("reveal"); n.style.setProperty("--d", "300ms"); });

  /* ---------- Projects: stacked banners that open each project's own page ---------- */
  var PJ = T.projects;
  $("proj-eyebrow").textContent = PJ.eyebrow;
  $("proj-h").textContent = PJ.heading;
  $("proj-intro").textContent = PJ.intro;

  var TI = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var TAGICON = {
    "mobile": TI('<rect x="7" y="2.500" width="10" height="19" rx="2.500"/><path d="M11 18.500h2"/>'),
    "puzzle": TI('<path d="M10 3a2 2 0 0 1 4 0v2h4v4h-2a2 2 0 0 0 0 4h2v6h-6v-2a2 2 0 0 0-4 0v2H4v-6h2a2 2 0 0 0 0-4H4V5h6Z"/>'),
    "hybrid-casual": TI('<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>'),
    "idle": TI('<path d="M4 20h16"/><path d="M7 20v-6M12 20V6M17 20v-9"/>'),
    "casual": TI('<path d="M6 8h12a4 4 0 0 1 3.900 3.100l.8 4.200a2.800 2.800 0 0 1-4.900 2.300L16 16H8l-1.800 1.600a2.800 2.800 0 0 1-4.900-2.300l.8-4.200A4 4 0 0 1 6 8Z"/><path d="M8 10.500v3M6.500 12h3"/>'),
    "arcade idle": TI('<path d="M6 8h12a4 4 0 0 1 3.900 3.100l.8 4.200a2.800 2.800 0 0 1-4.900 2.300L16 16H8l-1.800 1.600a2.800 2.800 0 0 1-4.900-2.300l.8-4.200A4 4 0 0 1 6 8Z"/><path d="M8 10.500v3M6.500 12h3"/>')
  };

  PJ.items.forEach(function (p) {
    var bg = el("span", { class: "pb-bg", "aria-hidden": "true" });

    var shape = el("span", { class: "pb-shape", "aria-hidden": "true" }, [bg]);

    var tags = el("ul", { class: "pb-tags" });
    p.tags.forEach(function (t) {
      var li = el("li", {});
      var k = TAGICON[t.toLowerCase()];
      if (k) { li.appendChild(svg(k)); }
      li.appendChild(document.createTextNode(t));
      tags.appendChild(li);
    });
    var cta = el("span", { class: "pb-cta" }, [document.createTextNode(T.ui.viewProject)]);
    cta.appendChild(svg(ARROW));
    var copy = el("span", { class: "pb-copy" }, [el("span", { class: "pb-short", text: p.short }), tags, cta]);
    var body = el("span", { class: "pb-body" }, [el("img", { class: "pb-logo", src: p.logo, alt: p.title }), copy]);

    var phones = el("span", { class: "pb-phones", "aria-hidden": "true" });
    (p.phones || []).forEach(function (src) { phones.appendChild(el("img", { src: src, alt: "", loading: "lazy", width: "676", height: "1200" })); });

    var a = el("a", { class: "pbanner reveal", href: "projects/" + p.id + "/", "aria-label": p.title + ": " + T.ui.viewProject }, [shape, body, phones]);
    a.style.setProperty("--accent", p.accent || "#33dbf0");
    a.style.setProperty("--bgu", 'url("' + (p.banner || p.bg) + '")');
    $("banners").appendChild(el("li", {}, [a]));
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".section > h2, .sec-head, .core, .reveal"));
  revealEls.forEach(function (n) { n.classList.add("reveal"); });
  // stagger siblings that share a parent
  [$("expertise"), $("journey")].forEach(function (parent) {
    // on first load the hero strip comes in last, after the copy and the screenshots
    var base = (parent === $("expertise") && window.scrollY < 80) ? 1050 : 0;
    Array.prototype.forEach.call(parent.children, function (c, i) { c.style.setProperty("--d", base + Math.min(i, 5) * 90 + "ms"); });
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
