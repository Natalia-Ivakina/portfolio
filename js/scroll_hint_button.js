/**
 * Handles scroll hint
 * click → smooth scroll down
 * scroll → hide/show hint
 */
document.querySelector(".scroll-hint").addEventListener("click", () => {
  window.scrollBy({
    top: window.innerHeight * 0.9,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  const hint = document.querySelector(".scroll-hint");
  if (hint) {
    hint.style.opacity = window.scrollY > 300 ? "0" : "1";
    hint.style.pointerEvents = window.scrollY > 300 ? "none" : "auto";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hint = document.querySelector(".scroll-hint");
  if (hint && hint.parentElement !== document.body) {
    document.body.appendChild(hint);
  }
});
