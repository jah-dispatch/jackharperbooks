/* ==========================================================================
   AMBIENT TYPEWRITER OVERLAY (/js/typewriter-bg.js)
   Self-contained script + styles. Types random words across the viewport.
   ========================================================================== */
(function () {
  // 1. CUSTOMIZE YOUR RANDOM WORDS & PHRASES HERE:
  const PHRASES = [
    "don't feed the chickens",
    "Rick Dixon",
    "live draft",
    "chapter fourteen",
    "unspoken history",
    "honeycomb stationery",
    "across the decades",
    "page forty-two",
    "he suffered tirelessly",
    "Brian Bellvue",
    "Seattle",
    "connections that defy time",
    "margin notes",
    "Lake Hemingway"
  ];

  function initTypewriterOverlay() {
    // Prevent duplicate overlays if script is loaded twice
    if (document.getElementById("typewriter-overlay")) return;

    // Inject self-contained CSS so it works immediately without cache issues
    const style = document.createElement("style");
    style.textContent = `
      #typewriter-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        overflow: hidden;
        z-index: 9990; /* Sits visibly as a true screen overlay without blocking clicks */
        user-select: none;
        -webkit-user-select: none;
      }
      .ghost-typed-phrase {
        position: absolute;
        font-family: 'Courier Prime', Courier, monospace;
        font-size: clamp(0.95rem, 1.8vw, 1.35rem);
        font-weight: 700;
        color: rgba(230, 204, 178, 0.28); /* Clear, visible warm parchment tint */
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        letter-spacing: 0.08em;
        white-space: nowrap;
        max-width: 88vw;
        overflow: hidden;
        transition: opacity 1.5s ease;
      }
      .ghost-typed-phrase.typing::after {
        content: "_";
        opacity: 0.85;
        animation: tw-caret-blink 0.55s step-end infinite;
      }
      @keyframes tw-caret-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @media (max-width: 680px) {
        .ghost-typed-phrase {
          color: rgba(230, 204, 178, 0.22);
        }
      }
    `;
    document.head.appendChild(style);

    // Create the fixed click-through overlay container
    const overlay = document.createElement("div");
    overlay.id = "typewriter-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);

    const isMobile = () => window.innerWidth <= 768;
    let activeCount = 0;

    function spawnTypedPhrase() {
      const maxActive = isMobile() ? 3 : 5;
      if (document.hidden || activeCount >= maxActive) return;
      activeCount++;

      const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      const el = document.createElement("span");
      el.className = "ghost-typed-phrase typing";

      // Safe viewport positioning so mobile never overflows horizontally
      const topPos = Math.floor(Math.random() * 80) + 10; // 10vh to 90vh
      const leftPos = isMobile()
        ? Math.floor(Math.random() * 40) + 5              // 5vw to 45vw on mobile
        : Math.floor(Math.random() * 65) + 5;             // 5vw to 70vw on desktop

      el.style.top = topPos + "vh";
      el.style.left = leftPos + "vw";
      overlay.appendChild(el);

      let charIndex = 0;
      const typeSpeed = Math.floor(Math.random() * 50) + 70; // 70ms to 120ms per key

      const typeTimer = setInterval(() => {
        el.textContent += phrase.charAt(charIndex);
        charIndex++;

        if (charIndex >= phrase.length) {
          clearInterval(typeTimer);
          el.classList.remove("typing");

          // Hold finished phrase on screen, then fade out and clean up
          setTimeout(() => {
            el.style.opacity = "0";
            setTimeout(() => {
              el.remove();
              activeCount--;
            }, 1500);
          }, 2400);
        }
      }, typeSpeed); // <-- Fixed: uses typeSpeed (ms)
    }

    // Spawn 2 phrases immediately so you see it right on page load, then every 1.8s
    spawnTypedPhrase();
    setTimeout(spawnTypedPhrase, 700);
    setInterval(spawnTypedPhrase, 1800);
  }

  // Run whether DOMContentLoaded has already fired or not
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTypewriterOverlay);
  } else {
    initTypewriterOverlay();
  }
})();