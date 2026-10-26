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

const triangleMover = document.querySelector("#triangle-2-mover");
const triangleSprite2 = document.querySelector("#triangle-2");

const multiTriangle = document.querySelector("#multi-triangle");

triangleSprite.addEventListener("animationend", function (event) {
  if (event.animationName !== "triangle-1-y") return;

  triangle.classList.remove("is-active");
  triangleMover.classList.add("is-active");
});

triangleSprite2.addEventListener("animationend", function (event) {
  if (event.animationName !== "triangle-2-y") return;

  triangleMover.classList.remove("is-active");
  multiTriangle.classList.add("is-active");
});

triangle.addEventListener("click", function () {
  if (!triangle.classList.contains("is-idle")) return;
  restartGame();
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

async function restartGame() {
  const myRun = ++runId;

  // clean
  heroScenes.forEach(function (scene) {
    scene.classList.remove("is-active");
  });
  triangle.classList.remove("is-active");
  triangle.classList.remove("is-idle");
  triangleMover.classList.remove("is-active");
  multiTriangle.classList.remove("is-active");

  torches.forEach(function (torch) {
    torch.querySelector(".torch-stage1").classList.remove("is-active");
    torch.querySelector(".torch-stage2").classList.remove("is-active");
  });

  // wait
  await buildAllBricks();
  if (myRun !== runId) return;

  void container.offsetWidth;

  triangle.classList.add("is-active");
  torches.forEach(function (torch) {
    torch.querySelector(".torch-stage1").classList.add("is-active");
  });

  showScene(0);
}

window.restartGame = restartGame;
