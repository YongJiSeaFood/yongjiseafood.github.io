document.addEventListener("DOMContentLoaded", function () {
  if (!window.gsap) {
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function getAnimationVars(effect) {
    switch (effect) {
      case "fade-down":
        return { autoAlpha: 0, y: -36 };
      case "flip-up":
        return {
          autoAlpha: 0,
          y: 28,
          rotationX: -18,
          transformPerspective: 800,
        };
      case "flip-down":
        return {
          autoAlpha: 0,
          y: -28,
          rotationX: 18,
          transformPerspective: 800,
        };
      case "fade-up":
      default:
        return { autoAlpha: 0, y: 36 };
    }
  }

  document.querySelectorAll("[data-gsap]").forEach((element) => {
    const effect = element.getAttribute("data-gsap");
    const duration =
      Number(element.getAttribute("data-gsap-duration")) / 1000 || 0.72;
    const fromVars = getAnimationVars(effect);
    const animationVars = {
      ...fromVars,
      duration,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    };

    if (ScrollTrigger) {
      animationVars.scrollTrigger = {
        trigger: element,
        start: "top 82%",
        once: true,
      };
    }

    gsap.from(element, animationVars);
  });
});
