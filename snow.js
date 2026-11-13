// Light snowfall for the winter theme. Turned off for people who prefer reduced motion.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let width, height, flakes;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Fewer flakes on small screens
    const count = Math.round(Math.min(90, (width * height) / 18000));
    flakes = Array.from({ length: count }, () => makeFlake(true));
  }

  function makeFlake(anywhere) {
    return {
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -10,
      r: 0.8 + Math.random() * 2.2,
      speed: 0.2 + Math.random() * 0.5,
      drift: Math.random() * Math.PI * 2,
      opacity: 0.35 + Math.random() * 0.55,
    };
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    for (const f of flakes) {
      f.drift += 0.01;
      f.y += f.speed * (0.6 + f.r / 3);
      f.x += Math.sin(f.drift) * 0.4;
      if (f.y > height + 10) Object.assign(f, makeFlake(false));
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 248, 252, ${f.opacity})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();
