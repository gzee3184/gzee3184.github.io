(function () {
  var root = document.documentElement;
  var base = root.getAttribute("data-base") || "";

  // ---- dark mode (the geass sigil) ----
  var toggle = document.querySelector(".geass");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ---- ghibli mode: banner under the header, fonts loaded on demand ----
  var bar = document.querySelector(".bar");
  if (bar) {
    bar.insertAdjacentHTML("afterend",
      '<div class="sky" role="img" aria-label="Scene from My Neighbor Totoro"></div>' +
      '<p class="sky-note">My Neighbor Totoro &middot; Studio Ghibli</p>');
  }
  function ghibliFonts() {
    if (document.getElementById("ghibli-fonts")) return;
    var l = document.createElement("link");
    l.id = "ghibli-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap";
    document.head.appendChild(l);
  }
  if (root.hasAttribute("data-ghibli")) ghibliFonts();

  // ---- warawara: a few float behind the page and bounce off the edges ----
  var wara = null, waraRaf = 0;
  function waraOn() {
    if (wara) return;
    wara = document.createElement("div");
    wara.className = "wara";
    wara.setAttribute("aria-hidden", "true");
    document.body.insertBefore(wara, document.body.firstChild);
    var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var count = innerWidth < 720 ? 6 : 9;
    var picks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].sort(function () { return Math.random() - .5; });
    var sprites = [];
    for (var i = 0; i < count; i++) {
      var img = new Image();
      var size = 40 + Math.random() * 26;
      img.src = base + "assets/ghibli/warawara/w" + picks[i] + ".png";
      img.alt = "";
      img.width = size;
      var a = Math.random() * Math.PI * 2, v = 14 + Math.random() * 16;   // px per second
      sprites.push({ el: img, s: size, x: Math.random() * (innerWidth - size), y: Math.random() * (innerHeight - size),
        vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: Math.random() * 6 });
      wara.appendChild(img);
    }
    function place(p) {
      p.el.style.transform = "translate(" + p.x + "px," + p.y + "px) rotate(" + Math.sin(p.t) * 8 + "deg)";
    }
    sprites.forEach(place);
    if (still) return;
    var last = performance.now();
    function step(now) {
      var dt = Math.min((now - last) / 1000, .05); last = now;
      var w = innerWidth, h = innerHeight;
      sprites.forEach(function (p) {
        p.x += p.vx * dt; p.y += p.vy * dt; p.t += dt * 1.5;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > w - p.s) { p.x = w - p.s; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > h - p.s) { p.y = h - p.s; p.vy = -Math.abs(p.vy); }
      });
      // bump into each other: treat each as a circle, mass by area
      for (var i = 0; i < sprites.length; i++) for (var j = i + 1; j < sprites.length; j++) {
        var a = sprites[i], b = sprites[j];
        var dx = (b.x + b.s / 2) - (a.x + a.s / 2), dy = (b.y + b.s / 2) - (a.y + a.s / 2);
        var d = Math.sqrt(dx * dx + dy * dy) || 1, min = (a.s + b.s) * .42;
        if (d >= min) continue;
        var nx = dx / d, ny = dy / d, ma = a.s * a.s, mb = b.s * b.s;
        var push = (min - d) / 2;   // separate so they don't stick
        a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
        var rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rel >= 0) continue;   // already moving apart
        var k = 2 * rel / (ma + mb);
        a.vx += k * mb * nx; a.vy += k * mb * ny;
        b.vx -= k * ma * nx; b.vy -= k * ma * ny;
      }
      sprites.forEach(place);
      waraRaf = requestAnimationFrame(step);
    }
    waraRaf = requestAnimationFrame(step);
  }
  function waraOff() {
    if (!wara) return;
    cancelAnimationFrame(waraRaf);
    wara.remove();
    wara = null;
  }
  if (root.hasAttribute("data-ghibli")) waraOn();

  // ---- footer ----
  var foot = document.querySelector("footer");
  if (foot) {
    foot.innerHTML =
      '<span>&copy; ' + new Date().getFullYear() + ' &middot; Minneapolis</span>' +
      '<span class="marks">' +
        '<button class="sootbtn" type="button" title="Ghibli mode" aria-label="Ghibli mode" aria-pressed="false">' +
          '<i style="-webkit-mask-image:url(' + base + 'assets/ghibli/totoro.png);mask-image:url(' + base + 'assets/ghibli/totoro.png)"></i>' +
        '</button>' +
        '<button class="hatbtn" type="button" title="Still looking for the One Piece" aria-label="Straw hat. Plays a sound.">' +
          '<svg class="hat" viewBox="0 0 26 16" aria-hidden="true">' +
            '<ellipse cx="13" cy="12.5" rx="12.5" ry="3.2" fill="#e3bd57"/>' +
            '<path d="M6.5 12 C6.5 4 19.5 4 19.5 12 Z" fill="#edcb6a"/>' +
            '<path d="M6.8 10.2 C9 11.2 17 11.2 19.2 10.2 L19.4 11.8 C17 12.8 9 12.8 6.6 11.8 Z" fill="#c8102e"/>' +
          '</svg>' +
          '<b class="don" aria-hidden="true">ドン!</b>' +
        '</button>' +
      '</span>';

    var soot = foot.querySelector(".sootbtn");
    soot.setAttribute("aria-pressed", root.hasAttribute("data-ghibli"));
    soot.addEventListener("click", function () {
      var on = !root.hasAttribute("data-ghibli");
      if (on) { ghibliFonts(); root.setAttribute("data-ghibli", ""); waraOn(); } else { root.removeAttribute("data-ghibli"); waraOff(); }
      soot.setAttribute("aria-pressed", on);
      try { localStorage.setItem("ghibli", on ? "on" : "off"); } catch (e) {}
      replay(soot, "hop");
    });
    var hat = foot.querySelector(".hatbtn");
    hat.addEventListener("click", function () { replay(hat, "toss"); drums(); });
  }

  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // ---- sounds, synthesized with Web Audio (no audio files) ----
  var ctx = null;
  function audio() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function noise(a, dur) {
    var buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var src = a.createBufferSource();
    src.buffer = buf;
    return src;
  }
  function env(a, t, peak, decay) {
    var g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    g.connect(a.destination);
    return g;
  }

  // drums of liberation: two low hits
  function drum(a, t) {
    var o = a.createOscillator();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    o.connect(env(a, t, 0.8, 0.35));
    o.start(t); o.stop(t + 0.4);
    var n = noise(a, 0.05), lp = a.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 900;
    n.connect(lp); lp.connect(env(a, t, 0.3, 0.05));
    n.start(t); n.stop(t + 0.05);
  }
  function drums() {
    var a = audio(); if (!a) return;
    var t = a.currentTime + 0.62;   // lands with the hat
    drum(a, t); drum(a, t + 0.2);
  }

  // ---- writing lists ----
  function fmt(d) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  document.querySelectorAll("[data-posts]").forEach(function (el) {
    var limit = parseInt(el.getAttribute("data-posts"), 10) || Infinity;
    var posts = (window.POSTS || []).filter(function (p) { return !p.draft; }).slice(0, limit);
    if (!posts.length) {
      el.outerHTML = '<p class="meta">first post soon</p>';
      return;
    }
    el.innerHTML = posts.map(function (p) {
      return '<li>' +
        '<div class="meta">' + fmt(p.date) + '</div>' +
        '<a class="title" href="' + base + 'writing/post.html?p=' + encodeURIComponent(p.slug) + '">' + p.title + '</a>' +
        (p.excerpt ? '<p class="excerpt">' + p.excerpt + '</p>' : '') +
      '</li>';
    }).join("");
    if (el.hasAttribute("data-more")) el.insertAdjacentHTML("afterend", '<p class="meta" style="margin-top:10px"><a href="writing/">all writing</a></p>');
  });

  // ---- single post ----
  var body = document.querySelector(".post-body");
  if (body) {
    var slug = new URLSearchParams(location.search).get("p");
    var post = (window.POSTS || []).find(function (p) { return p.slug === slug; });
    var titleEl = document.querySelector(".post h1");
    var metaEl = document.querySelector(".post > .meta");
    if (!post) {
      titleEl.textContent = "Post not found";
      body.innerHTML = '<p>No post called "' + (slug || "") + '". <a href="./">See all writing</a>.</p>';
      return;
    }
    document.title = post.title;
    titleEl.textContent = post.title;
    metaEl.textContent = fmt(post.date);
    fetch("posts/" + post.slug + ".md")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (md) { body.innerHTML = window.marked ? marked.parse(md) : "<pre>" + md + "</pre>"; })
      .catch(function () {
        body.innerHTML = "<p>Couldn't load posts/" + post.slug + ".md. If you opened this file directly, run a local server instead (see README).</p>";
      });
  }
})();
