const container = document.querySelector("#game-content");

const scenes = [
  container.querySelector(".hero-mover"),
  container.querySelector(".stop"),
  container.querySelector(".turn"),
  container.querySelector(".sword"),
  container.querySelector(".idle"),
];

const loop = true;
let current = 0;

function showScene(index) {
  scenes.forEach(function (scene, i) {
    scene.style.display = i === index ? "block" : "none";
  });
  current = index;
}

container.addEventListener("animationend", function (event) {
  if (event.target !== scenes[current]) return;

  const next = current + 1;

  if (next < scenes.length) {
    showScene(next);
  } else if (loop) {
    showScene(0);
  }
});

function restartGame() {
  scenes.forEach(function (scene) {
    scene.style.display = "none";
  });

  void container.offsetWidth;

  showScene(0);
}
