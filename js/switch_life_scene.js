const lifeButtons = document.querySelectorAll("#life-zone [data-life-mode]");
const lifePanes = document.querySelectorAll("#life-zone [data-life-pane]");

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
  });
});

