document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById('contact-form');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  const submitBtn  = document.getElementById('submit-btn');
  const feedback   = document.getElementById('form-feedback');
  const modal      = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');

  function showModal() {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('modal-visible');
  }

  function hideModal() {
    modal.classList.remove('modal-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  modalClose.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  // Validación de email en tiempo real
  emailInput.addEventListener('input', () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    emailError.style.display = isValid ? 'none' : 'block';
  });

  // Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = emailInput.value.trim();
    const message = document.getElementById('message').value.trim();

    // Estado: enviando
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Enviando...';
    feedback.textContent  = '';
    feedback.className    = 'form-feedback';

    try {
      const response = await fetch('../api/contact.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.ok) {
        form.reset();
        submitBtn.textContent = 'Enviado';
        document.getElementById('minigame-message').textContent = 'Gracias por conectar 😊';
        showModal();
        // El botón permanece deshabilitado para evitar envíos duplicados
      } else {
        feedback.textContent = data.error || 'Error al enviar el mensaje.';
        feedback.classList.add('form-feedback--error');
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Conectar';
      }

    } catch (err) {
      feedback.textContent = 'Error de conexión. Inténtalo más tarde.';
      feedback.classList.add('form-feedback--error');
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Conectar';
    }
  });
});
