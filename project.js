/*
  Project page template. One file renders every project from content.js.
  The page address (projects/<id>/) decides which project is shown.
*/
(function () {
  "use strict";

  var T = (window.SITE && window.SITE.en) || null;
  if (!T) { return; }

  var ROOT = "../../";
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
  var S = function (paths, extra) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"' + (extra || "") + ">" + paths + "</svg>";
  };

  var ICONS = {
    bulb: S('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.500 10.900c.6.5 1 1.200 1 2V16h5v-.1c0-.8.4-1.500 1-2A6 6 0 0 0 12 3Z"/>'),
    layers: S('<path d="M12 3 2.500 8 12 13l9.500-5L12 3Z"/><path d="m2.500 12 9.500 5 9.500-5"/><path d="m2.500 16 9.500 5 9.500-5"/>'),
    code: S('<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/><path d="m14 5-4 14"/>'),
    bars: S('<path d="M5 21v-7M12 21V4M19 21v-11"/>'),
    people: S('<circle cx="9" cy="8" r="3.200"/><path d="M3 20c0-3.400 2.700-5.500 6-5.500s6 2.100 6 5.500"/><circle cx="17.500" cy="9" r="2.400"/><path d="M17 14.600c2.400.1 4 1.700 4 4.400"/>'),
    flask: S('<path d="M9 3h6M10 3v6l-5.500 9.500A1.800 1.800 0 0 0 6 21h12a1.800 1.800 0 0 0 1.500-2.500L14 9V3"/><path d="M7.500 15h9"/>'),
    platform: S('<rect x="7" y="2.500" width="10" height="19" rx="2.500"/><path d="M11 18.500h2"/>'),
    genre: S('<path d="M7 7h10a4 4 0 0 1 3.800 2.800l.9 3.400A3 3 0 0 1 18.500 17c-1 0-1.700-.6-2.300-1.400L15 14H9l-1.200 1.600C7.200 16.400 6.500 17 5.500 17a3 3 0 0 1-3.200-3.800l.9-3.400A4 4 0 0 1 7 7Z"/><path d="M8 10v3M6.500 11.500h3"/>'),
    model: S('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.500 9.500c.5-1 1.500-1.500 2.500-1.500 1.500 0 2.500.8 2.500 2s-1 1.700-2.500 2-2.500.9-2.500 2 1 2 2.500 2c1 0 2-.5 2.500-1.500"/>'),
    role: S('<circle cx="12" cy="8" r="3.500"/><path d="M4.500 20.500c0-4 3.400-6.500 7.500-6.500s7.500 2.500 7.500 6.500"/>'),
    info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.1"/>'),
    link: S('<path d="M10 14a4.500 4.500 0 0 0 6.400 0l3-3a4.500 4.500 0 0 0-6.400-6.400l-1 1"/><path d="M14 10a4.500 4.500 0 0 0-6.400 0l-3 3a4.500 4.500 0 0 0 6.400 6.400l1-1"/>'),
    tools: S('<path d="M12 2.500 3.500 7v10l8.500 4.500 8.500-4.500V7L12 2.500Z"/><path d="m3.500 7 8.500 4.500L20.500 7M12 11.500v10"/>'),
    external: S('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.200" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.200" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.500v13a1 1 0 0 0 1.500.9l10.500-6.500a1 1 0 0 0 0-1.800L9.500 4.600A1 1 0 0 0 8 5.500Z" fill="currentColor"/></svg>',
    googleplay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3.200v17.600a1 1 0 0 0 1.500.9l1-.6L14 12 6.500 3.900l-1 .4A1 1 0 0 0 4 3.200Z" fill="#35e0f2"/><path d="m6.500 3.900 7.500 8.100 3-3L7.700 3.500a1 1 0 0 0-1.200.4Z" fill="#6ee37a"/><path d="m6.500 20.100 7.500-8.100 3 3-9.300 5.500a1 1 0 0 1-1.200-.4Z" fill="#f2495c"/><path d="m17 9-3 3 3 3 3.300-1.900a1.300 1.300 0 0 0 0-2.200L17 9Z" fill="#ffd23f"/></svg>',
    appstore: S('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m8.500 16.500 6.500-10M9.500 7.500l6 9M7.500 13h9"/>'),
    chevL: S('<path d="m15 5-7 7 7 7"/>', ' stroke-width="2.2"'),
    chevR: S('<path d="m9 5 7 7-7 7"/>', ' stroke-width="2.2"'),
    arrowL: S('<path d="M20 12H4M10 6l-6 6 6 6"/>', ' stroke-width="2"')
  };
  function icon(name) { return svg(ICONS[name] || ICONS.bulb); }

  /* ---------- Which project? ---------- */
  var items = T.projects.items;
  var m = location.pathname.match(/projects\/([^\/]+)/);
  var slug = m ? decodeURIComponent(m[1]) : (new URLSearchParams(location.search).get("p") || location.hash.replace("#", ""));
  var p = items.filter(function (x) { return x.id === slug; })[0];
  var asset = function (src) { return /^(https?:|data:|\/)/.test(src) ? src : ROOT + src; };

  /* ---------- Navigation (same bar as the home page) ---------- */
  document.documentElement.lang = "en";
  $("skip-link").textContent = T.ui.skipToContent;
  $("brand-name").textContent = T.person.name;
  $("nav-toggle-label").textContent = T.ui.menu;
  var nav = $("nav");
  T.nav.forEach(function (n) {
    var a = el("a", { href: n.href.charAt(0) === "#" ? ROOT + n.href : n.href, text: n.label });
    if (n.href === "#projects") { a.setAttribute("aria-current", "true"); }
    nav.appendChild(a);
  });
  var toggle = $("nav-toggle");
  function setMenu(open) { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open ? "true" : "false"); }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });
  window.matchMedia("(min-width: 48.01rem)").addEventListener("change", function () { setMenu(false); });
  var bar = $("topbar");
  function onScroll() { bar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var app = $("app");
  if (!p) {
    app.appendChild(el("section", { class: "wrap section" }, [
      el("h1", { text: T.ui.notFound }),
      el("p", {}, [el("a", { href: ROOT + "#projects", text: T.ui.back })])
    ]));
    return;
  }

  /* ---------- Helpers ---------- */
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  // Plain text with the chosen words wrapped in <mark class="hl">
  function highlighted(tag, cls, text, words) {
    var node = el(tag, { class: cls });
    var list = (words || []).filter(Boolean).sort(function (a, b) { return b.length - a.length; });
    if (!list.length) { node.textContent = text; return node; }
    var re = new RegExp("(" + list.map(esc).join("|") + ")", "ig");
    text.split(re).forEach(function (part, i) {
      if (i % 2) { node.appendChild(el("mark", { class: "hl", text: part })); }
      else if (part) { node.appendChild(document.createTextNode(part)); }
    });
    return node;
  }
  function labelFor(l) { return l.label || ""; }
  function linkIcon(label) {
    if (/google\s*play/i.test(label)) { return "googleplay"; }
    if (/app\s*store/i.test(label)) { return "appstore"; }
    if (/video|youtube|gameplay|cpi|trailer/i.test(label)) { return "play"; }
    return "link";
  }

  document.title = p.title + " | " + T.person.name;
  var accent = p.accent || "#33dbf0";

  /* ---------- Hero ---------- */
  var tags = el("ul", { class: "tags" });
  p.tags.forEach(function (t) { tags.appendChild(el("li", { text: t })); });
  var back = el("a", { class: "back", href: ROOT + "#projects" }, [icon("arrowL"), document.createTextNode(T.ui.back)]);

  var heroBg = el("div", { class: "phero-bg", "aria-hidden": "true" });
  heroBg.style.backgroundImage = 'url("' + asset(p.bg) + '")';

  var art = el("div", { class: "phero-art", "aria-hidden": "true" });
  var phones = (p.phones || []).slice(0, 3);
  // order: back-left, back-right, front. With fewer shots the front one always stays.
  var heroOrder = phones.length === 3 ? [0, 2, 1] : phones.map(function (_, i) { return i; });
  heroOrder.forEach(function (idx, n) {
    var cls = phones.length === 3 ? ["hp-l", "hp-r", "hp-c"][n] : "hp-c";
    art.appendChild(el("div", { class: "hp " + cls }, [el("img", { src: asset(phones[idx]), alt: "", width: "676", height: "1200", decoding: "async" })]));
  });

  // Optional atmosphere (soft clouds + floating orbs), chosen per project in content.js
  var CLOUD = '<svg viewBox="0 0 200 90" aria-hidden="true"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c8ff"/></linearGradient></defs><g fill="url(#cg)"><circle cx="58" cy="50" r="26"/><circle cx="100" cy="38" r="33"/><circle cx="142" cy="50" r="26"/><rect x="34" y="48" width="132" height="28" rx="14"/></g></svg>';
  function buildFx(kind, compact) {
    var box = el("div", { class: "fx fx-" + kind + (compact ? " fx-compact" : ""), "aria-hidden": "true" });
    if (kind !== "sky") { return box; }
    [[7, 9, 11, 95], [20, 62, 7, 120], [12, 34, 9, 140], [30, 4, 6, 105], [4, 78, 8, 130]].forEach(function (c, i) {
      var cl = el("span", { class: "fx-cloud" });
      cl.appendChild(svg(CLOUD));
      cl.style.cssText = "top:" + c[0] + "%;left:" + c[1] + "%;width:" + c[2] + "rem;--dur:" + c[3] + "s;--delay:" + (-i * 23) + "s;--o:" + (0.2 + (i % 3) * 0.08).toFixed(2);
      box.appendChild(cl);
    });
    var cols = ["#ff5d7a", "#6bb7ff", "#8bdc5b", "#b58bff", "#35e0f2"];
    for (var i = 0; i < 14; i++) {
      var o = el("span", { class: "fx-orb" });
      var left = i % 2 ? 2 + Math.random() * 20 : 78 + Math.random() * 20;
      o.style.cssText = "left:" + left.toFixed(1) + "%;top:" + (8 + Math.random() * 84).toFixed(1) + "%;--s:" + (0.45 + Math.random() * 0.9).toFixed(2) + "rem;--c:" + cols[i % cols.length] + ";--dur:" + (6 + Math.random() * 6).toFixed(1) + "s;--delay:" + (-Math.random() * 8).toFixed(1) + "s";
      box.appendChild(o);
    }
    return box;
  }

  var hero = el("section", { class: "phero", "aria-labelledby": "p-title" }, [
    heroBg,
    p.fx ? buildFx(p.fx, false) : null,
    el("div", { class: "wrap phero-grid" }, [
      el("div", { class: "phero-copy" }, [
        back,
        el("h1", { id: "p-title", class: "phero-title" }, [el("img", { class: "phero-logo", src: asset(p.logo), alt: p.title })]),
        el("p", { class: "phero-short", text: p.short }),
        tags
      ]),
      art
    ])
  ]);
  hero.style.setProperty("--accent", accent);
  if (p.fx) { hero.setAttribute("data-fx", p.fx); }
  app.appendChild(hero);

  /* ---------- Overview ---------- */
  function heading(text) { return el("h2", { class: "slash", text: text }); }

  var ovSec = el("section", { class: "psec reveal", id: "overview", "aria-labelledby": "ov-h" }, [
    (function () { var h = heading(T.ui.overview); h.id = "ov-h"; return h; })(),
    highlighted("p", "ptext", p.overview || p.short, p.highlights)
  ]);

  var imgSlides = [];
  var shots = (p.gallery && p.gallery.length ? p.gallery : p.phones || []).slice();

  /* ---------- Gameplay video: portrait, left column ---------- */
  var SPEAKER_ON = S('<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500H4Z"/><path d="M15.500 9a4 4 0 0 1 0 6M18 6.500a7.500 7.500 0 0 1 0 11"/>');
  var SPEAKER_OFF = S('<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500H4Z"/><path d="m16 9.500 5 5M21 9.500l-5 5"/>');
  var posterSrc = p.videoPoster || (shots[1] || shots[0] || "");
  var media = el("div", { class: "pfeat-media" }, [el("div", { class: "pvid-glow", "aria-hidden": "true" })]);
  if (posterSrc) {
    media.appendChild(el("img", { class: "pvid-poster", src: asset(posterSrc), alt: p.title + " gameplay", width: "676", height: "1200", draggable: "false" }));
  }

  function buildVideo(src) {
    var video = el("video", { class: "pvid-el", muted: "", loop: "", playsinline: "", preload: "auto", "aria-label": p.title + " gameplay video" });
    video.muted = true; video.loop = true; video.playsInline = true; video.setAttribute("webkit-playsinline", "");
    video.src = asset(src);

    var mute = el("button", { type: "button", class: "pvid-mute", "aria-label": T.ui.unmute, "aria-pressed": "true" }, [svg(SPEAKER_OFF)]);
    var play = el("button", { type: "button", class: "pvid-play", "aria-label": T.ui.playVideo, hidden: "" }, [icon("play")]);
    var frame = el("div", { class: "pvid-frame" }, [video, mute, play]);
    media.appendChild(frame);

    var wanted = false;
    function tryPlay() {
      var r = video.play();
      if (r && r.catch) { r.catch(function () { play.hidden = false; }); }
    }
    play.addEventListener("click", function () { play.hidden = true; wanted = true; tryPlay(); });
    mute.addEventListener("click", function () {
      video.muted = !video.muted;
      mute.setAttribute("aria-pressed", video.muted ? "true" : "false");
      mute.setAttribute("aria-label", video.muted ? T.ui.unmute : T.ui.mute);
      mute.replaceChildren(svg(video.muted ? SPEAKER_OFF : SPEAKER_ON));
      if (video.paused && wanted) { tryPlay(); }
    });
    video.addEventListener("playing", function () { play.hidden = true; });
    video.addEventListener("loadedmetadata", function () {
      if (video.videoWidth && video.videoHeight) { media.style.aspectRatio = video.videoWidth + " / " + video.videoHeight; }
    });
    video.addEventListener("loadeddata", function () { media.classList.add("is-ready"); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) {
          if (reduceMotion && !wanted) { play.hidden = false; return; }
          wanted = true; tryPlay();
        } else if (!video.paused) { video.pause(); }
      }, { threshold: 0.35 }).observe(frame);
    } else { tryPlay(); }
  }

  // Use the video listed in content.js, or simply drop gameplay.mp4 / gameplay.webm into the project's asset folder
  (function () {
    if (p.video) { buildVideo(p.video); return; }
    var base = "assets/projects/" + p.id + "/";
    function probe(list) {
      if (!list.length || !window.fetch) { return; }
      fetch(asset(base + list[0]), { method: "HEAD" }).then(function (r) {
        var type = r.headers.get("content-type") || "";
        if (r.ok && !/text\/html/i.test(type)) { buildVideo(base + list[0]); } else { probe(list.slice(1)); }
      }).catch(function () { probe(list.slice(1)); });
    }
    probe(["gameplay.mp4", "gameplay.webm"]);
  })();

  /* ---------- Screenshots carousel ---------- */
  var gallerySec = null;
  (function () {
    if (!shots.length) { return; }
    shots.forEach(function (src) { imgSlides.push({ type: "img", src: src }); });
    var list = el("ul", { class: "pgal-list" });
    shots.forEach(function (src, i) {
      var label = p.title + " " + T.ui.screenshot.toLowerCase() + " " + (i + 1);
      var btn = el("button", { type: "button", class: "pgal-card", "aria-label": label + " - " + T.ui.enlarge }, [
        el("img", { src: asset(src), alt: label, loading: "lazy", width: "676", height: "1200", draggable: "false" })
      ]);
      btn.addEventListener("click", function () { openLightbox(i, btn); });
      list.appendChild(el("li", {}, [btn]));
    });
    var prev = el("button", { type: "button", class: "pgal-nav pgal-prev", "aria-label": T.ui.prev }, [icon("chevL")]);
    var next = el("button", { type: "button", class: "pgal-nav pgal-next", "aria-label": T.ui.next }, [icon("chevR")]);
    var dots = el("div", { class: "pgal-dots", "aria-hidden": "true" });
    shots.forEach(function () { dots.appendChild(el("i")); });
    var stage = el("div", { class: "pgal-stage" }, [prev, list, next]);
    var h = heading(T.ui.gameScreenshots || (T.ui.screenshot + "s")); h.id = "gal-h"; h.classList.add("reveal");
    gallerySec = el("section", { class: "wrap pgal reveal", "aria-labelledby": "gal-h" }, [h, stage, dots]);

    function step() { var li = list.firstChild; return li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || 0) : 200; }
    function update() {
      var max = list.scrollWidth - list.clientWidth;
      var scrollable = max > 4;
      gallerySec.classList.toggle("is-scrollable", scrollable);
      prev.disabled = list.scrollLeft <= 2;
      next.disabled = list.scrollLeft >= max - 2;
      var idx = Math.round(list.scrollLeft / (step() || 1));
      if (max > 4 && list.scrollLeft >= max - 2) { idx = shots.length - 1; }
      Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle("on", i === idx); });
    }
    prev.addEventListener("click", function () { list.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { list.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    setTimeout(update, 60); setTimeout(update, 700);
  })();

  /* ---------- What I did ---------- */
  var didSec = null;
  if (p.contributions && p.contributions.length) {
    var grid = el("ul", { class: "did" });
    p.contributions.forEach(function (c, i) {
      var li = el("li", { class: "did-card reveal" }, [
        el("span", { class: "did-ico" }, [icon(c.icon)]),
        el("h3", { text: c.title }),
        highlighted("p", "", c.text, c.highlights)
      ]);
      li.style.setProperty("--d", i * 90 + "ms");
      grid.appendChild(li);
    });
    didSec = el("section", { class: "wrap pdid", "aria-labelledby": "did-h" }, [
      (function () { var h = heading(T.ui.whatIDid); h.id = "did-h"; h.classList.add("reveal"); return h; })(),
      grid
    ]);
    grid.setAttribute("data-count", String(p.contributions.length));
  }

  /* ---------- Info cards (right column, under the overview) ---------- */
  var side = el("div", { class: "pside" });
  function panel(titleIcon, title, body) {
    return el("section", { class: "panel reveal" }, [
      el("h2", { class: "panel-h" }, [icon(titleIcon), document.createTextNode(title)]),
      body
    ]);
  }

  var inf = p.info || {};
  var rows = [["platform", T.ui.platform, inf.platform], ["genre", T.ui.genre, inf.genre], ["model", T.ui.model, inf.model], ["role", T.ui.role, inf.role]]
    .filter(function (r) { return r[2]; });
  if (rows.length) {
    var dl = el("dl", { class: "info" });
    rows.forEach(function (r) {
      dl.appendChild(el("div", {}, [el("dt", {}, [icon(r[0]), document.createTextNode(r[1])]), el("dd", { text: r[2] })]));
    });
    side.appendChild(panel("info", T.ui.info, dl));
  }

  if (p.tools && p.tools.length) {
    var tl = el("ul", { class: "tools" });
    p.tools.forEach(function (t) { tl.appendChild(el("li", { text: t })); });
    side.appendChild(panel("tools", T.ui.tools, tl));
  }

  var withUrl = (p.links || []).filter(function (l) { return l && l.url; });
  var linksPanel = null;
  if (withUrl.length) {
    var ul = el("ul", { class: "plinks" });
    withUrl.forEach(function (l) {
      var a = el("a", { href: l.url, target: "_blank", rel: "noopener" }, [
        el("span", { class: "plink-ico" }, [icon(linkIcon(labelFor(l)))]),
        el("span", { class: "plink-label", text: l.label }),
        el("span", { class: "plink-out" }, [icon("external")])
      ]);
      ul.appendChild(el("li", {}, [a]));
    });
    linksPanel = panel("link", T.ui.linksTitle, ul);
    linksPanel.classList.add("panel-links");
    side.appendChild(linksPanel);
  }
  side.setAttribute("data-count", String(side.children.length));

  var feat = el("section", { class: "wrap pfeat", "aria-label": p.title }, [media, el("div", { class: "pfeat-copy" }, [ovSec, side])]);

  // Everything below the hero sits on one connected, softly lit background
  var pbody = el("div", { class: "pbody" }, [el("div", { class: "pbody-bg", "aria-hidden": "true" }, [el("i", { class: "g1" }), el("i", { class: "g2" }), el("i", { class: "g3" }), el("i", { class: "g4" })]), feat]);
  if (gallerySec) { pbody.appendChild(gallerySec); }
  if (didSec) { pbody.appendChild(didSec); }
  pbody.style.setProperty("--accent", accent);
  if (p.fx) { pbody.firstChild.appendChild(buildFx(p.fx, true)); pbody.firstChild.lastChild.classList.add("fx-body"); }
  app.appendChild(pbody);

  /* ---------- Lightbox ---------- */
  var lb = $("lightbox");
  var lbImg = $("lb-img");
  var lbIdx = 0, lbReturn = null;
  $("lb-close").textContent = T.ui.close;
  $("lb-prev").appendChild(icon("chevL"));
  $("lb-next").appendChild(icon("chevR"));
  $("lb-prev").setAttribute("aria-label", T.ui.prev);
  $("lb-next").setAttribute("aria-label", T.ui.next);

  function lbShow(i) {
    var k = imgSlides.length;
    lbIdx = ((i % k) + k) % k;
    lbImg.src = asset(imgSlides[lbIdx].src);
    lbImg.alt = p.title + " " + T.ui.screenshot.toLowerCase() + " " + (lbIdx + 1);
    lbImg.classList.remove("swap");
    void lbImg.offsetWidth;
    lbImg.classList.add("swap");
  }
  function openLightbox(i, from) {
    if (i < 0) { return; }
    lbReturn = from;
    lbShow(i);
    var many = imgSlides.length > 1;
    $("lb-prev").hidden = !many;
    $("lb-next").hidden = !many;
    lb.showModal();
    document.body.classList.add("lock");
  }
  $("lb-prev").addEventListener("click", function (e) { e.stopPropagation(); lbShow(lbIdx - 1); });
  $("lb-next").addEventListener("click", function (e) { e.stopPropagation(); lbShow(lbIdx + 1); });
  $("lb-close").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) {
    if (e.target !== lbImg && !e.target.closest("button")) { lb.close(); }
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); lbShow(lbIdx - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); lbShow(lbIdx + 1); }
  });
  lb.addEventListener("close", function () {
    document.body.classList.remove("lock");
    if (lbReturn && lbReturn.focus) { lbReturn.focus({ preventScroll: true }); }
  });

  /* ---------- Scroll reveal (each element animates once) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  Array.prototype.forEach.call(side.children, function (c, i) { c.style.setProperty("--d", i * 110 + "ms"); });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    revealEls.forEach(function (n) { io.observe(n); });
  } else {
    revealEls.forEach(function (n) { n.classList.add("in"); });
  }
})();
