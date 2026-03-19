document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('rose-content');

  try {
    const response = await fetch('../docs/info-rose.md');
    if (!response.ok) throw new Error('fetch failed');

    const text = await response.text();
    container.innerHTML = marked.parse(text);
  } catch {
    container.textContent = 'El contenido no está disponible en este momento.';
  }
});
