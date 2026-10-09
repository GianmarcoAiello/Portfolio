// Portfolio interactions: dot-grid glow, section reveal, stat count-up.
// All effects degrade cleanly: reduced-motion and touch devices get a static page.
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = matchMedia('(hover: none), (pointer: coarse)').matches;

  // dot-grid glow — the background pattern lights up near the pointer
  if (!reduced && !coarse) {
    var g = document.getElementById('dotglow');
    if (g) {
      var mx = -200, my = -200, x = -200, y = -200;
      addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        document.body.classList.add('glow-on');
      });
      document.documentElement.addEventListener('mouseleave', function () {
        document.body.classList.remove('glow-on');
      });
      (function loop() {
        x += (mx - x) * 0.12; y += (my - y) * 0.12;
        g.style.setProperty('--mx', x + 'px');
        g.style.setProperty('--my', y + 'px');
        // lock the glow grid to the page grid while scrolling
        g.style.backgroundPosition = '0 ' + (-scrollY) + 'px';
        requestAnimationFrame(loop);
      })();
    }
  }

  // section reveal
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll('.section').forEach(function (s) { io.observe(s); });
  } else {
    document.querySelectorAll('.section').forEach(function (s) { s.classList.add('in'); });
  }

  // stat count-up
  if (!reduced && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, end = +el.dataset.n, t0 = performance.now(), dur = 900;
        (function tick(t) {
          var k = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.counted').forEach(function (el) { cio.observe(el); });
  } else {
    document.querySelectorAll('.counted').forEach(function (el) { el.textContent = el.dataset.n; });
  }
})();
