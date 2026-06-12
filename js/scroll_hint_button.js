/**
 * Handles scroll hint interaction:
 * click → smooth scroll down
 * scroll → hide/show hint based on scroll position
 */
document.querySelector(".scroll-hint").addEventListener("click", () => {
  window.scrollBy({
    top: window.innerHeight * 0.7,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  const hint = document.querySelector(".scroll-hint");
  if (hint) {
    hint.style.opacity = window.scrollY > 50 ? "0" : "1";
    hint.style.pointerEvents = window.scrollY > 50 ? "none" : "auto";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hint = document.querySelector(".scroll-hint");
  if (hint && hint.parentElement !== document.body) {
    document.body.appendChild(hint);
  }
});
