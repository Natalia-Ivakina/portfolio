function drawPixelFrame(canvas) {
  // canva
  const svg = canvas.querySelector(".pixel-svg");

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width === 0 || height === 0) {
    return;
  }

  const pixelSize = 4;
  const frameChance = 0.6;
  const strayChance = 0.8;

  let html = "";

  function addPixel(x, y, chance) {
    const random = Math.random();

    if (random < chance) {
      const opacity = (0.5 + Math.random() * 0.5).toFixed(2);

      html +=
        '<rect x="' +
        x +
        '" y="' +
        y +
        '" width="' +
        pixelSize +
        '" height="' +
        pixelSize +
        '" opacity="' +
        opacity +
        '"/>';
    }
  }

  for (let x = 0; x < width; x += pixelSize) {
    addPixel(x, 0, frameChance);
    addPixel(x, height - pixelSize, frameChance);

    addPixel(x, pixelSize, strayChance);
    addPixel(x, height - pixelSize * 2, strayChance);
  }

  for (let y = pixelSize; y < height - pixelSize; y += pixelSize) {
    addPixel(0, y, frameChance);
    addPixel(width - pixelSize, y, frameChance);

    addPixel(pixelSize, y, strayChance);
    addPixel(width - pixelSize * 2, y, strayChance);
  }

  svg.innerHTML = html;
}

const canvas = document.querySelector("#game-action-container");
const observer = new ResizeObserver(function () {
  drawPixelFrame(canvas);
});
observer.observe(canvas);
