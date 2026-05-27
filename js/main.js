/**
 * Designer Portfolio — Bold Morph interactions
 */

// --- Hero Canvas Particle System ---
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles;
  const PARTICLE_COUNT = 120;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hue: Math.random() < 0.5 ? 14 : 174,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(${particles[i].hue}, 80%, 60%, ${0.12 * (1 - dist / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.alpha})`;
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.5) {
        p.vx = (p.vx / speed) * 0.5;
        p.vy = (p.vy / speed) * 0.5;
      }
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }
  animate();
})();

// --- Equal nav widths ---
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
let maxW = 0;
navLinks.forEach(l => { l.style.width = 'auto'; maxW = Math.max(maxW, l.offsetWidth); });
navLinks.forEach(l => { l.style.width = maxW + 'px'; });

// --- Nav click active ---
navLinks[0]?.classList.add('active');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// --- Nav overflow + swap dropdown ---
const navEl = document.querySelector('.nav');
const linksBox = document.getElementById('navLinks');
const moreBtn = document.getElementById('navMore');
const dropBox = document.getElementById('navDropdown');
const allLinks = [...linksBox.querySelectorAll('.nav__link')];

function overflow() {
  // Reset
  allLinks.forEach(l => linksBox.appendChild(l));
  moreBtn.style.display = 'none';
  dropBox.innerHTML = '';

  const navW = navEl.offsetWidth;
  const logoW = navEl.querySelector('.nav__logo').offsetWidth;
  const avail = navW - logoW - 120;

  if (linksBox.scrollWidth <= avail) return;

  moreBtn.style.display = 'block';
  // Find overflow items
  const hide = [];
  let w = 0;
  for (const l of allLinks) {
    w += l.offsetWidth + 10;
    if (w > avail) hide.push(l);
  }
  hide.forEach(l => l.remove());
  renderDrop();
}

function renderDrop() {
  dropBox.innerHTML = '';
  allLinks.forEach(orig => {
    if (linksBox.contains(orig)) return;
    const c = orig.cloneNode(true);
    c.classList.remove('active');
    c.addEventListener('click', (e) => {
      e.stopPropagation();
      const last = linksBox.lastElementChild;
      if (last) last.remove();
      linksBox.appendChild(orig);
      moreBtn.classList.remove('open');
      renderDrop();
      navLinks.forEach(l => l.classList.remove('active'));
      orig.classList.add('active');
      const href = orig.getAttribute('href');
      const t = document.querySelector(href);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
    dropBox.appendChild(c);
  });
}

window.addEventListener('resize', overflow);
overflow();

moreBtn.querySelector('.nav__more-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  moreBtn.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!moreBtn.contains(e.target)) moreBtn.classList.remove('open');
});

// --- Intersection Observer: scroll reveals ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

function forceRevealCheck() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
      revealObserver.unobserve(el);
    }
  });
}
window.addEventListener('load', forceRevealCheck);
setTimeout(forceRevealCheck, 500);
window.addEventListener('scroll', forceRevealCheck, { passive: true });

// --- Hero orb parallax ---
const orb = document.querySelector('.hero__orb');
let orbRaf = null;
window.addEventListener('scroll', () => {
  if (orbRaf) return;
  orbRaf = requestAnimationFrame(() => {
    orbRaf = null;
    if (!orb) return;
    const y = window.scrollY;
    if (y < window.innerHeight) {
      orb.style.transform = `translateY(${y * 0.04}px) scale(${1 + y * 0.0002})`;
    }
  });
}, { passive: true });

// --- Custom cursor ---
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  cursorX = mouseX;
  cursorY = mouseY;
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .work-row, .modal__gallery-img');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorRing.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorRing.classList.remove('hover');
  });
});

// --- Prevent image drag ---
document.querySelectorAll('.work-row__img').forEach((img) => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
});

// --- Image tilt on hover ---
document.querySelectorAll('.work-row__media').forEach((media) => {
  media.addEventListener('mousemove', (e) => {
    const rect = media.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const img = media.querySelector('.work-row__img');
    if (img) {
      img.style.transform = `scale(1.04) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    }
  });
  media.addEventListener('mouseleave', () => {
    const img = media.querySelector('.work-row__img');
    if (img) img.style.transform = '';
  });
});

// --- Project Detail Modal ---
const modal = document.getElementById('projectModal');
const modalHeroImg = document.getElementById('modalHeroImg');
const modalInfo = document.getElementById('modalInfo');
const modalGallery = document.getElementById('modalGallery');

