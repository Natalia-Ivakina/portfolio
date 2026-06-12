/**
 * Toggles the content state between "skills" and "facts".
 */
const root = document.getElementById("main-content");
const btn = document.getElementById("toggleButton");

document.getElementById("toggleButton").addEventListener("click", () => {
  root.dataset.state = root.dataset.state === "skills" ? "facts" : "skills";
  btn.classList.toggle("active");
});
