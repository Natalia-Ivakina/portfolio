document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#ns-stories");
  if (!root) return;

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-zone], [data-life-mode]");
    if (!btn) return;

    //aria-pressed
    btn.parentElement
      .querySelectorAll("button")
      .forEach((b) => b.setAttribute("aria-pressed", b === btn));

    if (btn.dataset.zone) {
      root.querySelectorAll("[data-zone]").forEach((b) => {
        root.querySelector(`#${b.dataset.zone}`).hidden = b !== btn;
      });
    } else {
      root
        .querySelectorAll("[data-life-pane]")
        .forEach((p) =>
          p.classList.toggle(
            "is-active",
            p.dataset.lifePane === btn.dataset.lifeMode,
          ),
        );
    }
  });
});
