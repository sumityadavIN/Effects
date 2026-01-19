window.addEventListener("DOMContentLoaded", function () {
  gsap.set("nav", { y: -100 });
  gsap.set(".letter-wrapper", { y: 400 });
  gsap.set(".item-copy-wrapper p", { y: 50 });

  // Using expo.out for a much smoother, premium feel without external dependencies
  gsap.defaults({ duration: 1.5, ease: "expo.out" });
  const tl = gsap.timeline({ paused: true, delay: 0.5 });

  tl.to(".letter-wrapper", {
    y: 0,
    stagger: 0.08,
    duration: 1.2,
  })
    .to(".header-item-1", {
      left: "12vw",
      duration: 1.5,
      ease: "power4.out" // Keep position moves a bit more snappy or distinct if needed, or use hop
    }, "-=1")
    .to(
      ".header-item-2",
      {
        right: "8vw",
        duration: 1.5,
        ease: "power4.out"
      },
      "<"
    )
    .to(
      ".item-main .item-img img",
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.5
      },
      "<"
    )
    .to(".header-item-1", {
      left: 0,
      scale: 1,
    }, "-=0.5")
    .to(
      ".header-item-2",
      {
        right: 0,
        scale: 1,
      },
      "<"
    )
    .to(
      ".item-main .item-img img",
      {
        scale: 1,
      },
      "<"
    )
    .to(
      ".item-side .item-img",
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        stagger: 0.1,
        duration: 1.2
      },
      "<"
    )
    .to(
      ".header",
      {
        bottom: "0",
      },
      "<"
    )
    .to(
      ".item-copy-wrapper p",
      {
        y: 0,
        stagger: 0.05,
      },
      "<"
    )
    .to(
      "nav",
      {
        y: 0,
      },
      "<"
    );

  tl.play();
});
