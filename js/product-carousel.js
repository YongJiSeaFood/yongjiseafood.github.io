document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("product-carousel");
  if (!carousel) {
    return;
  }

  const track = carousel.querySelector(".product-carousel__track");
  const slides = Array.from(
    carousel.querySelectorAll(".product-carousel__slide")
  );
  const dots = Array.from(carousel.querySelectorAll(".product-carousel__dot"));
  const prevButton = carousel.querySelector("[data-product-carousel-prev]");
  const nextButton = carousel.querySelector("[data-product-carousel-next]");
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayId = null;
  let touchStartX = 0;
  let touchEndX = 0;

  if (!track || totalSlides === 0) {
    return;
  }

  function getSlideOffset(index) {
    const slide = slides[index];
    const gap =
      totalSlides > 1
        ? slides[1].offsetLeft - slides[0].offsetLeft - slides[0].offsetWidth
        : 0;
    return index * (slide.offsetWidth + gap);
  }

  function animateTo(index, immediate) {
    currentIndex = (index + totalSlides) % totalSlides;
    const targetX = -getSlideOffset(currentIndex);
    const animation = window.gsap;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
      dot.setAttribute(
        "aria-current",
        dotIndex === currentIndex ? "true" : "false"
      );
    });

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");

      if (animation) {
        animation.to(slide, {
          opacity: isActive ? 1 : 0.58,
          scale: isActive ? 1 : 0.92,
          y: isActive ? 0 : 12,
          duration: immediate ? 0 : 0.45,
          ease: "power2.out",
          overwrite: true,
        });
      } else {
        slide.style.opacity = isActive ? "1" : "0.58";
        slide.style.transform = isActive
          ? "scale(1)"
          : "scale(0.92) translateY(12px)";
      }
    });

    if (animation) {
      animation.to(track, {
        x: targetX,
        duration: immediate ? 0 : 0.58,
        ease: "power3.inOut",
        overwrite: true,
      });
    } else {
      track.style.transform = `translateX(${targetX}px)`;
    }
  }

  function next() {
    animateTo(currentIndex + 1);
  }

  function previous() {
    animateTo(currentIndex - 1);
  }

  function restartAutoPlay() {
    window.clearInterval(autoPlayId);
    autoPlayId = window.setInterval(next, 5200);
  }

  prevButton?.addEventListener("click", function () {
    previous();
    restartAutoPlay();
  });

  nextButton?.addEventListener("click", function () {
    next();
    restartAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      animateTo(index);
      restartAutoPlay();
    });
  });

  carousel.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchEndX = touchStartX;
  });

  carousel.addEventListener("touchmove", function (event) {
    touchEndX = event.touches[0].clientX;
  });

  carousel.addEventListener("touchend", function () {
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) > 48) {
      distance < 0 ? next() : previous();
      restartAutoPlay();
    }
    touchStartX = 0;
    touchEndX = 0;
  });

  window.addEventListener("resize", function () {
    animateTo(currentIndex, true);
  });

  if (window.gsap) {
    window.gsap.from(carousel, {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      ease: "power2.out",
      delay: 0.15,
    });
  }

  animateTo(0, true);
  restartAutoPlay();
});
