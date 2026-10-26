function drawPixelFrame(canvas) {
  const svg = canvas.querySelector(".pixel-svg");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width === 0 || height === 0) return;

  const size = 4;
  let html = "";

  function addPixel(x, y, chance) {
    if (Math.random() > chance) return;

    const opacity = (0.4 + Math.random() * 0.5).toFixed(2);
    html += `<rect x="${x}" y="${y}" width="${size}" height="${size}" opacity="${opacity}"/>`;
  }

  // pixel line
  function addRing(offset, chance) {
    for (let x = offset; x < width - offset; x += size) {
      addPixel(x, offset, chance);                   
      addPixel(x, height - size - offset, chance);   
    }
    for (let y = offset + size; y < height - size - offset; y += size) {
      addPixel(offset, y, chance);                   
      addPixel(width - size - offset, y, chance);    
    }
  }

  addRing(-size, 0.2);   // outside
  addRing(0, 0.5);       // middle
  addRing(size, 0.7);    // inside

  svg.innerHTML = html;
}

const canvas = document.querySelector("#game-action-container");
new ResizeObserver(function () {
  drawPixelFrame(canvas);
}).observe(canvas);