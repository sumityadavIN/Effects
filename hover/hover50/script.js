const config = {
  symbols: ["O", "X", "*", ">", "$", "W"],
  blockSize: 25,
  detectionRadius: 50,
  clusterSize: 7,
  blockLifetime: 300,
  emptyRatio: 0.3,
  scrambleRatio: 0.25,
  scrambleInterval: 150,
};

function getRandomSymbol() {
  return config.symbols[Math.floor(Math.random() * config.symbols.length)];
}

function initGridOverlay(element) {
  const gridOverlay = document.createElement("div");
  gridOverlay.className = "grid-overlay";

  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const cols = Math.ceil(width / config.blockSize);
  const rows = Math.ceil(height / config.blockSize);

  const blocks = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.className = "grid-block";

      const isEmpty = Math.random() < config.emptyRatio;
      block.textContent = isEmpty ? "" : getRandomSymbol();

      block.style.width = `${config.blockSize}px`;
      block.style.height = `${config.blockSize}px`;
      block.style.left = `${col * config.blockSize}px`;
      block.style.top = `${row * config.blockSize}px`;

      gridOverlay.appendChild(block);

      blocks.push({
        element: block,
        x: col * config.blockSize + config.blockSize / 2,
        y: row * config.blockSize + config.blockSize / 2,
        gridX: col,
        gridY: row,
        highlightEndTime: 0,
        isEmpty: isEmpty,
        shouldScramble: !isEmpty && Math.random() < config.scrambleRatio,
        scrambleInterval: null,
      });
    }
  }

  element.appendChild(gridOverlay);

  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closestBlock = null;
    let closestDistance = Infinity;

    for (const block of blocks) {
      const dx = mouseX - block.x;
      const dy = mouseY - block.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestBlock = block;
      }
    }

    if (!closestBlock || closestDistance > config.detectionRadius) return;

    const currentTime = Date.now();
    closestBlock.element.classList.add("active");
    closestBlock.highlightEndTime = currentTime + config.blockLifetime;

    if (closestBlock.shouldScramble && !closestBlock.scrambleInterval) {
      closestBlock.scrambleInterval = setInterval(() => {
        closestBlock.element.textContent = getRandomSymbol();
      }, config.scrambleInterval);
    }

    const clusterCount = Math.floor(Math.random() * config.clusterSize) + 1;
    let currentBlock = closestBlock;
    let activeBlocks = [closestBlock];

    for (let i = 0; i < clusterCount; i++) {
      const neighbors = blocks.filter((neighbor) => {
        if (activeBlocks.includes(neighbor)) return false;

        const dx = Math.abs(neighbor.gridX - currentBlock.gridX);
        const dy = Math.abs(neighbor.gridY - currentBlock.gridY);

        return dx <= 1 && dy <= 1;
      });

      if (neighbors.length === 0) break;

      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];

      randomNeighbor.element.classList.add("active");
      randomNeighbor.highlightEndTime =
        currentTime + config.blockLifetime + i * 10;

      if (randomNeighbor.shouldScramble && !randomNeighbor.scrambleInterval) {
        randomNeighbor.scrambleInterval = setInterval(() => {
          randomNeighbor.element.textContent = getRandomSymbol();
        }, config.scrambleInterval);
      }

      activeBlocks.push(randomNeighbor);
      currentBlock = randomNeighbor;
    }
  });

  function updateHighlights() {
    const currentTime = Date.now();

    blocks.forEach((block) => {
      if (block.highlightEndTime > 0 && currentTime > block.highlightEndTime) {
        block.element.classList.remove("active");
        block.highlightEndTime = 0;

        if (block.scrambleInterval) {
          clearInterval(block.scrambleInterval);
          block.scrambleInterval = null;
          if (!block.isEmpty) {
            block.element.textContent = getRandomSymbol();
          }
        }
      }
    });

    requestAnimationFrame(updateHighlights);
  }

  updateHighlights();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hover-img").forEach((element) => {
    initGridOverlay(element);
  });
});
