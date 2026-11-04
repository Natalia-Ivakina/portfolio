export function scrollStageIntoView(stage) {
  if (!stage || window.innerWidth > 768) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.setTimeout(() => {
    const y =
      stage.getBoundingClientRect().top +
      window.scrollY -
      150 +
      window.innerHeight * 0.05;

    window.scrollTo({
      top: y,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, 100);
}