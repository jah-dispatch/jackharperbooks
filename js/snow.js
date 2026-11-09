document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const flakes = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 1,
    d: Math.random() * 1 + 0.5
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    flakes.forEach(f => {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    });
    ctx.fill();
    update();
  }

  function update() {
    flakes.forEach(f => {
      f.y += Math.pow(f.d, 2) + 1;
      f.x += Math.sin(f.y / 30);
      if (f.y > height) {
        f.y = -10;
        f.x = Math.random() * width;
      }
    });
  }

  setInterval(draw, 33);
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
});