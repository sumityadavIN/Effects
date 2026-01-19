import gsap from "https://esm.sh/gsap";

document.addEventListener("DOMContentLoaded", () => {
  // Custom function to mimic SplitText "lines" functionality
  const splitTextIntoLines = (selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      const text = el.textContent;
      const words = text.split(" ");
      el.innerHTML = "";

      const tempSpans = [];
      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.display = "inline-block";
        el.appendChild(span);
        tempSpans.push(span);
      });

      // Group by offsetTop
      const lines = [];
      let currentLine = [];
      let lastTop = -1;

      tempSpans.forEach((span) => {
        if (lastTop === -1) lastTop = span.offsetTop;

        if (span.offsetTop > lastTop + 5) { // New line detected
          lines.push(currentLine);
          currentLine = [];
          lastTop = span.offsetTop;
        }
        currentLine.push(span);
      });
      if (currentLine.length > 0) lines.push(currentLine);

      // Rebuild DOM with line wrappers
      el.innerHTML = "";
      lines.forEach((lineSpans) => {
        const lineDiv = document.createElement("div");
        lineDiv.className = "line";
        // Important: Needs overflow hidden for the reveal animation to work
        lineDiv.style.overflow = "hidden";

        // Inner wrapper for animation if needed, or just apply text
        // Based on original code: tl.to("... .line", { y: "0%" })
        // This suggests .line starts with y translation?
        // Wait, original defaults were: mask: "lines", linesClass: "line".
        // Usually SplitText creates a wrapper div and puts the content inside.
        // If the animation is `y: "0%"`, the element needs to be initially hidden/translated.
        // Let's create `div.line-wrapper` > `div.line`?
        // Or `div.line-mask` > `div.line`? 
        // Original code: tl.to([".preloader-copy p .line", ".preloader-counter p .line"], { y: "0%" ... })
        // This implies `.line` is the element MOVING.
        // Its parent needs overflow hidden.

        const lineInner = document.createElement("div");
        lineInner.className = "line";
        lineInner.style.display = "block";
        lineInner.style.transform = "translateY(100%)"; // Initial state for animation

        lineSpans.forEach(span => lineInner.appendChild(span));

        const lineMask = document.createElement("div");
        lineMask.style.overflow = "hidden";
        lineMask.style.display = "block";
        lineMask.appendChild(lineInner);

        el.appendChild(lineMask);
      });
    });
  };

  splitTextIntoLines(".preloader-copy p");
  splitTextIntoLines(".preloader-counter p");

  gsap.set(["nav", ".hero-img", ".hero-content"], {
    y: "35svh",
  });

  const animateCounter = (selector, duration = 5, delay = 0) => {
    const counterElement = document.querySelector(selector);
    let currentValue = 0;
    const updateInterval = 200;
    const maxDuration = duration * 1000;
    const startTime = Date.now();

    setTimeout(() => {
      const updateCounter = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / maxDuration;

        if (currentValue < 100 && elapsedTime < maxDuration) {
          const target = Math.floor(progress * 100);
          const jump = Math.floor(Math.random() * 25) + 5;
          currentValue = Math.min(currentValue + jump, target, 100);

          counterElement.textContent = currentValue.toString().padStart(2, "0");
          setTimeout(updateCounter, updateInterval + Math.random() * 100);
        } else {
          counterElement.textContent = "100";
        }
      };

      updateCounter();
    }, delay * 1000);
  };

  animateCounter(".preloader-counter p", 4.5, 2);

  const tl = gsap.timeline();

  tl.to([".preloader-copy p .line", ".preloader-counter p .line"], {
    y: "0%",
    duration: 1,
    stagger: 0.075,
    ease: "power3.out",
    delay: 1,
  })
    .to(
      ".preloader-revealer",
      {
        scale: 0.1,
        duration: 0.75,
        ease: "power2.out",
      },
      "<"
    )
    .to(".preloader-revealer", {
      scale: 0.25,
      duration: 1,
      ease: "power3.out",
    })
    .to(".preloader-revealer", {
      scale: 0.5,
      duration: 0.75,
      ease: "power3.out",
    })
    .to(".preloader-revealer", {
      scale: 0.75,
      duration: 0.5,
      ease: "power2.out",
    })
    .to(".preloader-revealer", {
      scale: 1,
      duration: 1,
      ease: "power3.out",
    })
    .to(
      ".preloader",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "power3.out",
      },
      "-=1"
    )
    .to(
      ["nav", ".hero-img", ".hero-content"],
      {
        y: "0%",
        duration: 1.25,
        ease: "power3.out",
      },
      "<"
    );
});
