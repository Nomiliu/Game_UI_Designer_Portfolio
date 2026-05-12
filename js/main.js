/**
 * Designer Portfolio — Bold Morph interactions
 */

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

// --- Prevent image drag ---
document.querySelectorAll('.grid__img').forEach((img) => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
});

// --- Image tilt on hover ---
document.querySelectorAll('.grid__media').forEach((media) => {
  media.addEventListener('mousemove', (e) => {
    const rect = media.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const img = media.querySelector('.grid__img');
    if (img) {
      img.style.transform = `scale(1.06) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    }
  });

  media.addEventListener('mouseleave', () => {
    const img = media.querySelector('.grid__img');
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
    meta: 'Editorial Design / 2024',
    img: 'work-01',
    desc: 'A full redesign for an independent fashion and culture publication. The project spanned six issues across two years, establishing a bold new visual language that balances editorial gravitas with contemporary energy.',
    details: { Client: 'Aether Publishing', Role: 'Design Director', Year: '2024', Scope: 'Editorial, Art Direction, Print' }
  },
  {
    num: '02',
    title: 'Kōan Sound',
    meta: 'Brand Identity / 2024',
    img: 'work-02',
    desc: 'A complete brand system for an experimental music label — from logotype and typography to vinyl packaging and digital assets. The identity reflects the label\'s ethos of minimalist precision and sonic exploration.',
    details: { Client: 'Kōan Sound Records', Role: 'Brand Designer', Year: '2024', Scope: 'Brand Identity, Packaging, Digital' }
  },
  {
    num: '03',
    title: 'Mono Restaurant',
    meta: 'Branding & Space / 2023',
    img: 'work-03',
    desc: 'Identity and environmental graphics for a Michelin-starred restaurant in Copenhagen. The project encompassed everything from the menu system to wayfinding and interior graphic installations.',
    details: { Client: 'Mono Group', Role: 'Lead Designer', Year: '2023', Scope: 'Branding, Environmental, Print' }
  },
  {
    num: '04',
    title: 'Offset Grid',
    meta: 'Digital Experience / 2023',
    img: 'work-04',
    desc: 'An experimental web platform exploring generative typography and real-time layout computation. Users can manipulate typographic variables and see the results rendered instantly through WebGL.',
    details: { Client: 'Self-initiated', Role: 'Creative Technologist', Year: '2023', Scope: 'Web, Generative Design, Development' }
  },
  {
    num: '05',
    title: 'Nova Typeface',
    meta: 'Type Design / 2022',
    img: 'work-05',
    desc: 'A contemporary serif typeface designed for editorial use, featuring optical sizes from caption to display. The family includes six weights with matching italics.',
    details: { Client: 'Nova Foundry', Role: 'Type Designer', Year: '2022', Scope: 'Type Design, Specimen, Print' }
  },
  {
    num: '06',
    title: 'Terrain Maps',
    meta: 'Data Visualization / 2022',
    img: 'work-06',
    desc: 'An interactive cartography series exploring topographic data through generative algorithms. Each map is a unique print generated from real-world elevation data.',
    details: { Client: 'National Geographic', Role: 'Creative Technologist', Year: '2022', Scope: 'Data Viz, Generative, Print' }
  }
];

function openModal(idx) {
  const p = projects[idx];
  if (!p) return;

  // Hero image
  modalHeroImg.src = `images/${p.img}.jpg`;
  modalHeroImg.alt = p.title;

  // Info overlay
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

  // Gallery: 6 related images
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

document.querySelectorAll('.grid__item').forEach((item) => {
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
  // Collect all current gallery image srcs
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
