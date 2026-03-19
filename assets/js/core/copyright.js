document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('copyright-year');
  if (!el) return;
  const start = 2017;
  const current = new Date().getFullYear();
  el.textContent = current > start ? `${start}–${current}` : `${start}`;
});
