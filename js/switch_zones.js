document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#ns-stories");
  if (!root) return;

  //switcher
  const zoneButtons = root.querySelectorAll("#sills-live-switcher [data-zone]");

  zoneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      zoneButtons.forEach((btn) => {
        const active = btn === button;
        const zone = root.querySelector(`#${btn.dataset.zone}`);

        btn.setAttribute("aria-pressed", String(active));
        if (zone) zone.hidden = !active;
      });
    });
  });

  const lifeButtons = root.querySelectorAll("#life-zone [data-life-mode]");

  const lifePanes = root.querySelectorAll("#life-zone [data-life-pane]");

  lifeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.lifeMode;

      lifeButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn === button));
      });

      lifePanes.forEach((pane) => {
        pane.classList.toggle("is-active", pane.dataset.lifePane === mode);
      });
    });
  });
});
