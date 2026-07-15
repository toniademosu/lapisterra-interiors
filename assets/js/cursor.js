// warm "lamp" cursor: gold dot + lagging light halo, desktop pointers only
const fine = matchMedia('(pointer:fine)').matches;
const motion = matchMedia('(prefers-reduced-motion: no-preference)').matches;
if (fine && motion) {
  document.documentElement.classList.add('has-cursor');
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.append(glow, dot);
  let x = innerWidth / 2, y = innerHeight / 2, gx = x, gy = y;
  const walls = document.querySelectorAll('.wall-text');
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px,${y}px)`;
  }, { passive: true });
  (function loop() {
    gx += (x - gx) * .09; gy += (y - gy) * .09;
    glow.style.transform = `translate(${gx}px,${gy}px)`;
    for (const w of walls) {
      const r = w.getBoundingClientRect();
      if (r.bottom > -200 && r.top < innerHeight + 200) {
        w.style.setProperty('--wx', (gx - r.left).toFixed(1) + 'px');
        w.style.setProperty('--wy', (gy - r.top).toFixed(1) + 'px');
      }
    }
    requestAnimationFrame(loop);
  })();
  addEventListener('pointerdown', () => {
    glow.classList.remove('pulse');
    void glow.offsetWidth;
    glow.classList.add('pulse');
  });
  addEventListener('pointerover', e => {
    dot.classList.toggle('is-link', !!e.target.closest('a,button'));
  });
}
