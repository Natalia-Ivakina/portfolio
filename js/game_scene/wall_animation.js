const W = 45;
const H = 24;
const columnTime = 300;
const fallTime = 700;

const sceneTop = document.querySelector("#bricks-top");
const sceneBottom = document.querySelector("#bricks-bottom");

export const brickImages = [];
for (let i = 1; i <= 20; i++) {
  brickImages.push(
    "./src/game-assets/bricks/stone-" + String(i).padStart(2, "0") + ".png",
  );
}

function dropBrick(scene, x, y, frontX, delay) {
  const brick = document.createElement("img");
  brick.className = "brick";
  brick.alt = "";
  brick.src = brickImages[Math.floor(Math.random() * brickImages.length)];
  brick.style.left = x + "px";
  brick.style.top = y + "px";
  scene.append(brick);

  const spawnX = frontX + (Math.random() - 0.5) * 25;
  const spawnY = y + H / 2 - (20 + Math.random() * 25);
  const dx = spawnX - (x + W / 2);
  const dy = spawnY - (y + H / 2);

  const animation = brick.animate(
    [
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(1.8)` },
      { opacity: 1, transform: "translate(0px, 0px) scale(1)" },
    ],
    { duration: fallTime, delay: delay, easing: "ease-out", fill: "backwards" },
  );

  return animation.finished;
}

function buildWall(scene, isTop) {
  scene.replaceChildren();

  const width = scene.clientWidth;
  const height = scene.clientHeight;
  const columns = Math.ceil(width / W) + 1;
  const rows = Math.ceil(height / H);
  const gap = columnTime / rows;

  let delay = 0;
  let last = Promise.resolve();

  for (let col = 0; col < columns; col++) {
    const frontX = col * W + W / 2;
    const slots = [];

    for (let row = 0; row < rows; row++) {
      // shift
      const shift = (row % 2) * (W / 2);
      const x = col * W - shift;
      if (x >= width) continue;
      const y = isTop ? height - (row + 1) * H : row * H;
      slots.push({ x: x, y: y });
    }

    slots.sort(function () {
      return Math.random() - 0.5;
    });

    slots.forEach(function (slot) {
      last = dropBrick(scene, slot.x, slot.y, frontX, delay);
      delay += gap;
    });
  }

  return last;
}

export function buildAllBricks() {
  return Promise.all([
    buildWall(sceneTop, true),
    buildWall(sceneBottom, false),
  ]);
}
