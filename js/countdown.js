/* ==========================================================================
   Hemingway Falls — Full-Screen Midnight Countdown Controller (/js/countdown.js)
   Automatically disables itself once the target timestamp is reached.
   ========================================================================== */
(function () {
  // 12:00 AM EST (UTC-5) = 10:00 PM MST (Thursday night)
  // NOTE: Change "2027" to "2026" below if targeting Friday, Nov 27, 2026!
  const TARGET_TIMESTAMP = new Date("2026-11-27T00:00:00-05:00").getTime();
  const STORAGE_KEY = "hf_midnight_countdown_dismissed";

  const overlay = document.getElementById("hf-countdown-overlay");
  if (!overlay) return;

  const hoursEl = document.getElementById("hf-cd-hours");
  const minutesEl = document.getElementById("hf-cd-minutes");
  const secondsEl = document.getElementById("hf-cd-seconds");
  const closeBtn = document.getElementById("hf-countdown-close");

  let timerInterval = null;

  function pad(num) {
    return num < 10 ? "0" + num : String(num);
  }

  function closeCountdown(rememberDismissal = true) {
    if (timerInterval) clearInterval(timerInterval);
    overlay.classList.add("is-hidden");
    document.body.classList.remove("hf-countdown-lock");

    if (rememberDismissal) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch (e) {
        // Ignore storage restrictions in private browsing
      }
    }

    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 450);
  }

  function updateClock() {
    const now = Date.now();
    const diff = TARGET_TIMESTAMP - now;

    // Auto-shutoff the instant midnight EST hits
    if (diff <= 0) {
      closeCountdown(false);
      return false;
    }

    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hoursEl) hoursEl.textContent = pad(totalHours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    return true;
  }

  // Immediate check on page load: if expired or already dismissed this session, stay hidden
  let alreadyDismissed = false;
  try {
    alreadyDismissed = sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch (e) {}

  if (Date.now() >= TARGET_TIMESTAMP || alreadyDismissed) {
    overlay.remove();
    return;
  }

  // Activate full-screen takeover
  if (updateClock()) {
    overlay.classList.add("is-active");
    document.body.classList.add("hf-countdown-lock");
    timerInterval = setInterval(updateClock, 1000);
  }

  // Close on X click
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeCountdown(true));
  }

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-active")) {
      closeCountdown(true);
    }
  });
})();