import gsap from "https://esm.sh/gsap";

document.fonts.ready.then(() => {
  function createSplitTexts(elements) {
    const splits = {};

    elements.forEach(({ key, selector, type }) => {
      // Initialize with empty arrays to prevent crashes if not found
      splits[key] = { chars: [], lines: [] };

      const els = document.querySelectorAll(selector);
      if (els.length > 0) {
        els.forEach(el => {
          let text = el.innerText.trim(); // Use innerText and trim to avoid whitespace issues
          if (!text) return; // Skip empty elements

          if (type === "chars") {
            el.innerHTML = "";
            text.split("").forEach(char => {
              // Wrapper for mask
              const div = document.createElement("div");
              div.style.overflow = "hidden";
              div.style.display = "inline-flex";

              const span = document.createElement("span");
              span.textContent = char === " " ? "\u00A0" : char;
              span.className = "char";
              span.style.display = "inline-block";
              span.style.willChange = "transform";

              div.appendChild(span);
              el.appendChild(div);
              splits[key].chars.push(span);
            });
          } else if (type === "lines") {
            // Robust "line" split that preserves spacing using text nodes

            const words = text.split(" "); // Split by space to preserve order
            el.innerHTML = "";

            const nodes = [];  // Track both spans and space nodes

            words.forEach((word, index) => {
              if (word === "") return; // Skip potential empty splits from double spaces

              const span = document.createElement("span");
              span.textContent = word;
              span.style.display = "inline-block";
              el.appendChild(span);
              nodes.push({ type: "span", node: span });

              // Add space after word (except for the last one)
              if (index < words.length - 1) {
                const spaceNode = document.createTextNode(" ");
                el.appendChild(spaceNode);
                nodes.push({ type: "space", node: spaceNode });
              }
            });

            // Group by lines based on offsetTop of spans
            let lines = [];
            let currentLine = [];
            let lastTop = -1;

            nodes.forEach(item => {
              if (item.type === "span") {
                const span = item.node;
                if (lastTop === -1) lastTop = span.offsetTop;

                // If explicit new line detected by offset
                if (span.offsetTop > lastTop + 5) {
                  if (currentLine.length > 0) lines.push(currentLine);
                  currentLine = [];
                  lastTop = span.offsetTop;
                }
              }
              // Add both spans and spaces to the current line
              currentLine.push(item.node);
            });
            if (currentLine.length > 0) lines.push(currentLine);

            const isSingleLine = lines.length === 1;

            el.innerHTML = "";
            lines.forEach(lineNodes => {
              // Mask container
              const div = document.createElement("div");
              div.style.overflow = "hidden";
              div.style.display = isSingleLine ? "inline-block" : "block";

              // Inner animating element (Class "line")
              const lineInner = document.createElement("div");
              lineInner.className = "line";
              lineInner.style.display = "block";
              lineInner.style.willChange = "transform";

              lineNodes.forEach(node => lineInner.appendChild(node));
              div.appendChild(lineInner);
              el.appendChild(div);

              splits[key].lines.push(lineInner);
            });
          }
        });
      }
    });

    return splits;
  }

  const splitElements = [
    { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
    { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
    { key: "headerChars", selector: ".header h1", type: "chars" },
    { key: "heroFooterH3", selector: ".hero-footer h3", type: "lines" },
    { key: "heroFooterP", selector: ".hero-footer p", type: "lines" },
    { key: "btnLabels", selector: ".btn-label span", type: "lines" },
  ];

  const splits = createSplitTexts(splitElements);

  gsap.set([splits.logoChars.chars], { x: "100%" });
  gsap.set(
    [
      splits.footerLines.lines,
      splits.headerChars.chars,
      splits.heroFooterH3.lines,
      splits.heroFooterP.lines,
      splits.btnLabels.lines,
    ],
    { y: "100%" }
  );
  gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });
  gsap.set(".btn", { scale: 0 });

  function animateProgress(duration = 4) {
    const tl = gsap.timeline();
    const counterSteps = 5;
    let currentProgress = 0;

    for (let i = 0; i < counterSteps; i++) {
      const finalStep = i === counterSteps - 1;
      const targetProgress = finalStep
        ? 1
        : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
      currentProgress = targetProgress;

      tl.to(".preloader-progress-bar", {
        scaleX: targetProgress,
        duration: duration / counterSteps,
        ease: "power2.out",
      });
    }

    return tl;
  }

  const tl = gsap.timeline({ delay: 0.5 });

  tl.to(splits.logoChars.chars, {
    x: "0%",
    stagger: 0.05,
    duration: 1,
    ease: "power4.inOut",
  })
    .to(
      splits.footerLines.lines,
      {
        y: "0%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "0.25"
    )
    .add(animateProgress(), "<")
    .set(".preloader-progress", { backgroundColor: "#fff" })
    .to(
      splits.logoChars.chars,
      {
        x: "-100%",
        stagger: 0.05,
        duration: 1,
        ease: "power4.inOut",
      },
      "-=0.5"
    )
    .to(
      splits.footerLines.lines,
      {
        y: "-100%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    )
    .to(
      ".preloader-progress",
      {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.25"
    )
    .to(
      ".preloader-mask",
      {
        scale: 6,
        duration: 2.5,
        ease: "power3.out",
      },
      "<"
    )
    .to(
      ".hero-img",
      {
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
      },
      "<"
    )
    .to(splits.headerChars.chars, {
      y: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power4.out",
      delay: -2,
    })
    .to(
      [splits.heroFooterH3.lines, splits.heroFooterP.lines],
      {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      },
      "-=1.5"
    )
    .to(
      ".btn",
      {
        scale: 1,
        duration: 1,
        ease: "power4.out",
        onStart: () => {
          tl.to(".btn-icon", {
            clipPath: "circle(100% at 50% 50%)",
            duration: 1,
            ease: "power2.out",
            delay: -1.25,
          }).to(splits.btnLabels.lines, {
            y: 0,
            duration: 1,
            ease: "power4.out",
            delay: -1.25,
          });
        },
      },
      "<"
    );
});
