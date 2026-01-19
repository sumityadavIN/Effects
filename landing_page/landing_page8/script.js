document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded and running");

  if (typeof gsap === 'undefined') {
    console.error("GSAP not loaded!");
    return;
  }

  function splitText(selector, type) {
    const elements = document.querySelectorAll(selector);
    console.log(`splitText: Found ${elements.length} elements for "${selector}"`);

    elements.forEach(element => {
      const originalText = element.innerText;
      element.innerHTML = '';
      element.style.whiteSpace = 'nowrap';

      if (type === 'chars') {
        const chars = originalText.split('');
        chars.forEach(char => {
          const span = document.createElement('span');
          span.classList.add('char-mask');
          span.style.display = 'inline-block';
          span.style.overflow = 'hidden';
          span.style.verticalAlign = 'top';
          span.style.lineHeight = '1';
          span.style.marginRight = '-0.02em';

          const innerSpan = document.createElement('span');
          innerSpan.classList.add('char');
          innerSpan.innerText = char === ' ' ? '\u00A0' : char;
          innerSpan.style.display = 'inline-block';
          innerSpan.style.lineHeight = '1';

          span.appendChild(innerSpan);
          element.appendChild(span);
        });
      } else if (type === 'lines') {
        const wrapper = document.createElement('div');
        wrapper.classList.add('line-mask');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        wrapper.style.verticalAlign = 'top';

        const inner = document.createElement('div');
        inner.classList.add('line');
        inner.innerText = originalText;
        inner.style.display = 'inline-block';

        wrapper.appendChild(inner);
        element.appendChild(wrapper);
      }
    });

    return {
      chars: document.querySelectorAll(`${selector} .char`),
      lines: document.querySelectorAll(`${selector} .line`)
    };
  }

  const splitPreloaderHeader = splitText(".preloader-header a", "chars");
  const splitPreloaderCopy = splitText(".preloader-copy p", "lines");
  const splitHeader = splitText(".header-row h1", "lines");

  const chars = gsap.utils.toArray(splitPreloaderHeader.chars);
  const lines = gsap.utils.toArray(splitPreloaderCopy.lines);
  const headerLines = gsap.utils.toArray(splitHeader.lines);
  const initialChar = chars[0];
  const lastChar = chars[chars.length - 1];

  console.log(`Chars: ${chars.length}, Lines: ${lines.length}, HeaderLines: ${headerLines.length}`);

  // INITIAL STATE - Everything hidden below their masks
  gsap.set(chars, { yPercent: 100 });
  gsap.set(lines, { yPercent: 100 });
  gsap.set(headerLines, { yPercent: 100 });

  const preloaderImages = gsap.utils.toArray(".preloader-images .img");
  const preloaderImagesInner = gsap.utils.toArray(".preloader-images .img img");

  // === TIMELINE ===
  const tl = gsap.timeline({ delay: 0.25 });

  // === PHASE 1: PROGRESS BAR ===
  tl.to(".progress-bar", {
    scaleX: 1,
    duration: 4,
    ease: "power3.inOut",
  })
    .set(".progress-bar", { transformOrigin: "right" })
    .to(".progress-bar", {
      scaleX: 0,
      duration: 1,
      ease: "power3.in",
    });

  // === PHASE 2: IMAGES REVEAL ===
  preloaderImages.forEach((img, i) => {
    tl.to(img, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.2,
      ease: "power4.out",
    }, i === 0 ? undefined : "-=0.7");
  });

  preloaderImagesInner.forEach((img, i) => {
    tl.to(img, {
      scale: 1,
      duration: 1.5,
      ease: "power4.out",
    }, "<"); // Start simultaneously with reveal
  });

  // === PHASE 3: REVEAL TEXT (Name + Copy) ===
  // Add a label for clarity
  tl.addLabel("textReveal");

  // Reveal the preloader copy lines
  tl.to(lines, {
    yPercent: 0,
    duration: 1.5,
    ease: "power4.out",
    stagger: 0.1,
  }, "textReveal");

  // Reveal the name chars AT THE SAME TIME
  tl.to(chars, {
    yPercent: 0,
    duration: 1,
    ease: "power4.out",
    stagger: 0.04,
  }, "textReveal");

  // === PHASE 4: PAUSE TO SHOW FULL NAME ===
  tl.addLabel("pause", "+=1"); // 1 second pause after text reveal

  // === PHASE 5: HIDE IMAGES ===
  tl.to(".preloader-images", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 1,
    ease: "power4.out",
  }, "pause");

  // === PHASE 6: HIDE COPY ===
  tl.to(lines, {
    yPercent: -100,
    duration: 1,
    ease: "power4.out",
    stagger: 0.1,
  }, "pause+=0.2");

  // === PHASE 7: COLLAPSE NAME TO DZ ===
  tl.addLabel("collapse", "pause+=1.2");

  tl.to(chars, {
    yPercent: (i) => (i === 0 || i === chars.length - 1) ? 0 : 100,
    duration: 1,
    ease: "power4.out",
    stagger: 0.025,
    onStart: () => {
      if (initialChar) initialChar.parentElement.style.overflow = "visible";
      if (lastChar) lastChar.parentElement.style.overflow = "visible";
    }
  }, "collapse");

  // Move D and Z to center
  tl.to([initialChar, lastChar], {
    duration: 1,
    ease: "power4.out",
    x: (i) => {
      const centerX = window.innerWidth / 2;
      const rect = (i === 0 ? initialChar : lastChar).getBoundingClientRect();
      return i === 0
        ? centerX - rect.left - rect.width
        : centerX - rect.left;
    },
  }, "collapse+=0.3");

  // === PHASE 8: HIDE PRELOADER ===
  tl.addLabel("hidePreloader", "collapse+=1.3");

  tl.set(".preloader-header", { mixBlendMode: "difference" }, "hidePreloader");

  tl.to(".preloader-header", {
    y: "2rem",
    scale: 0.35,
    duration: 1.75,
    ease: "power4.out",
  }, "hidePreloader");

  tl.to(".preloader", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 1.75,
    ease: "power4.out",
  }, "hidePreloader");

  // === PHASE 9: REVEAL MAIN PAGE ===
  tl.addLabel("mainReveal", "hidePreloader+=0.5");

  tl.to(headerLines, {
    yPercent: 0,
    duration: 1,
    ease: "power4.out",
    stagger: 0.1,
  }, "mainReveal");

  tl.to(".divider", {
    scaleX: 1,
    duration: 1,
    ease: "power4.out",
    stagger: 0.1,
  }, "mainReveal");

  console.log("Timeline created with explicit labels");
});
