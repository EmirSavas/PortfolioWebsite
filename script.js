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

  /* ---------- Selected projects (home page cards) ---------- */
  $("featured-h").textContent = T.featured.heading;
  var all = $("featured-all");
  all.setAttribute("href", T.featured.viewAll.href);
  all.appendChild(document.createTextNode(T.featured.viewAll.label));
  all.appendChild(svg(ARROW));

  function projectById(id) { return T.projects.items.filter(function (p) { return p.id === id; })[0]; }

  T.featured.ids.forEach(function (id) {
    var p = projectById(id);
    if (!p) { return; }
    var media = el("div", { class: "fcard-media" }, [
      el("img", { class: "fcard-bg", src: p.bg, alt: "", loading: "lazy" }),
      el("img", { class: "fcard-phone", src: (p.phones || [])[1] || (p.phones || [])[0], alt: "", loading: "lazy" }),
      el("img", { class: "fcard-logo", src: p.logo, alt: "", loading: "lazy" })
    ]);
    var tags = el("ul", { class: "tags" });
    p.tags.forEach(function (t) { tags.appendChild(el("li", { text: t })); });
    var link = el("span", { class: "fcard-link" }, [document.createTextNode(T.featured.cardLink)]);
    link.appendChild(svg(ARROW));
    var card = el("a", { class: "fcard reveal", href: "#" + p.id, "data-project": p.id }, [
      media,
      el("div", { class: "fcard-body" }, [el("h3", { text: p.title }), el("p", { text: p.short }), tags, link])
    ]);
    card.style.setProperty("--accent", p.accent || "#33dbf0");
    $("fgrid").appendChild(card);
  });

  /* ---------- About, experience, CV, contact ---------- */
  $("about-h").textContent = T.about.heading;
  T.about.paragraphs.forEach(function (t) { $("about-text").appendChild(el("p", { text: t })); });
  T.about.facts.forEach(function (f) {
    $("about-facts").appendChild(el("div", {}, [el("dt", { text: f.label }), el("dd", { text: f.value })]));
  });

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

  $("cv-h").textContent = T.cv.heading;
  $("cv-text").textContent = T.cv.text;
  $("cv-open").textContent = T.cv.viewLabel;
  $("cv-download").textContent = T.cv.downloadLabel;
  $("cv-download").setAttribute("href", T.cv.file);
  $("cvd-download").textContent = T.cv.downloadLabel;
  $("cvd-download").setAttribute("href", T.cv.file);
  $("cv-preview").appendChild(el("img", { src: T.cv.pages[0], alt: "First page of the CV", loading: "lazy" }));
  T.cv.pages.forEach(function (src, i) {
    $("cv-pages").appendChild(el("img", { src: src, alt: "CV page " + (i + 1), loading: "lazy" }));
  });

  $("proj-h").textContent = T.projects.heading;
  $("proj-intro").textContent = T.projects.intro;
  $("contact-h").textContent = T.contact.heading;
  $("contact-text").textContent = T.contact.text;
  var P = T.person, cl = $("contact-links");
  cl.appendChild(el("a", { class: "btn btn-primary", href: "mailto:" + P.email, text: T.ui.email }));
  cl.appendChild(el("a", { class: "btn", href: P.linkedin, target: "_blank", rel: "noopener", text: T.ui.linkedin }));
  if (P.github) { cl.appendChild(el("a", { class: "btn", href: P.github, target: "_blank", rel: "noopener", text: T.ui.github })); }
  $("copyright").textContent = "© " + new Date().getFullYear() + " " + P.name;

  /* ---------- Dialog helpers ---------- */
  function lockScroll(on) { document.body.classList.toggle("lock", on); }

  function openDialog(dlg, fromEl) {
    dlg.showModal();
    lockScroll(true);
    if (reduceMotion || !fromEl || !dlg.animate) { return; }
    var from = fromEl.getBoundingClientRect();
    var to = dlg.getBoundingClientRect();
    if (!to.width || !to.height) { return; }
    var s = Math.max(0.3, Math.min(1, from.width / to.width));
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    dlg.animate(
      [{ transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")", opacity: 0.2 }, { transform: "none", opacity: 1 }],
      { duration: 340, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }

  function closeDialog(dlg, toEl) {
    function done() { dlg.close(); }
    if (reduceMotion || !toEl || !dlg.animate) { done(); return; }
    var to = toEl.getBoundingClientRect();
    var from = dlg.getBoundingClientRect();
    var s = Math.max(0.3, Math.min(1, to.width / from.width));
    var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    var anim = dlg.animate(
      [{ transform: "none", opacity: 1 }, { transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")", opacity: 0 }],
      { duration: 240, easing: "ease-in" }
    );
    anim.onfinish = done;
  }

  function wireDialog(dlg, closeBtn, getReturnEl) {
    closeBtn.addEventListener("click", function () { closeDialog(dlg, getReturnEl()); });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); closeDialog(dlg, getReturnEl()); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) { closeDialog(dlg, getReturnEl()); } });
    dlg.addEventListener("close", function () {
      var anyOpen = document.querySelector("dialog[open]");
      if (!anyOpen) { lockScroll(false); }
      var r = getReturnEl();
      if (r && r.focus) { r.focus({ preventScroll: true }); }
    });
  }

  var lb = $("lightbox");
  var lbReturn = null;
  $("lb-close").textContent = T.ui.close;
  wireDialog(lb, $("lb-close"), function () { return lbReturn; });
  function openLightbox(src, alt, fromBtn) {
    lbReturn = fromBtn;
    $("lb-img").src = src;
    $("lb-img").alt = alt;
    lb.showModal();
    lockScroll(true);
  }

  var cvd = $("cv-dialog");
  var cvReturn = null;
  $("cvd-close").textContent = T.ui.close;
  wireDialog(cvd, $("cvd-close"), function () { return cvReturn; });
  function openCv(trigger) { cvReturn = trigger; openDialog(cvd, trigger); }
  $("cv-open").addEventListener("click", function () { openCv($("cv-open")); });
  $("cv-preview").addEventListener("click", function () { openCv($("cv-preview")); });

  /* ---------- Project banners ---------- */
  var banners = [];

  function buildPanel(p, panelId) {
    var text = el("div", { class: "panel-text" });
    text.appendChild(el("p", { class: "panel-summary", text: p.summary }));

    if (p.contributions && p.contributions.length) {
      var s = el("div", {});
      s.appendChild(el("h4", { text: T.ui.role }));
      var ul = el("ul", { class: "panel-list" });
      p.contributions.forEach(function (c) { ul.appendChild(el("li", { text: c })); });
      s.appendChild(ul);
      text.appendChild(s);
    }
    if (p.details && p.details.length) {
      var d = el("div", { class: "panel-details" });
      p.details.forEach(function (t) { d.appendChild(el("p", { text: t })); });
      text.appendChild(d);
    }
    var withUrl = (p.links || []).filter(function (l) { return l.url; });
    if (withUrl.length) {
      var links = el("div", { class: "panel-links", role: "group", "aria-label": T.ui.links });
      withUrl.forEach(function (l, i) {
        links.appendChild(el("a", { class: "btn" + (i === 0 ? " btn-primary" : ""), href: l.url, target: "_blank", rel: "noopener", text: l.label }));
      });
      text.appendChild(links);
    }

    var media = el("div", { class: "panel-media" });
    var shots = el("div", { class: "shots" });
    (p.phones || []).forEach(function (src, i) {
      var alt = p.title + " screenshot " + (i + 1);
      var b = el("button", { type: "button", "aria-label": "Enlarge: " + alt }, [el("img", { src: src, alt: alt, loading: "lazy" })]);
      b.addEventListener("click", function () { openLightbox(src, alt, b); });
      shots.appendChild(b);
    });
    media.appendChild(shots);
    if (p.video) {
      media.appendChild(el("iframe", {
        class: "video",
        src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(p.video),
        title: p.title + " video", loading: "lazy", allowfullscreen: "",
        allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture"
      }));
    }

    return el("div", { class: "panel", id: panelId, role: "region", "aria-label": p.title + " details" }, [
      el("div", { class: "panel-clip" }, [el("div", { class: "panel-inner" }, [text, media])])
    ]);
  }

  function setOpen(b, open) {
    b.art.classList.toggle("is-open", open);
    b.btn.setAttribute("aria-expanded", open ? "true" : "false");
    b.panel.inert = !open;
    b.cta.firstChild.textContent = open ? T.ui.collapse : T.ui.expand;
  }

  function scrollToBanner(b) {
    window.setTimeout(function () {
      b.art.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, reduceMotion ? 0 : 560);
  }

  function toggleBanner(b) {
    var willOpen = !b.art.classList.contains("is-open");
    banners.forEach(function (o) { if (o !== b) { setOpen(o, false); } });
    setOpen(b, willOpen);
    history.replaceState(null, "", willOpen ? "#" + b.id : "#projects");
    if (willOpen) { scrollToBanner(b); }
  }

  function openById(id) {
    var b = banners.filter(function (x) { return x.id === id; })[0];
    if (!b) { return false; }
    banners.forEach(function (o) { if (o !== b) { setOpen(o, false); } });
    setOpen(b, true);
    history.replaceState(null, "", "#" + id);
    scrollToBanner(b);
    return true;
  }

  T.projects.items.forEach(function (p) {
    var art = el("article", { class: "banner", id: p.id });
    art.style.setProperty("--accent", p.accent || "#7fd0e6");

    var bg = el("span", { class: "banner-bg", "aria-hidden": "true" });
    bg.style.backgroundImage = 'url("' + p.bg + '")';

    var tags = el("span", { class: "banner-tags" });
    p.tags.forEach(function (t) { tags.appendChild(el("span", { text: t })); });
    var cta = el("span", { class: "banner-cta" }, [document.createTextNode(T.ui.expand)]);
    cta.appendChild(svg(CHEVRON));

    var copy = el("span", { class: "banner-copy" }, [
      el("img", { class: "banner-logo", src: p.logo, alt: p.title }),
      el("span", { class: "banner-short", text: p.short }),
      tags,
      cta
    ]);
    var phones = el("span", { class: "phones", "aria-hidden": "true" });
    (p.phones || []).forEach(function (src) { phones.appendChild(el("img", { src: src, alt: "", loading: "lazy" })); });

    var panelId = "panel-" + p.id;
    var btn = el("button", { type: "button", class: "banner-toggle", id: "toggle-" + p.id, "aria-expanded": "false", "aria-controls": panelId, "aria-label": p.title }, [bg, copy, phones]);
    var panel = buildPanel(p, panelId);
    panel.inert = true;

    art.appendChild(el("h3", { class: "banner-h" }, [btn]));
    art.appendChild(panel);
    $("banners").appendChild(art);

    var b = { id: p.id, art: art, btn: btn, panel: panel, cta: cta };
    banners.push(b);
    btn.addEventListener("click", function () { toggleBanner(b); });
  });

  // A card on the home page opens the matching banner below.
  $("fgrid").addEventListener("click", function (e) {
    var card = e.target.closest("[data-project]");
    if (!card) { return; }
    e.preventDefault();
    openById(card.getAttribute("data-project"));
  });

  // Open a project directly from a link such as emirsavas.dev/#blast-defence
  var wanted = location.hash.replace("#", "");
  if (wanted && banners.some(function (b) { return b.id === wanted; })) {
    window.addEventListener("load", function () {
      var b = banners.filter(function (x) { return x.id === wanted; })[0];
      setOpen(b, true);
      b.art.scrollIntoView({ block: "start" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".section > h2, .section-head, .sec-head, .core, .about-grid, .cv-block, .contact > *, .reveal"));
  revealEls.forEach(function (n) { n.classList.add("reveal"); });
  // stagger siblings that share a parent
  [$("expertise"), $("fgrid"), $("journey")].forEach(function (parent) {
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
    { id: "top", nav: "#top" }, { id: "featured", nav: "#top" },
    { id: "about", nav: "#about" }, { id: "experience", nav: "#experience" },
    { id: "projects", nav: "#projects" }, { id: "cv", nav: "#cv" }, { id: "contact", nav: "#contact" }
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
