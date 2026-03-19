document.addEventListener("DOMContentLoaded", () => {
  const baseDuration = 0.4;
  const baseDelayStep = 0.06;
  const maxDuration = 2.0;

  const leftPaths = Array.from(document.querySelectorAll('[id^="path_left_"]'));
  const rightPaths = Array.from(document.querySelectorAll('[id^="path_right_"]'));

  const animatePaths = (paths) => {
    paths.forEach((path, index) => {
      const length = path.getTotalLength();

      path.style.visibility = "visible";
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = "none";

      path.getBoundingClientRect();

      const duration = Math.min(length * 0.01, maxDuration);
      const delay = index * baseDelayStep;

      path.style.transition = `stroke-dashoffset ${duration}s ease-out ${delay}s`;
      path.style.strokeDashoffset = "0";
    });
  };

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });

  animatePaths(leftPaths);
  animatePaths(rightPaths);

  function animateTitleText(text, targetId, delayBetweenLetters = 100, onComplete = null) {
    const titleEl = document.getElementById(targetId);
    if (!titleEl) return;

    titleEl.textContent = "";

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "_";
    titleEl.appendChild(cursor);

    let i = 0;

    function typeLetter() {
      if (i < text.length) {
        const char = document.createTextNode(text[i]);
        titleEl.insertBefore(char, cursor);
        i++;
        setTimeout(typeLetter, delayBetweenLetters);
      } else if (onComplete) {
        onComplete();
      }
    }

    typeLetter();
  }

  const fillLeft = document.getElementById("fill_left");
  const fillRight = document.getElementById("fill_right");

  const leftDelay = (leftPaths.length - 1) * baseDelayStep;
  const rightDelay = (rightPaths.length - 1) * baseDelayStep;
  const finalDelay = Math.max(leftDelay, rightDelay);

  setTimeout(() => {
    fillLeft.style.opacity = 1;
    fillRight.style.opacity = 1;

    animateTitleText("Duality ROSE", "animated-title", 100, () => {
      const footer = document.getElementById("page-footer");
      if (footer) {
        footer.style.opacity = 1;
      }
    });

    document.querySelectorAll('.half').forEach(el => {
      el.classList.remove('inactive');
    });

  }, finalDelay * 1000);

  document.querySelectorAll('.half').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.getAttribute('data-link');
      if (!target) return;

      document.body.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = target;
      }, 500);
    });
  });
});
