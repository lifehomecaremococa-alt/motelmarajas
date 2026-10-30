const toggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
const filters = Array.from(document.querySelectorAll('[data-filter]'));
function selectCategory(value, updateHash = true) {
  const active = filters.find(button => button.dataset.filter === value);
  if (!active) return;
  filters.forEach(button => {
    button.classList.toggle('active', button === active);
    button.setAttribute('aria-pressed', String(button === active));
  });
  document.querySelectorAll('.suite-card').forEach(card => {
    card.hidden = value !== 'all' && card.dataset.category !== value;
  });
  document.querySelectorAll('[data-category-section]').forEach(section => {
    section.hidden = value !== 'all' && section.dataset.categorySection !== value;
  });
  if (updateHash && document.body.dataset.catalogue) {
    history.replaceState(null, '', value === 'all' ? location.pathname : '#' + value);
  }
}
filters.forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.filter)));
if (document.body.dataset.catalogue) {
  selectCategory(location.hash.slice(1) || 'all', false);
  window.addEventListener('hashchange', () => selectCategory(location.hash.slice(1) || 'all', false));
}
const gallery = document.querySelector('#gallery');
let galleryTrigger;
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  galleryTrigger = button;
  const img = document.querySelector('#gallery-image');
  img.src = button.dataset.src || 'assets/suite-' + button.dataset.photo + '.webp';
  img.alt = button.querySelector('img').alt;
  document.querySelector('#gallery-title').textContent = button.dataset.title;
  gallery.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => galleryTrigger?.focus());
gallery.addEventListener('click', e => {
  if (e.target === gallery) {
    const r = gallery.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) gallery.close();
  }
});
