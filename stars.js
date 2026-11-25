// ========== 配置：调效果只改这里 ==========
const STAR_CONFIG = {
  density: 0.00015,        // 每平方像素的星星数（窗口越大，星星越多）
  minRadius: 0.3,
  maxRadius: 1.8,
  speed: 8,                // 漂移速度（像素/秒，再乘以半径）
  direction: [-1, -0.3],   // 漂移方向：往左偏上
  colors: [                // [RGB, 权重]，权重越大，这种颜色出现得越多
    ['255,255,255', 6],    // 白
    ['255,244,214', 3],    // 淡黄
    ['255,205,145', 1.5],  // 橙
    ['200,220,255', 2],    // 蓝白
    ['215,180,255', 1.5],  // 紫
  ],
};

const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [], W, H;

// 按权重随机选一种颜色
function pickColor() {
  const total = STAR_CONFIG.colors.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [c, w] of STAR_CONFIG.colors) {
    if ((r -= w) < 0) return c;
  }
}

function createStar() {
  const { minRadius, maxRadius, speed, direction: [dx, dy] } = STAR_CONFIG;
  const r = minRadius + Math.random() ** 3 * (maxRadius - minRadius);
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r,
    vx: dx * speed * r,      // 速度和半径成正比：视差效果
    vy: dy * speed * r,
    color: pickColor(),
    phase: Math.random() * Math.PI * 2,   // 闪烁的初相位
    freq: 0.5 + Math.random() * 1.5,      // 闪烁的角频率
  };
}

// 适配窗口大小和高清屏
function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.round(W * H * STAR_CONFIG.density) }, createStar);
}

// 动画主循环
let last = 0;
function frame(now) {
  const t = now / 1000;
  const dt = Math.min(t - last, 0.1);   // 切走标签页再回来时，防止星星一下子跳很远
  last = t;

  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    s.x = (s.x + s.vx * dt + W) % W;    // 从一侧飞出去，从对侧回来
    s.y = (s.y + s.vy * dt + H) % H;

    const alpha = 0.55 + 0.45 * Math.sin(t * s.freq + s.phase);

    if (s.r > 1.2) {                    // 较大的恒星加一圈光晕
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      g.addColorStop(0, `rgba(${s.color},${alpha * 0.4})`);
      g.addColorStop(1, `rgba(${s.color},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = `rgba(${s.color},${alpha})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(frame);
}

resize();
window.addEventListener('resize', resize);
requestAnimationFrame(frame);