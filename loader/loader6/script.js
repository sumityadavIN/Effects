import gsap from "https://esm.sh/gsap";
import { CustomEase } from "https://esm.sh/gsap/CustomEase";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);
  CustomEase.create("hop", "0.9, 0, 0.1, 1");

  const splitText = (selector, type, className, useMask = true) => {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : [selector];

    const result = { chars: [], words: [] };

    elements.forEach((el) => {
      const text = el.textContent;
      el.innerHTML = "";

      if (type === "chars") {
        const chars = text.split("");
        chars.forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.className = className;
          span.style.display = "inline-block";

          // CSS styles.css handles the initial transform for .char

          if (useMask) {
            const mask = document.createElement("div");
            mask.style.overflow = "hidden";
            mask.style.display = "inline-block"; // Changed to inline-block
            mask.appendChild(span);
            el.appendChild(mask);
          } else {
            el.appendChild(span);
          }
          result.chars.push(span);
        });
      } else if (type === "words") {
        const words = text.split(" ");
        words.forEach((word, index) => {
          const span = document.createElement("span");
          span.textContent = word;
          span.className = className;
          span.style.display = "inline-block";

          // CSS styles.css handles the initial transform for .word

          if (useMask) {
            const mask = document.createElement("div");
            mask.style.overflow = "hidden";
            mask.style.display = "inline-block"; // Changed to inline-block
            mask.appendChild(span);
            el.appendChild(mask);
          } else {
            el.appendChild(span);
          }
          result.words.push(span);

          if (index < words.length - 1) {
            el.appendChild(document.createTextNode(" "));
          }
        });
      }
    });

    return result;
  };

  const headerSplit = splitText(".header h1", "chars", "char", true);
  const navSplit = splitText("nav a", "words", "word", true);
  const footerSplit = splitText(".hero-footer p", "words", "word", true);

  const counterProgress = document.querySelector(".preloader-counter h1");
  const counterContainer = document.querySelector(".preloader-counter");
  const counter = { value: 0 };

  const tl = gsap.timeline();

  tl.to(counter, {
    value: 100,
    duration: 3,
    ease: "power3.out",

    onUpdate: () => {
      counterProgress.textContent = Math.floor(counter.value);
    },

    onComplete: () => {
      // Use wrap: false for counter, then manual wrap
      const counterSplit = splitText(counterProgress, "chars", "digit", false);

      // Manual wrap logic from reference
      counterSplit.chars.forEach(digit => {
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        digit.parentNode.insertBefore(wrapper, digit);
        wrapper.appendChild(digit);
      });

      gsap.to(counterSplit.chars, {
        x: "-100%",
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
        delay: 1,
        onComplete: () => {
          counterContainer.remove();
        },
      });
    },
  });

  tl.to(
    counterContainer,
    {
      scale: 1,
      duration: 3,
      ease: "power3.out",
    },
    "<"
  );

  tl.to(
    ".progress-bar",
    {
      scaleX: 1,
      duration: 3,
      ease: "power3.out",
    },
    "<"
  );

  tl.to(
    ".hero-bg",
    {
      clipPath: "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)",
      duration: 1.5,
      ease: "hop",
    },
    4.5
  );

  tl.to(
    ".hero-bg img",
    {
      scale: 1.5,
      duration: 1.5,
      ease: "hop",
    },
    "<"
  );

  tl.to(
    ".hero-bg",
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "hop",
    },
    6
  );

  tl.to(
    ".hero-bg img",
    {
      scale: 1,
      duration: 2,
      ease: "hop",
    },
    6
  );

  tl.to(
    ".progress",
    {
      scaleX: 1,
      duration: 2,
      ease: "hop",
    },
    6
  );

  tl.to(
    ".header h1 .char",
    {
      x: "0%",
      duration: 1,
      ease: "power4.out",
      stagger: 0.075,
    },
    7
  );

  tl.to(
    "nav a .word",
    {
      y: "0%",
      duration: 1,
      ease: "power4.out",
      stagger: 0.075,
    },
    7.5
  );

  tl.to(
    ".hero-footer p .word",
    {
      y: "0%",
      duration: 1,
      ease: "power4.out",
      stagger: 0.075,
    },
    7.5
  );
});
