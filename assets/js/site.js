(() => {
  if (customElements.get("wedding-audio-player")) return;

  class WeddingAudioPlayer extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;

      const source = this.getAttribute("src") || "";
      const label = this.getAttribute("label") || "Wedding music";
      const root = this.attachShadow({ mode: "open" });

      root.innerHTML = `
        <style>
          :host {
            position: fixed;
            top: clamp(82px, 7vw, 118px);
            right: clamp(14px, 3vw, 34px);
            z-index: 2147483000;
            display: inline-flex;
            --audio-red-a: #ff6b70;
            --audio-red-b: #d92532;
            --audio-red-c: #a80d1f;
            --audio-glow: rgba(222, 28, 45, 0.42);
          }

          button {
            position: relative;
            width: 40px;
            height: 44px;
            display: grid;
            place-items: center;
            align-items: center;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.42);
            border-radius: 999px;
            color: #fff7ef;
            cursor: pointer;
            background:
              radial-gradient(circle at 35% 22%, rgba(255, 255, 255, 0.42), transparent 32%),
              linear-gradient(145deg, var(--audio-red-a), var(--audio-red-b) 56%, var(--audio-red-c));
            box-shadow:
              0 18px 34px var(--audio-glow),
              0 6px 14px rgba(104, 0, 12, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.42),
              inset 0 -10px 18px rgba(76, 0, 12, 0.18);
            -webkit-tap-highlight-color: transparent;
            transition:
              transform 220ms ease,
              box-shadow 220ms ease,
              filter 220ms ease;
          }

          button::after {
            content: "";
            position: absolute;
            inset: 9px;
            border-radius: inherit;
            background: linear-gradient(140deg, rgba(255, 255, 255, 0.22), transparent 48%);
            pointer-events: none;
          }

          button:hover {
            transform: translateY(-2px) scale(1.045);
            filter: saturate(1.08);
            box-shadow:
              0 22px 42px rgba(222, 28, 45, 0.52),
              0 0 0 7px rgba(217, 37, 50, 0.11),
              0 8px 18px rgba(104, 0, 12, 0.24),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -10px 18px rgba(76, 0, 12, 0.2);
          }

          button:active {
            transform: translateY(0) scale(0.94);
          }

          button:focus-visible {
            outline: 3px solid rgba(255, 216, 219, 0.95);
            outline-offset: 5px;
          }

          .icon {
            position: absolute;
            width: 27px;
            height: 27px;
            display: grid;
            place-items: center;
            align-items: center;
            z-index: 1;
            transition:
              opacity 180ms ease,
              transform 220ms ease;
          }

          .icon svg {
            width: 100%;
            height: 100%;
            display: block;
            fill: currentColor;
            filter: drop-shadow(0 2px 3px rgba(90, 0, 10, 0.22));
          }

          .icon--play {
            opacity: 1;
            transform: translateX(2px) scale(1);
          }

          .icon--pause {
            opacity: 0;
            transform: scale(0.72);
          }

          button.is-playing .icon--play {
            opacity: 0;
            transform: translateX(2px) scale(0.72);
          }

          button.is-playing .icon--pause {
            opacity: 1;
            transform: scale(1);
          }

          audio {
            display: none;
          }

          @media (max-width: 720px) {
            :host {
              top: 78px;
              right: 14px;
            }

            button {
              width: 54px;
              height: 54px;
            }

            .icon {
              width: 23px;
              height: 23px;
            }
          }
        </style>

        <button type="button" aria-label="Play ${label}" aria-pressed="false">
          <span class="icon icon--play" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M11.2 7.4c0-1.35 1.49-2.17 2.63-1.44l14.05 8.98c1.05.67 1.05 2.21 0 2.88L13.83 26.04c-1.14.73-2.63-.09-2.63-1.44V7.4Z"/>
            </svg>
          </span>
          <span class="icon icon--pause" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M10.25 6.5h4.25c.83 0 1.5.67 1.5 1.5v16c0 .83-.67 1.5-1.5 1.5h-4.25c-.83 0-1.5-.67-1.5-1.5V8c0-.83.67-1.5 1.5-1.5Zm11.25 0h4.25c.83 0 1.5.67 1.5 1.5v16c0 .83-.67 1.5-1.5 1.5H21.5c-.83 0-1.5-.67-1.5-1.5V8c0-.83.67-1.5 1.5-1.5Z"/>
            </svg>
          </span>
        </button>
        <audio preload="metadata"></audio>
      `;

      const button = root.querySelector("button");
      const audio = root.querySelector("audio");

      if (source) audio.src = source;

      const setPlaying = (isPlaying) => {
        button.classList.toggle("is-playing", isPlaying);
        button.setAttribute("aria-pressed", String(isPlaying));
        button.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${label}`);
      };

      button.addEventListener("click", async () => {
        if (audio.paused) {
          try {
            await audio.play();
            setPlaying(true);
          } catch {
            setPlaying(false);
          }
          return;
        }

        audio.pause();
        setPlaying(false);
      });

      audio.addEventListener("play", () => setPlaying(true));
      audio.addEventListener("pause", () => setPlaying(false));
      audio.addEventListener("ended", () => {
        audio.currentTime = 0;
        setPlaying(false);
      });
    }
  }

  customElements.define("wedding-audio-player", WeddingAudioPlayer);
})();

document.addEventListener("DOMContentLoaded", () => {
  const customEvents = document.getElementById("custom-events-section");
  const countdownRoot = document.querySelector("[data-countdown-target]");
  const countdownValueNodes = countdownRoot
    ? {
        days: countdownRoot.querySelector('[data-unit="days"]'),
        hours: countdownRoot.querySelector('[data-unit="hours"]'),
        minutes: countdownRoot.querySelector('[data-unit="minutes"]'),
        seconds: countdownRoot.querySelector('[data-unit="seconds"]'),
      }
    : null;

  const injectMobileHeroFix = () => {
    if (document.getElementById("mobile-hero-desktop-match")) return;

    const style = document.createElement("style");
    style.id = "mobile-hero-desktop-match";
    style.textContent = `
      @media (max-width: 809.98px) {
        .framer-KP8HB .framer-smbn1s[data-framer-name="Section 1"] {
          background-color: #62b5ad !important;
          isolation: isolate;
        }

        .framer-KP8HB .framer-ecnzf2[data-framer-name="Trans"] {
          display: none !important;
        }

        .framer-KP8HB .framer-vj5zi[data-framer-name="Sky"] {
          display: none !important;
        }

        .framer-KP8HB .framer-1cfzdyr[data-framer-name="Tomb"] {
          inset: 0 !important;
          width: 100% !important;
          height: 100svh !important;
          min-height: 844px !important;
          transform: none !important;
          z-index: 0 !important;
          overflow: hidden !important;
        }

        .framer-KP8HB .framer-1cfzdyr[data-framer-name="Tomb"] [data-framer-background-image-wrapper="true"],
        .framer-KP8HB .framer-1cfzdyr[data-framer-name="Tomb"] img {
          width: 100% !important;
          height: 100% !important;
        }

        .framer-KP8HB .framer-1cfzdyr[data-framer-name="Tomb"] img {
          object-fit: cover !important;
          object-position: center top !important;
        }

        .framer-KP8HB .framer-suy8ia[data-framer-name="Names + Lanterns 2"],
        .framer-KP8HB .framer-q8p0o4-container {
          position: relative !important;
          z-index: 6 !important;
          mix-blend-mode: normal !important;
        }

        .framer-KP8HB .framer-t7d3wo,
        .framer-KP8HB .framer-1p5h4t7,
        .framer-KP8HB .framer-11b7scn {
          position: relative !important;
          z-index: 7 !important;
          transform: none !important;
          text-shadow: 0 2px 14px rgba(20, 42, 60, 0.35);
        }

        .custom-events {
          background-color: #62b5ad !important;
          background-position: center bottom !important;
          background-size: auto 4200px !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const optimizeDeferredMedia = () => {
    const criticalImageTokens = [
      "cyIPT3IPm257uiP1lpxhaxTt8E",
      "nc35y7b0Zuw1Gp5B9Uyd0lzjxKM",
    ];
    const deferredScopes = [
      "#custom-events-section",
      "#bride-and-groom",
      "#location",
      "#rsvp",
      "#instagram",
      "#things-to-know",
      ".invite-footer",
    ];

    document.querySelectorAll("img").forEach((image) => {
      const source = image.currentSrc || image.getAttribute("src") || "";
      const isCritical = criticalImageTokens.some((token) => source.includes(token));

      if (!image.hasAttribute("decoding")) {
        image.setAttribute("decoding", "async");
      }

      if (isCritical) {
        image.setAttribute("loading", "eager");
        image.setAttribute("fetchpriority", "high");
        return;
      }

      const shouldDefer = deferredScopes.some((selector) => image.closest(selector));
      if (shouldDefer && !image.hasAttribute("loading")) {
        image.setAttribute("loading", "lazy");
      }
      if (shouldDefer && !image.hasAttribute("fetchpriority")) {
        image.setAttribute("fetchpriority", "low");
      }
    });

    document.querySelectorAll("iframe").forEach((frame) => {
      if (!frame.hasAttribute("loading")) {
        frame.setAttribute("loading", "lazy");
      }
    });
  };

  const isInVisibleTree = (node) => {
    for (let current = node; current && current !== document; current = current.parentElement) {
      const style = window.getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden") return false;
    }

    return true;
  };

  const findVisibleEventsHeading = () =>
    Array.from(document.querySelectorAll("p, h1, h2, h3, div"))
      .find((node) => {
        if (node.textContent.trim() !== "On the following events") return false;
        if (!isInVisibleTree(node)) return false;

        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

  const placeCustomEvents = () => {
    if (!customEvents) return;

    const visibleAnchor = Array.from(document.querySelectorAll("#events-grid-anchor"))
      .find(isInVisibleTree);
    const visibleHeading = findVisibleEventsHeading();
    const fallbackTarget = visibleHeading
      ? visibleHeading.closest(".framer-11ljed9-container") || visibleHeading.parentElement
      : document.getElementById("rsvp");
    const target = visibleAnchor || fallbackTarget;

    if (target && target.nextElementSibling !== customEvents) {
      target.insertAdjacentElement("afterend", customEvents);
    }

    customEvents.style.display = "block";
  };

  injectMobileHeroFix();
  optimizeDeferredMedia();
  placeCustomEvents();
  window.setTimeout(optimizeDeferredMedia, 250);
  window.setTimeout(placeCustomEvents, 250);
  window.setTimeout(placeCustomEvents, 1000);

  if (!countdownRoot || !countdownValueNodes) return;

  const targetDate = new Date(countdownRoot.dataset.countdownTarget).getTime();

  const renderCountdown = () => {
    const now = Date.now();
    const diff = Math.max(targetDate - now, 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownValueNodes.days.textContent = String(days).padStart(2, "0");
    countdownValueNodes.hours.textContent = String(hours).padStart(2, "0");
    countdownValueNodes.minutes.textContent = String(minutes).padStart(2, "0");
    countdownValueNodes.seconds.textContent = String(seconds).padStart(2, "0");
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
});
