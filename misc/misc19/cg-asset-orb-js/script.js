
const totalImages = 30;
const totalItems = 100;
const baseWidth = 1;
const baseHeight = 0.6;
const sphereRadius = 5;
const backgroundColor = "000000";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance",
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(parseInt(backgroundColor, 16));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.LinearEncoding;
renderer.gammaFactor = 2.2;
document.querySelector(".container").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 1.2;
controls.minDistance = 6;
controls.maxDistance = 10;
controls.enableSmoothing = true;
controls.smoothingFactor = 0.1;
controls.enableZoom = true;
controls.zoomDampingFactor = 0.2;
controls.enablePan = false;

const textureLoader = new THREE.TextureLoader();
let loadedCount = 0;

const getRandomImagePath = () => {
  const imageNumber = Math.floor(Math.random() * totalImages) + 1;
  return `./assets/img${imageNumber}.jpeg`;
};

const createImagePlane = (texture) => {
  const imageAspect = texture.image.width / texture.image.height;
  let width = baseWidth;
  let height = baseHeight;

  if (imageAspect > 1) {
    height = width / imageAspect;
  } else {
    width = height * imageAspect;
  }

  return new THREE.PlaneGeometry(width, height);
};

const loadImageMesh = (phi, theta) => {
  textureLoader.load(
    getRandomImagePath(),
    (texture) => {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const geometry = createImagePlane(texture);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: false,
        depthWrite: true,
        depthTest: true,

      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      mesh.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      mesh.position.z = sphereRadius * Math.cos(phi);

      mesh.lookAt(0, 0, 0);
      mesh.rotateY(Math.PI);

      scene.add(mesh);

      loadedCount++;
      if (loadedCount === totalItems) {
        animate();
      }
    },
    undefined,
    (error) => console.error("Error loading texture:", error)
  );
};

const createSphere = () => {
  for (let i = 0; i < totalItems; i++) {
    const phi = Math.acos(-1 + (2 * i) / totalItems);
    const theta = Math.sqrt(totalItems * Math.PI) * phi;
    loadImageMesh(phi, theta);
  }
};

camera.position.z = 10;

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

createSphere();
