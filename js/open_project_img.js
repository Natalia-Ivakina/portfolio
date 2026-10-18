/**
 * Handles project images
 */
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".open-image");

  if (!images.length) return;

  const pb = document.createElement("div");
  pb.className = "project-image";

  pb.innerHTML = `
  <div class="project-image-wrap">
    <button class="project-image-close" aria-label="Close">
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <img class="project-image-open" alt="">
  </div>
`;

  document.body.appendChild(pb);

  const pbImg = pb.querySelector(".project-image-open");
  const pbClose = pb.querySelector(".project-image-close");

  function openImage(img) {
    pbImg.src = img.dataset.full;
    pbImg.alt = img.alt || "";

    pb.classList.add("is-open");
  }

  function closeImage() {
    pb.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  images.forEach((image) => {
    image.addEventListener("click", () => {
      openImage(image);
    });
  });

  pbClose.addEventListener("click", closeImage);
  pbImg.addEventListener("click", closeImage);

  pb.addEventListener("click", (e) => {
    if (e.target === pb) {
      closeImage();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pb.classList.contains("is-open")) {
      closeImage();
    }
  });
});
