/* ------------------ Background: Golden Shards Canvas ------------------ */
(() => {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  const shards = [];
  const SHARD_COUNT = Math.max(60, Math.floor((w*h)/90000));

  function rand(min, max){ return Math.random()*(max-min)+min; }

  for (let i=0;i<SHARD_COUNT;i++){
    shards.push({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: rand(-0.2,0.2),
      vy: rand(-0.05,0.1),
      w: rand(10,40),
      h: rand(2,8),
      rot: rand(0, Math.PI*2),
      rotSpeed: rand(-0.01,0.01),
      alpha: rand(0.12,0.65)
    });
  }

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  addEventListener('resize', resize);

  function draw(){
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, '#05040a');
    g.addColorStop(0.55, '#0b0b14');
    g.addColorStop(1, '#060407');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const ng = ctx.createRadialGradient(w*0.8,h*0.2,50,w*0.6,h*0.4,900);
    ng.addColorStop(0, 'rgba(255,200,120,0.06)');
    ng.addColorStop(1, 'rgba(10,10,10,0)');
    ctx.fillStyle = ng;
    ctx.fillRect(0,0,w,h);

    for (let s of shards){
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.rotSpeed;
      if (s.x > w + 60) s.x = -60;
      if (s.x < -60) s.x = w + 60;
      if (s.y > h + 40) s.y = -40;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = s.alpha;
      const sg = ctx.createLinearGradient(-s.w/2, -s.h/2, s.w/2, s.h/2);
      sg.addColorStop(0, 'rgba(255,220,140,0.12)');
      sg.addColorStop(0.5, 'rgba(255,200,100,0.45)');
      sg.addColorStop(1, 'rgba(200,140,50,0.12)');
      ctx.fillStyle = sg;
      ctx.fillRect(-s.w/2, -s.h/2, s.w, s.h);
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ------------------ Console fake warning (exact text) ------------------ */
(() => {
  console.warn("WARNING: TIMELINE CORRUPTION DETECTED");
})();

/* ------------------ Interactions ------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  const responseMessage = document.getElementById('responseMessage');
  const revealBtn = document.getElementById('revealBtn');

  submitBtn.addEventListener('click', async () => {
    const text = document.getElementById('feedbackInput').value || '';
    responseMessage.textContent = '...';
    try {
      const r = await fetch('/feedback', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text})
      });
      const data = await r.json();
      responseMessage.textContent = data.message || 'Thank you for your feedback!';
    } catch (e) {
      responseMessage.textContent = 'Network error. Try again.';
    }
  });

  revealBtn.addEventListener('click', (e) => {
    e.preventDefault();
    responseMessage.textContent = 'you really thought it will be this easy';
  });

  // favourite/movie check
  const favSubmit = document.getElementById('favSubmit');
  const favInput = document.getElementById('favInput');
  const favResponse = document.getElementById('favResponse');
  favSubmit.addEventListener('click', async () => {
    const name = (favInput.value || '').trim();
    favResponse.textContent = '...';
    try {
      const r = await fetch('/favourite', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name})
      });
      const data = await r.json();
      favResponse.textContent = data.message || 'No relevant match found.';
    } catch (e) {
      favResponse.textContent = 'Network error';
    }
  });

  // Timer (10 minutes)
  const timerEl = document.getElementById('timerDisplay');
  const overlay = document.getElementById('sessionOverlay');
  const overlayRefreshBtn = document.getElementById('overlayRefreshBtn');

  let totalSeconds = 10 * 60; // 10 minutes
  function formatTime(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s % 60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }
  timerEl.textContent = formatTime(totalSeconds);

  const tick = setInterval(() => {
    totalSeconds--;
    timerEl.textContent = formatTime(totalSeconds);
    if (totalSeconds <= 0) {
      clearInterval(tick);
      overlay.classList.remove('hidden');
      // disable inputs
      document.getElementById('submitBtn').disabled = true;
      document.getElementById('favSubmit').disabled = true;
      document.getElementById('revealBtn').disabled = true;
    }
  }, 1000);

  overlayRefreshBtn.addEventListener('click', () => location.reload());
  overlay.addEventListener('click', () => location.reload());
});
