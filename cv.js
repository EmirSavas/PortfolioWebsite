/*
  Interactive CV viewer (PDF.js).
  - Reads the real PDF: page count, file size and file name come from the file itself.
  - Pages are drawn on a canvas with a real text layer on top, so text can be selected and copied.
  - Link annotations in the PDF become clickable links.
  - Pages are rendered only when they are close to the screen.
*/
import * as pdfjsLib from "./vendor/pdfjs/pdf.min.mjs";

(function () {
  "use strict";

  var T = window.SITE && window.SITE.en;
  var slot = document.getElementById("cv-viewer-slot");
  if (!T || !T.cv || !slot) { return; }

  var C = T.cv, V = C.viewer;
  var fileUrl = new URL(C.file, document.baseURI).href;
  var fileName = decodeURIComponent(C.file.split("/").pop());
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdfjs/pdf.worker.min.mjs", import.meta.url).href;

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") { n.textContent = attrs[k]; }
      else if (k === "class") { n.className = attrs[k]; }
      else { n.setAttribute(k, attrs[k]); }
    });
    (children || []).forEach(function (c) { if (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); } });
    return n;
  }
  function icon(paths, extra) {
    var s = document.createElement("span");
    s.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || "") + ">" + paths + "</svg>";
    return s.firstChild;
  }
  var I = {
    pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    prev: '<path d="m15 5-7 7 7 7"/>',
    next: '<path d="m9 5 7 7-7 7"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    fitPage: '<rect x="6" y="3" width="12" height="18" rx="1.500"/><path d="M3 9V6M21 9V6M3 15v3M21 15v3" opacity="0"/><path d="m9 9 3-3 3 3M9 15l3 3 3-3"/>',
    fitWidth: '<rect x="3" y="6" width="18" height="12" rx="1.500"/><path d="m9 9-3 3 3 3M15 9l3 3-3 3"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    exit: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    thumbs: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M5.500 8.500h.1M5.500 12h.1M5.500 15.500h.1" stroke-width="2.600"/>'
  };

  function btn(name, label, extraClass) {
    var b = el("button", { type: "button", class: "v-btn" + (extraClass ? " " + extraClass : ""), "aria-label": label, title: label });
    b.appendChild(icon(I[name]));
    return b;
  }
  function formatSize(bytes) {
    if (bytes < 1024 * 1024) { return Math.max(1, Math.round(bytes / 1024)) + " KB"; }
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  /* ---------- viewer markup ---------- */
  var nameEl = el("div", { class: "v-name", text: fileName, title: fileName });
  var metaEl = el("div", { class: "v-meta", text: V.pdf });
  var thumbsBtn = btn("thumbs", V.thumbs, "v-thumbs-toggle");
  thumbsBtn.setAttribute("aria-expanded", "true");
  thumbsBtn.setAttribute("aria-controls", "cv-thumbs");
  var prevBtn = btn("prev", V.prev), nextBtn = btn("next", V.next);
  var pageEl = el("div", { class: "v-page-count", "aria-live": "polite", text: "– / –" });
  var zoomOutBtn = btn("minus", V.zoomOut), zoomInBtn = btn("plus", V.zoomIn);
  var zoomEl = el("div", { class: "v-zoom", text: "100%" });
  var fitBtn = btn("fitPage", V.fitPage);
  var fullBtn = btn("full", V.fullscreen);
  var dlBtn = el("a", { class: "v-btn v-btn-dl", href: C.file, download: fileName, "aria-label": V.download, title: V.download });
  dlBtn.appendChild(icon(I.download));

  var exitText = el("button", { type: "button", class: "v-exit" }, [icon(I.exit), V.exitFullscreen]);

  var bar = el("div", { class: "v-bar", role: "toolbar", "aria-label": V.label }, [
    el("div", { class: "v-file" }, [
      el("span", { class: "v-file-ico", "aria-hidden": "true", text: "PDF" }),
      el("div", { class: "v-file-text" }, [nameEl, metaEl])
    ]),
    el("div", { class: "v-tools" }, [
      thumbsBtn,
      el("div", { class: "v-group v-nav" }, [prevBtn, pageEl, nextBtn]),
      el("div", { class: "v-group v-zoomgroup" }, [zoomOutBtn, zoomEl, zoomInBtn]),
      fitBtn,
      fullBtn,
      dlBtn,
      exitText
    ])
  ]);

  var thumbsEl = el("div", { class: "v-thumbs", id: "cv-thumbs", role: "navigation", "aria-label": V.thumbsLabel });
  var scrollEl = el("div", { class: "v-scroll", tabindex: "0", role: "document", "aria-label": V.label });
  var stateEl = el("div", { class: "v-state", role: "status" }, [el("span", { class: "v-spinner", "aria-hidden": "true" }), el("p", { text: V.loading })]);
  var body = el("div", { class: "v-body" }, [thumbsEl, scrollEl, stateEl]);

  var viewer = el("div", { class: "cv-viewer reveal", id: "cv-viewer", role: "region", "aria-label": V.label }, [bar, body]);
  viewer.setAttribute("data-thumbs", window.matchMedia("(min-width: 48rem)").matches ? "open" : "closed");
  slot.appendChild(viewer);
  // join the same entrance animation as the rest of the section
  viewer.style.setProperty("--d", "260ms");
  if (!("IntersectionObserver" in window) || reduceMotion) { viewer.classList.add("in"); }
  else {
    var enter = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { viewer.classList.add("in"); enter.disconnect(); }
    }, { threshold: 0.08 });
    enter.observe(viewer);
  }

  /* ---------- state ---------- */
  var pdf = null, pages = [], numPages = 0;
  var mode = "width"; // "width" | "page" | "custom"
  var zoom = 1;       // multiplier of the fit-to-width size, used by "custom"
  var scale = 1, baseW = 1, baseP = 1;
  var current = 1;
  var STEPS = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];
  var PAD = 20;
  var MAX_BASE_WIDTH = 980; // fit-to-width never makes a page wider than this, even in full screen
  var io = null, thumbIo = null, ro = null, relayoutTimer = 0, scrollTick = false;

  function fail(err) {
    if (window.console) { console.error("CV viewer:", err); }
    stateEl.className = "v-state is-error";
    stateEl.setAttribute("role", "alert");
    stateEl.replaceChildren(
      icon(I.pdf),
      el("p", { class: "v-error-title", text: V.error }),
      el("p", { class: "v-error-help", text: V.errorHelp }),
      (function () { var a = el("a", { class: "cv-download v-error-dl", href: C.file, download: fileName }, [icon(I.download), el("span", { class: "cv-dl-label", text: C.downloadLabel })]); return a; })()
    );
    [prevBtn, nextBtn, zoomOutBtn, zoomInBtn, fitBtn, thumbsBtn].forEach(function (b) { b.disabled = true; });
    metaEl.textContent = V.pdf;
  }

  /* ---------- load ---------- */
  function setSize(bytes) {
    var txt = formatSize(bytes);
    document.querySelectorAll(".cv-size").forEach(function (n) {
      n.textContent = txt;
      n.hidden = false;
    });
    return txt;
  }

  var loadingTask = null;
  fetch(fileUrl)
    .then(function (r) { if (!r.ok) { throw new Error("HTTP " + r.status); } return r.arrayBuffer(); })
    .then(function (buf) {
      var size = buf.byteLength;
      loadingTask = pdfjsLib.getDocument({ data: buf });
      return loadingTask.promise.then(function (doc) { return { doc: doc, size: size }; });
    })
    .then(function (r) {
      pdf = r.doc; numPages = pdf.numPages;
      var sizeTxt = setSize(r.size);
      metaEl.textContent = V.pdf + " • " + numPages + " " + (numPages === 1 ? V.page : V.pages) + " • " + sizeTxt;
      var jobs = [];
      for (var i = 1; i <= numPages; i++) { jobs.push(pdf.getPage(i)); }
      return Promise.all(jobs);
    })
    .then(setup)
    .catch(fail);

  /* ---------- build pages ---------- */
  function setup(proxies) {
    proxies.forEach(function (pg, idx) {
      var vp = pg.getViewport({ scale: 1 });
      var wrap = el("div", { class: "v-pg", "data-page": String(idx + 1) });
      var canvasBox = el("div", { class: "v-canvas" });
      var text = el("div", { class: "textLayer" });
      var links = el("div", { class: "v-links" });
      wrap.appendChild(canvasBox); wrap.appendChild(text); wrap.appendChild(links);
      scrollEl.appendChild(wrap);
      pages.push({ num: idx + 1, proxy: pg, vp: vp, el: wrap, canvasBox: canvasBox, text: text, links: links, visible: false, renderedScale: 0, token: 0, task: null });

      var tb = el("button", { type: "button", class: "v-thumb", "aria-label": V.goTo + " " + (idx + 1) });
      var tc = el("canvas", { class: "v-thumb-canvas" });
      tb.appendChild(tc);
      tb.appendChild(el("span", { class: "v-thumb-n", text: String(idx + 1) }));
      tb.addEventListener("click", function () { goTo(idx + 1); });
      thumbsEl.appendChild(tb);
      pages[idx].thumb = tb; pages[idx].thumbCanvas = tc; pages[idx].thumbDone = false;
    });

    stateEl.remove();
    viewer.classList.add("is-ready");

    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var p = pages[Number(en.target.getAttribute("data-page")) - 1];
        p.visible = en.isIntersecting;
        if (p.visible) { renderPage(p); } else { releasePage(p); }
      });
    }, { root: scrollEl, rootMargin: "120% 0px" });
    pages.forEach(function (p) { io.observe(p.el); });

    thumbIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        var p = pages[Array.prototype.indexOf.call(thumbsEl.children, en.target)];
        if (p && !p.thumbDone) { p.thumbDone = true; renderThumb(p); }
      });
    }, { root: thumbsEl, rootMargin: "100px 0px" });
    Array.prototype.forEach.call(thumbsEl.children, function (n) { thumbIo.observe(n); });

    ro = new ResizeObserver(function () {
      window.clearTimeout(relayoutTimer);
      relayoutTimer = window.setTimeout(layout, 80);
    });
    ro.observe(scrollEl);

    layout();
    updateCurrent();
    wire();
  }

  /* ---------- layout and zoom ---------- */
  function computeBases() {
    var first = pages[0].vp;
    var availW = Math.max(120, scrollEl.clientWidth - PAD * 2);
    var availH = Math.max(120, scrollEl.clientHeight - PAD * 2);
    baseW = Math.min(availW, MAX_BASE_WIDTH) / first.width;
    baseP = Math.min(availH / first.height, availW / first.width);
    baseP = Math.min(baseP, baseW);
  }
  function layout() {
    if (!pages.length) { return; }
    computeBases();
    scale = mode === "width" ? baseW : mode === "page" ? baseP : baseW * zoom;
    pages.forEach(function (p) {
      var w = Math.floor(p.vp.width * scale), h = Math.floor(p.vp.height * scale);
      p.el.style.width = w + "px";
      p.el.style.height = h + "px";
      p.el.style.setProperty("--scale-factor", String(scale));
      if (p.visible) { renderPage(p); }
    });
    zoomEl.textContent = Math.round((scale / baseW) * 100) + "%";
    fitBtn.replaceChildren(icon(mode === "width" ? I.fitPage : I.fitWidth));
    var fl = mode === "width" ? V.fitPage : V.fitWidth;
    fitBtn.setAttribute("aria-label", fl); fitBtn.title = fl;
    zoomOutBtn.disabled = scale / baseW <= STEPS[0] + 0.001;
    zoomInBtn.disabled = scale / baseW >= STEPS[STEPS.length - 1] - 0.001;
    // keep the current page in view after the size changed
    var cp = pages[current - 1];
    if (cp) { scrollEl.scrollTop = Math.max(0, cp.el.offsetTop - PAD); }
  }
  function stepZoom(dir) {
    var rel = scale / baseW, next = rel;
    if (dir > 0) { for (var i = 0; i < STEPS.length; i++) { if (STEPS[i] > rel + 0.01) { next = STEPS[i]; break; } } }
    else { for (var j = STEPS.length - 1; j >= 0; j--) { if (STEPS[j] < rel - 0.01) { next = STEPS[j]; break; } } }
    if (Math.abs(next - 1) < 0.001) { mode = "width"; zoom = 1; } else { mode = "custom"; zoom = next; }
    layout();
  }

  /* ---------- rendering (only near the screen) ---------- */
  function renderPage(p) {
    if (p.renderedScale === scale) { return; }
    var myScale = scale, token = ++p.token;
    if (p.task) { try { p.task.cancel(); } catch (e) { /* already finished */ } }
    var vp = p.proxy.getViewport({ scale: myScale });
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var canvas = document.createElement("canvas");
    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = "100%"; canvas.style.height = "100%";
    var task = p.proxy.render({ canvasContext: canvas.getContext("2d"), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
    p.task = task;
    task.promise.then(function () {
      if (token !== p.token) { return; }
      p.canvasBox.replaceChildren(canvas); // swap in the new canvas only when it is ready
      p.renderedScale = myScale;
      p.el.classList.add("is-drawn");
      return Promise.all([drawText(p, vp, token), drawLinks(p, vp, token)]);
    }).catch(function (err) {
      if (err && err.name === "RenderingCancelledException") { return; }
      if (window.console) { console.error("CV page render:", err); }
    });
  }
  function drawText(p, vp, token) {
    var container = document.createElement("div");
    container.className = "textLayer";
    var layer = new pdfjsLib.TextLayer({ textContentSource: p.proxy.streamTextContent(), container: container, viewport: vp });
    return layer.render().then(function () {
      if (token !== p.token) { return; }
      container.style.setProperty("--scale-factor", String(vp.scale));
      p.text.replaceWith(container);
      p.text = container;
    });
  }
  function drawLinks(p, vp, token) {
    return p.proxy.getAnnotations({ intent: "display" }).then(function (list) {
      if (token !== p.token) { return; }
      var frag = document.createDocumentFragment();
      list.forEach(function (a) {
        if (a.subtype !== "Link" || !a.rect) { return; }
        var url = a.url || a.unsafeUrl;
        if (!url || !/^(https?:|mailto:|tel:)/i.test(url)) { return; }
        var r = vp.convertToViewportRectangle(a.rect);
        var x = Math.min(r[0], r[2]), y = Math.min(r[1], r[3]), w = Math.abs(r[2] - r[0]), h = Math.abs(r[3] - r[1]);
        var link = el("a", { href: url, target: "_blank", rel: "noopener noreferrer", "aria-label": url.replace(/^mailto:/i, "") });
        link.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px";
        frag.appendChild(link);
      });
      p.links.replaceChildren(frag);
    });
  }
  function releasePage(p) {
    if (!p.renderedScale && !p.task) { return; }
    p.token++;
    if (p.task) { try { p.task.cancel(); } catch (e) { /* done */ } p.task = null; }
    p.canvasBox.replaceChildren();
    p.links.replaceChildren();
    var empty = document.createElement("div"); empty.className = "textLayer";
    p.text.replaceWith(empty); p.text = empty;
    p.renderedScale = 0;
    p.el.classList.remove("is-drawn");
  }
  function renderThumb(p) {
    var w = 96, s = w / p.vp.width, vp = p.proxy.getViewport({ scale: s });
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = p.thumbCanvas;
    c.width = Math.floor(vp.width * dpr); c.height = Math.floor(vp.height * dpr);
    c.style.aspectRatio = p.vp.width + " / " + p.vp.height;
    p.proxy.render({ canvasContext: c.getContext("2d"), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null }).promise.catch(function () { /* ignore */ });
  }

  /* ---------- navigation ---------- */
  function goTo(n) {
    n = Math.max(1, Math.min(numPages, n));
    var p = pages[n - 1];
    scrollEl.scrollTo({ top: Math.max(0, p.el.offsetTop - PAD), behavior: reduceMotion ? "auto" : "smooth" });
    setCurrent(n);
  }
  function setCurrent(n) {
    current = n;
    pageEl.textContent = n + " / " + numPages;
    prevBtn.disabled = n <= 1;
    nextBtn.disabled = n >= numPages;
    pages.forEach(function (p) {
      if (p.num === n) { p.thumb.setAttribute("aria-current", "true"); } else { p.thumb.removeAttribute("aria-current"); }
    });
    var t = pages[n - 1].thumb;
    if (viewer.getAttribute("data-thumbs") === "open" || thumbsEl.offsetParent) {
      var top = t.offsetTop - (thumbsEl.clientHeight - t.offsetHeight) / 2;
      thumbsEl.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
    }
  }
  function updateCurrent() {
    var line = scrollEl.scrollTop + scrollEl.clientHeight * 0.35, found = 1;
    for (var i = 0; i < pages.length; i++) { if (pages[i].el.offsetTop <= line) { found = pages[i].num; } }
    if (found !== current || !pageEl.dataset.ready) { pageEl.dataset.ready = "1"; setCurrent(found); }
  }

  /* ---------- full screen (real API when available, CSS fallback otherwise) ---------- */
  var fallbackFull = false;
  function isFull() { return document.fullscreenElement === viewer || fallbackFull; }
  function syncFull() {
    var on = isFull();
    viewer.classList.toggle("is-full", on);
    document.body.classList.toggle("lock", fallbackFull);
    fullBtn.replaceChildren(icon(on ? I.exit : I.full));
    var l = on ? V.exitFullscreen : V.fullscreen;
    fullBtn.setAttribute("aria-label", l); fullBtn.title = l;
    window.setTimeout(layout, 60);
  }
  function toggleFull() {
    if (isFull()) {
      if (document.fullscreenElement) { document.exitFullscreen(); } else { fallbackFull = false; syncFull(); }
      return;
    }
    if (viewer.requestFullscreen) {
      viewer.requestFullscreen().catch(function () { fallbackFull = true; syncFull(); });
    } else { fallbackFull = true; syncFull(); }
  }

  /* ---------- wiring ---------- */
  function wire() {
    prevBtn.addEventListener("click", function () { goTo(current - 1); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); });
    zoomInBtn.addEventListener("click", function () { stepZoom(1); });
    zoomOutBtn.addEventListener("click", function () { stepZoom(-1); });
    fitBtn.addEventListener("click", function () { mode = mode === "width" ? "page" : "width"; zoom = 1; layout(); });
    fullBtn.addEventListener("click", toggleFull);
    exitText.addEventListener("click", toggleFull);
    document.addEventListener("fullscreenchange", syncFull);
    thumbsBtn.addEventListener("click", function () {
      var open = viewer.getAttribute("data-thumbs") !== "open";
      viewer.setAttribute("data-thumbs", open ? "open" : "closed");
      thumbsBtn.setAttribute("aria-expanded", open ? "true" : "false");
      window.setTimeout(layout, 320);
    });
    // on small screens the thumbnail drawer closes after choosing a page
    thumbsEl.addEventListener("click", function (e) {
      if (e.target.closest(".v-thumb") && !window.matchMedia("(min-width: 48rem)").matches) {
        viewer.setAttribute("data-thumbs", "closed");
        thumbsBtn.setAttribute("aria-expanded", "false");
      }
    });
    scrollEl.addEventListener("scroll", function () {
      if (scrollTick) { return; }
      scrollTick = true;
      window.requestAnimationFrame(function () { scrollTick = false; updateCurrent(); });
    }, { passive: true });
    viewer.addEventListener("keydown", function (e) {
      if (e.target.closest("a, button") && e.target !== scrollEl) { return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); stepZoom(1); }
      else if (e.key === "-") { e.preventDefault(); stepZoom(-1); }
      else if (e.key === "0") { e.preventDefault(); mode = "width"; zoom = 1; layout(); }
      else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && scrollEl.scrollWidth <= scrollEl.clientWidth + 1) {
        e.preventDefault(); goTo(current + (e.key === "ArrowRight" ? 1 : -1));
      } else if (e.key === "Escape" && fallbackFull) { fallbackFull = false; syncFull(); }
    });
    window.addEventListener("pagehide", destroy);
  }

  function destroy() {
    [io, thumbIo, ro].forEach(function (o) { if (o) { o.disconnect(); } });
    pages.forEach(function (p) { if (p.task) { try { p.task.cancel(); } catch (e) { /* done */ } } try { p.proxy.cleanup(); } catch (e) { /* done */ } });
    if (loadingTask) { loadingTask.destroy(); }
    if (pdf) { pdf.destroy(); }
  }
})();
