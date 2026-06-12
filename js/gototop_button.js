/**
 * Shows the "Back to Top" button after scrolling down
 * and smoothly scrolls the page to the top when clicked.
 */
window.addEventListener("scroll", function () {
  const btn = document.getElementById("scrollTopBtn");
  if (window.scrollY > 300) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
