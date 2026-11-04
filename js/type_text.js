export function createTyper({
  label,
  code,
  speed = 35,
  steps = 22,
  endDelay = 250,
  lineDelay = 0, 
}) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let interval = 0;
  let timeout = 0;

  function stop() {
    window.clearInterval(interval);
    window.clearTimeout(timeout);
  }

  function typeByLine(source, afterTyping) {
    const lines = source.split("\n");
    let lineIndex = 0;
    let charIndex = 0;
    let done = ""; 

    function tick() {
      const line = lines[lineIndex];

      if (charIndex < line.length) {
        charIndex++;
        code.textContent = done + line.slice(0, charIndex);
        timeout = window.setTimeout(tick, speed);
        return;
      }

      done += line + (lineIndex < lines.length - 1 ? "\n" : "");
      code.textContent = done;
      lineIndex++;
      charIndex = 0;

      if (lineIndex >= lines.length) {
        timeout = window.setTimeout(afterTyping, endDelay);
      } else {
        timeout = window.setTimeout(tick, lineDelay);
      }
    }

    tick();
  }

  function type(language, source, afterTyping = () => {}) {
    stop();
    label.textContent = language;

    if (reducedMotion) {
      code.textContent = source;
      afterTyping();
      return;
    }

    code.textContent = "";

    if (lineDelay > 0) {
      typeByLine(source, afterTyping);
      return;
    }

    let visible = 0;
    interval = window.setInterval(() => {
      visible += Math.max(1, Math.ceil(source.length / steps));
      code.textContent = source.slice(0, visible);

      if (visible >= source.length) {
        window.clearInterval(interval);
        timeout = window.setTimeout(afterTyping, endDelay);
      }
    }, speed);
  }

  return { type, stop };
}