const projects = [
  {
    num: '01',
    title: 'Aether Magazine',
    meta: '编辑设计 / 2024',
    img: 'work-01',
    desc: '为独立时尚文化刊物进行全面改版设计，跨越两年六期刊物，建立了一个平衡编辑分量与当代能量的大胆视觉语言。',
    details: { 客户: 'Aether Publishing', 角色: '设计总监', 年份: '2024', 范围: '编辑、艺术指导、印刷' }
  },
  {
    num: '02',
    title: 'Kōan Sound',
    meta: '品牌设计 / 2024',
    img: 'work-02',
    desc: '为实验音乐厂牌打造的完整品牌系统——从标志、字体到黑胶包装和数字资产，体现厂牌极简精准与声音探索的精神。',
    details: { 客户: 'Kōan Sound Records', 角色: '品牌设计师', 年份: '2024', 范围: '品牌识别、包装、数字' }
  },
  {
    num: '03',
    title: 'Mono Restaurant',
    meta: '品牌与空间 / 2023',
    img: 'work-03',
    desc: '为哥本哈根米其林星级餐厅打造的识别与环境图形设计，涵盖菜单系统、导视和室内图形装置。',
    details: { 客户: 'Mono Group', 角色: '主设计师', 年份: '2023', 范围: '品牌、环境、印刷' }
  },
  {
    num: '04',
    title: 'Offset Grid',
    meta: '数字体验 / 2023',
    img: 'work-04',
    desc: '一个探索生成式排版与实时布局计算的实验性网页平台，用户可调整排版变量并通过WebGL即时预览效果。',
    details: { 客户: '个人项目', 角色: '创意技术', 年份: '2023', 范围: '网页、生成式设计、开发' }
  },
  {
    num: '05',
    title: 'Nova Typeface',
    meta: '字体设计 / 2022',
    img: 'work-05',
    desc: '为编辑用途设计的当代衬线字体，支持从说明文字到标题的光学字号，包含六种字重及对应斜体。',
    details: { 客户: 'Nova Foundry', 角色: '字体设计师', 年份: '2022', 范围: '字体设计、样本、印刷' }
  },
  {
    num: '06',
    title: 'Terrain Maps',
    meta: '数据可视化 / 2022',
    img: 'work-06',
    desc: '通过生成算法探索地形数据的交互式制图系列，每张地图都是由真实高程数据生成的独特印刷品。',
    details: { 客户: '国家地理', 角色: '创意技术', 年份: '2022', 范围: '数据可视化、生成式、印刷' }
  }
];

function openModal(idx) {
  const p = projects[idx];
  if (!p) return;
  modalHeroImg.src = `images/${p.img}.jpg`;
  modalHeroImg.alt = p.title;
  const detailsHTML = Object.entries(p.details).map(([key, val]) =>
    `<li><dt>${key}</dt><dd>${val}</dd></li>`
  ).join('');
  modalInfo.innerHTML = `
    <span class="modal__num">${p.num}</span>
    <h2 class="modal__title">${p.title}</h2>
    <p class="modal__meta">${p.meta}</p>
    <p class="modal__desc">${p.desc}</p>
    <dl class="modal__details">${detailsHTML}</dl>
  `;
  let galleryHTML = '';
  for (let i = 1; i <= 6; i++) {
    const gi = String(i).padStart(2, '0');
    galleryHTML += `<img class="modal__gallery-img" src="images/${p.img}-${gi}.jpg" alt="${p.title} — ${i}" loading="eager">`;
  }
  modalGallery.innerHTML = galleryHTML;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__panel').scrollTop = 0;
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.work-row').forEach((item) => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.dataset.project);
    if (!isNaN(idx)) openModal(idx);
  });
});

document.querySelector('.modal__overlay')?.addEventListener('click', closeModal);
document.querySelector('.modal__close')?.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('open')) closeLightbox();
    else if (modal.classList.contains('open')) closeModal();
  }
});

// --- Gallery image lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(src) {
  const imgs = modalGallery.querySelectorAll('.modal__gallery-img');
  lightboxImages = Array.from(imgs).map((img) => img.src);
  lightboxIndex = lightboxImages.indexOf(src);
  if (lightboxIndex === -1) lightboxIndex = 0;
  lightboxImg.src = lightboxImages[lightboxIndex];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function navigateLightbox(dir) {
  if (!lightboxImages.length) return;
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  lightboxImg.src = lightboxImages[lightboxIndex];
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

modalGallery.addEventListener('click', (e) => {
  const img = e.target.closest('.modal__gallery-img');
  if (!img) return;
  openLightbox(img.src);
});

lightbox.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY > 0) navigateLightbox(1);
  else navigateLightbox(-1);
}, { passive: false });

document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
