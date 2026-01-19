
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lenis with explicit RAF loop
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Initialize Lottie
  lottie.loadAnimation({
    container: document.querySelector(".lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./public/fire.json",
  });

  // Initialize spotlight effect
  setTimeout(init, 100);
});

const spotlight = document.querySelector(".spotlight");
const lottieContainer = document.querySelector(".lottie-container");
const spotlightMask = document.querySelector(".spotlight-mask");

const state = {
  isTracking: false,
  cursorDetected: false,
};

const pos = {
  mouse: {
    target: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
  },
  lottie: {
    current: { x: 0, y: 0 },
    center: { x: 0, y: 0 },
  },
};


function init() {
  lottieContainer.style.transform = "none"; // Reset transform to get accurate bounding box
  const spotlightRect = spotlight.getBoundingClientRect();
  const lottieRect = lottieContainer.getBoundingClientRect();

  pos.lottie.center.x =
    lottieRect.left - spotlightRect.left + lottieRect.width / 2;
  pos.lottie.center.y =
    lottieRect.top - spotlightRect.top + lottieRect.height / 2;

  pos.mouse.current.x = pos.mouse.target.x = spotlightRect.width / 2;
  pos.mouse.current.y = pos.mouse.target.y = spotlightRect.height / 2;
}

function updateCursor(x, y) {
  if (!state.cursorDetected) return;

  pos.mouse.last.x = x;
  pos.mouse.last.y = y;

  const spotlightRect = spotlight.getBoundingClientRect();
  const isInsideSpotlight =
    x >= spotlightRect.left &&
    x <= spotlightRect.right &&
    y >= spotlightRect.top &&
    y <= spotlightRect.bottom;

  if (isInsideSpotlight) {
    pos.mouse.target.x = x - spotlightRect.left;
    pos.mouse.target.y = y - spotlightRect.top;
    state.isTracking = true;
    spotlightMask.classList.add("active");
  } else {
    state.isTracking = false;
    spotlightMask.classList.remove("active");
  }
}

window.addEventListener(
  "mouseenter",
  (e) => {
    state.cursorDetected = true;
    updateCursor(e.clientX, e.clientY);
  },
  { once: true }
);

window.addEventListener(
  "mouseover",
  (e) => {
    state.cursorDetected = true;
    updateCursor(e.clientX, e.clientY);
  },
  { once: true }
);

document.addEventListener("mousemove", (e) => {
  state.cursorDetected = true;
  updateCursor(e.clientX, e.clientY);
});


window.addEventListener("scroll", () => {
  if (state.cursorDetected) {
    // Recalculate relative position on scroll
    updateCursor(pos.mouse.last.x, pos.mouse.last.y);
  }
});

window.addEventListener("resize", init);

function animate() {
  pos.mouse.current.x += (pos.mouse.target.x - pos.mouse.current.x) * 0.1;
  pos.mouse.current.y += (pos.mouse.target.y - pos.mouse.current.y) * 0.1;

  spotlight.style.setProperty("--mouse-x", `${pos.mouse.current.x}px`);
  spotlight.style.setProperty("--mouse-y", `${pos.mouse.current.y}px`);


  const targetX = state.isTracking
    ? pos.mouse.current.x - pos.lottie.center.x - 50
    : 0;
  const targetY = state.isTracking
    ? pos.mouse.current.y - pos.lottie.center.y - 50
    : 0;

  pos.lottie.current.x += (targetX - pos.lottie.current.x) * 0.1;
  pos.lottie.current.y += (targetY - pos.lottie.current.y) * 0.1;

  lottieContainer.style.transform = `translate(${pos.lottie.current.x}px, ${pos.lottie.current.y}px)`;

  requestAnimationFrame(animate);
}


// animate() called inside init logic or separately? animate() needs to be called.
animate();
