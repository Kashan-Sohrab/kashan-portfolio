(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('.hero');

  /* Night / white mode */
  var btn = document.getElementById('theme');
  function paint() { btn.textContent = root.dataset.theme === 'dark' ? '☀️' : '🌙'; }
  paint();
  btn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
    window.dispatchEvent(new Event('themechange'));
  });

  /* Scroll progress */
  var bar = document.getElementById('progress');
  function onScroll() {
    var max = root.scrollHeight - root.clientHeight;
    bar.style.width = (max > 0 ? (root.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var track = document.getElementById('track');
  if (track) track.innerHTML += track.innerHTML;

  /* Typed Flutter code */
  var code = document.getElementById('code');
  var src = "Scaffold(\n  body: Center(\n    child: Text('Hello, I am Kashan'),\n  ),\n)";
  if (code) {
    if (reduce) { code.textContent = src; }
    else {
      var i = 0;
      setTimeout(function tick() {
        i += 1; code.textContent = src.slice(0, i);
        if (i < src.length) setTimeout(tick, 45);
      }, 1300);
    }
  }

  /* 3D tilt of the phone */
  var tilt = document.querySelector('.tilt');
  var mx = 0, my = 0;
  hero.addEventListener('pointermove', function (e) {
    var b = hero.getBoundingClientRect();
    mx = (e.clientX - b.left) / b.width - 0.5;
    my = (e.clientY - b.top) / b.height - 0.5;
    if (tilt && !reduce && window.matchMedia('(hover: hover)').matches) {
      tilt.style.transform = 'rotateY(' + (mx * 24) + 'deg) rotateX(' + (-my * 18) + 'deg)';
    }
  });
  hero.addEventListener('pointerleave', function () { mx = 0; my = 0; if (tilt) tilt.style.transform = ''; });

  /* Three.js background: wireframe shapes + particles */
  try {
    if (!window.THREE) throw new Error('three.js not loaded');
    var canvas = document.getElementById('bg');
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    cam.position.z = 9;
    var wire = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.4 });
    var knot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.1, 0.55, 140, 14), wire);
    knot.position.set(-4.2, -1, -2);
    var ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), wire);
    ico.position.set(5.2, 2.4, -1);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 8, 60), wire);
    ring.position.set(4.2, -2.8, 0);
    var n = 450, pos = new Float32Array(n * 3);
    for (var k = 0; k < n * 3; k++) pos[k] = (Math.random() - 0.5) * 30;
    var pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var pm = new THREE.PointsMaterial({ size: 0.06, transparent: true, opacity: 0.85 });
    var pts = new THREE.Points(pg, pm);
    scene.add(knot, ico, ring, pts);

    var colors = function () {
      var dark = root.dataset.theme === 'dark';
      wire.color.setHex(dark ? 0x19b5fe : 0x0553b1);
      pm.color.setHex(dark ? 0x9fd8ff : 0x0553b1);
    };
    colors();
    window.addEventListener('themechange', colors);

    var resize = function () {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    var t = 0;
    (function frame() {
      t += 0.005;
      knot.rotation.x = t; knot.rotation.y = t * 1.3;
      ico.rotation.x = -t * 1.2; ico.rotation.y = t;
      ring.rotation.x = t * 1.5; ring.rotation.y = t * 0.6;
      pts.rotation.y = t * 0.15;
      cam.position.x += (mx * 2 - cam.position.x) * 0.04;
      cam.position.y += (-my * 1.5 - cam.position.y) * 0.04;
      cam.lookAt(0, 0, 0);
      renderer.render(scene, cam);
      if (!reduce && hero.getBoundingClientRect().bottom > 0) requestAnimationFrame(frame);
      else if (!reduce) setTimeout(function () { requestAnimationFrame(frame); }, 300);
    })();
  } catch (e) { /* page works without the 3D background */ }

  /* Rotating roles */
  var role = document.getElementById('role');
  var roles = ['Flutter mobile apps', 'full-stack web apps', 'AI and ML solutions', 'REST APIs and backends'];
  if (role) {
    if (reduce) { role.textContent = roles[0]; }
    else {
      var ri = 0, ci = 0, del = false;
      (function type() {
        var w = roles[ri], d = del ? 35 : 75;
        ci += del ? -1 : 1;
        role.textContent = w.slice(0, ci);
        if (!del && ci === w.length) { del = true; d = 1500; }
        else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 300; }
        setTimeout(type, d);
      })();
    }
  }

  /* 3D tilt on service cards */
  document.querySelectorAll('.svc').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      if (reduce || !window.matchMedia('(hover: hover)').matches) return;
      var b = card.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateZ(6px)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });

  /* Projects: reveal on scroll + cursor glow */
  var rows = document.querySelectorAll('.proj');
  rows.forEach(function (r, i) {
    r.style.setProperty('--d', (i * 0.15) + 's');
    r.addEventListener('pointermove', function (e) {
      var b = r.getBoundingClientRect();
      r.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      r.style.setProperty('--my', (e.clientY - b.top) + 'px');
    });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    rows.forEach(function (r) { io.observe(r); });
  } else { rows.forEach(function (r) { r.classList.add('in'); }); }

  /* CV button: in the online preview, save through the viewer */
  var cv = document.getElementById('cv');
  if (cv && window.CV_B64) {
    cv.addEventListener('click', function (e) {
      e.preventDefault();
      if (!window.claude) return;
      window.claude.use('downloads').then(function (d) {
        if (!d) return;
        var bin = atob(window.CV_B64), a = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
        d.save({ filename: 'Kashan_Sohrab_CV.pdf', data: a }).catch(function () {});
      });
    });
  }

  /* Service cards: staggered reveal on scroll */
  var cards = document.querySelectorAll('.svc');
  cards.forEach(function (c, i) { c.style.setProperty('--d', (i * 0.18) + 's'); });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); sio.unobserve(e.target); } });
    }, { threshold: 0.15 });
    cards.forEach(function (c) { sio.observe(c); });
  } else { cards.forEach(function (c) { c.classList.add('in'); }); }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
