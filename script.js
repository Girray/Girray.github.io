// ========== ① 根据数据生成节点 ==========
const timeline = document.querySelector('.timeline');

timelineData.forEach(item => {
  const node = document.createElement('article');
  node.className = 'node';
  node.innerHTML = `
    <div class="card">
      <time>${item.year}</time>
      <h3>${item.title}</h3>
      <p class="summary">${item.summary}</p>
    </div>
  `;
  node.querySelector('.card').addEventListener('click', () => openModal(item));
  timeline.appendChild(node);
});

// ========== ② 滚动动画 ==========
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.node').forEach(n => observer.observe(n));

// ========== ③ 弹窗 ==========
const modal = document.getElementById('modal');

function openModal(item) {
  document.getElementById('modal-img').src = item.image;
  document.getElementById('modal-year').textContent = item.year;
  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-detail').textContent = item.detail;
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });