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

  /* ---------- Page text ---------- */
  document.documentElement.lang = LANG;
  document.title = T.meta.title;
  var desc = document.querySelector('meta[name="description"]');
  if (desc) { desc.setAttribute("content", T.meta.description); }

  $("skip-link").textContent = T.ui.skipToContent;
  $("brand").textContent = T.person.name;
  $("hero-name").textContent = T.person.name;
  $("hero-role").textContent = T.person.role;
  $("hero-intro").textContent = T.person.intro;

  function linkRow(container, includeCv) {
    var p = T.person;
    if (includeCv) {
      container.appendChild(el("a", { class: "btn btn-primary", href: "#projects", text: T.projects.heading }));
    }
    container.appendChild(el("a", { class: "btn", href: "mailto:" + p.email, text: T.ui.email }));
    container.appendChild(el("a", { class: "btn", href: p.linkedin, target: "_blank", rel: "noopener", text: T.ui.linkedin }));
    if (p.github) {
      container.appendChild(el("a", { class: "btn", href: p.github, target: "_blank", rel: "noopener", text: T.ui.github }));
    }
  }
  linkRow($("hero-links"), true);
  linkRow($("contact-links"), false);

  $("about-h").textContent = T.about.heading;
  T.about.paragraphs.forEach(function (t) { $("about-text").appendChild(el("p", { text: t })); });
  T.about.facts.forEach(function (f) {
    $("about-facts").appendChild(el("div", {}, [el("dt", { text: f.label }), el("dd", { text: f.value })]));
  });

  $("exp-h").textContent = T.experience.heading;
  T.experience.items.forEach(function (it) {
    var li = el("li", {}, [
      el("div", { class: "tl-head" }, [el("span", { class: "tl-role", text: it.role }), el("span", { class: "tl-dates", text: it.dates })]),
      el("p", { class: "tl-company", text: it.company }),
      el("p", { class: "tl-summary", text: it.summary })
    ]);
    $("timeline").appendChild(li);
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
  $("copyright").textContent = "© " + new Date().getFullYear() + " " + T.person.name;

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

  /* ---------- Lightbox ---------- */
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

  /* ---------- CV dialog ---------- */
  var cvd = $("cv-dialog");
  var cvReturn = null;
  $("cvd-close").textContent = T.ui.close;
  wireDialog(cvd, $("cvd-close"), function () { return cvReturn; });
  function openCv(trigger) { cvReturn = trigger; openDialog(cvd, trigger); }
  $("cv-open").addEventListener("click", function () { openCv($("cv-open")); });
  $("cv-preview").addEventListener("click", function () { openCv($("cv-preview")); });

  /* ---------- Project banners ---------- */
  var CHEVRON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

  function toggle(b, scroll) {
    var willOpen = !b.art.classList.contains("is-open");
    banners.forEach(function (o) { if (o !== b) { setOpen(o, false); } });
    setOpen(b, willOpen);
    history.replaceState(null, "", willOpen ? "#" + b.id : "#projects");
    if (willOpen && scroll !== false) {
      window.setTimeout(function () {
        b.art.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }, reduceMotion ? 0 : 560);
    }
  }

  T.projects.items.forEach(function (p) {
    var art = el("article", { class: "banner", id: p.id });
    art.style.setProperty("--accent", p.accent || "#7fd0e6");

    var bg = el("span", { class: "banner-bg", "aria-hidden": "true" });
    bg.style.backgroundImage = 'url("' + p.bg + '")';

    var tags = el("span", { class: "banner-tags" });
    p.tags.forEach(function (t) { tags.appendChild(el("span", { text: t })); });
    var cta = el("span", { class: "banner-cta" }, [document.createTextNode(T.ui.expand)]);
    cta.insertAdjacentHTML("beforeend", CHEVRON);

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
    btn.addEventListener("click", function () { toggle(b); });
  });

  // Open a project directly from a link such as emirsavas.dev/#blast-defence
  var wanted = location.hash.replace("#", "");
  var deep = banners.filter(function (b) { return b.id === wanted; })[0];
  if (deep) {
    window.addEventListener("load", function () {
      setOpen(deep, true);
      deep.art.scrollIntoView({ block: "start" });
    });
  }
})();
