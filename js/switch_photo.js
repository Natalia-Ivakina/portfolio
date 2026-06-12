const root = document.getElementById("main-content");
document.getElementById("toggleButton").addEventListener("click", () => {
  root.dataset.state = root.dataset.state === "skills" ? "facts" : "skills";
});
