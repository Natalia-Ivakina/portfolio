import { buildAllBricks, brickImages } from "./wall_animation.js";

const sprites = [
  "./src/game-assets/Movement/run.png",
  "./src/game-assets/Movement/stop.png",
  "./src/game-assets/Movement/turn.png",
  "./src/game-assets/Movement/sword.png",
  "./src/game-assets/Movement/idle.png",
  "./src/game-assets/torch/torch-ignite-sprites-1.png",
  "./src/game-assets/torch/torch-burn-loop-sprites-2.png",
  "./src/game-assets/pedestal.png",
  "./src/game-assets/triangle/triangle-shine-sprites-1.png",
  "./src/game-assets/triangle/triangle-ignite-sprites-2.png",
  "./src/game-assets/triangle/triangle-glow-loop-sprites-3.png",
  ...brickImages,
];

const loaded = [];

function preload(urls) {
  urls.forEach(function (url) {
    const img = new Image();
    img.src = url;
    img.decode().catch(function () {});
    loaded.push(img);
  });
}

preload(sprites);

const container = document.querySelector("#game-content");

//triangle
const triangle = document.querySelector("#triangle-container");
const triangleSprite = document.querySelector("#triangle-1");

const multiTriangle1 = document.querySelector("#multi-triangle1");
const triangleSprite2 = document.querySelector("#multi-triangle1 .triangle-2");

const multiTriangle2 = document.querySelector("#multi-triangle2");

triangleSprite.addEventListener("animationend", function (event) {
  if (event.animationName !== "triangle-1-y") return;

  triangle.classList.remove("is-active");
  multiTriangle1.classList.add("is-active");
});

triangleSprite2.addEventListener("animationend", function (event) {
  if (event.animationName !== "triangle-2-y") return;

  multiTriangle1.classList.remove("is-active");
  multiTriangle2.classList.add("is-active");
});

//torches
const torches = document.querySelectorAll(".torch-container");
torches.forEach(function (torch) {
  const stage1 = torch.querySelector(".torch-stage1");
  const stage2 = torch.querySelector(".torch-stage2");

  torch.addEventListener("animationend", function (event) {
    if (event.target !== stage1) return;
    if (event.animationName !== "torch1-y") return;

    stage1.classList.remove("is-active");
    stage2.classList.add("is-active");
  });
});

//hero
let current = 0;
const heroScenes = [
  container.querySelector(".hero-mover"),
  container.querySelector(".stop"),
  container.querySelector(".turn"),
  container.querySelector(".sword"),
  container.querySelector(".idle"),
];

function showScene(index) {
  heroScenes.forEach(function (scene, i) {
    scene.classList.toggle("is-active", i === index);
  });
  current = index;
}

container.addEventListener("animationend", function (event) {
  if (event.target !== heroScenes[current]) return;

  if (current + 1 < heroScenes.length) {
    showScene(current + 1);
  }
});

//start
let runId = 0;
let busy = false;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Resets the scene:
// hides the hero,
// torches and triangles,
// removes the wall
function clearScene() {
  runId++;
  busy = false;

  heroScenes.forEach(function (scene) {
    scene.classList.remove("is-active");
  });
  multiTriangle1.classList.remove("is-active");
  multiTriangle2.classList.remove("is-active");
  triangle.classList.remove("is-active");
  triangle.classList.add("is-idle");

  torches.forEach(function (torch) {
    torch.querySelector(".torch-stage1").classList.remove("is-active");
    torch.querySelector(".torch-stage2").classList.remove("is-active");
  });

  document.querySelector("#bricks-top").replaceChildren();
  document.querySelector("#bricks-bottom").replaceChildren();
}

// Restarts the scene
async function restartGame() {
  clearScene();
  const myRun = ++runId;
  busy = true;

  await sleep(1000);
  if (myRun !== runId) return;

  await buildAllBricks();
  if (myRun !== runId) return;

  triangle.classList.remove("is-idle");
  void triangle.offsetWidth;
  triangle.classList.add("is-active");

  torches.forEach(function (torch) {
    torch.querySelector(".torch-stage1").classList.add("is-active");
  });

  showScene(0);
  busy = false;
}

let lastWidth = window.innerWidth;

window.addEventListener("resize", function () {
  if (window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  clearScene();
});

triangle.addEventListener("click", function () {
  if (busy || !triangle.classList.contains("is-idle")) return;
  document.dispatchEvent(new CustomEvent("game:restart-request"));
  restartGame();
});

window.restartGame = restartGame;
