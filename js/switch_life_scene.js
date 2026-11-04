import { scrollStageIntoView } from "./scroll-stage.js";
import { createTyper } from "./type_text.js";

const lifeZone = document.querySelector("#life-zone");
const lifeButtons = lifeZone.querySelectorAll("[data-life-mode]");
const lifePanes = lifeZone.querySelectorAll("[data-life-pane]");
const lifeStage = lifeZone.querySelector(".ns-stage");

const lifeSnippets = {
  games: [
    "My favorite games:",
    "> Zelda (I suppose it is obvious)\n> Pikmin\n> Machinarium",
  ],
  glass: ["Art", "Coming soon..."],
  travel: ["Travels", "Coming soon..."],
  food: ["Food", "Coming soon..."],
};

//typers
const typers = new Map();
lifePanes.forEach((pane) => {
  const label = pane.querySelector(".life-text");
  const code = pane.querySelector(".life-code");
  if (label && code) {
    typers.set(
      pane.dataset.lifePane,
      createTyper({ label, code, speed: 60, lineDelay: 700 }),
    );
  }
});

function typeLifeSnippet(mode) {
  typers.forEach((typer) => typer.stop());
  const typer = typers.get(mode);
  const snippet = lifeSnippets[mode];
  if (typer && snippet) typer.type(...snippet);
}

//switcher side menu
lifeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.lifeMode;

    lifeButtons.forEach((btn) =>
      btn.setAttribute("aria-pressed", String(btn === button)),
    );
    lifePanes.forEach((pane) =>
      pane.classList.toggle("is-active", pane.dataset.lifePane === mode),
    );

    if (mode === "games" && typeof window.restartGame === "function") {
      window.restartGame();
    }

    typeLifeSnippet(mode);
    scrollStageIntoView(lifeStage);
  });
});

//triangle
document.addEventListener("game:restart-request", () => {
  typeLifeSnippet("games");
});
