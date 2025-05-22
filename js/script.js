document.addEventListener("DOMContentLoaded", function () {
  // ======= HERO SLIDESHOW =======
  const images = [
    'img/slide4.jpg',
    'img/slide5.jpg',
    'img/slide6.jpg',
    'img/slide7.jpg',
  ];
  let current = 0;
  const bg = document.querySelector('.hero-background');
  const leftArrow = document.querySelector('.hero-arrow-left');
  const rightArrow = document.querySelector('.hero-arrow-right');
  let intervalId;

  function setHeroBackground(idx) {
    if (bg) {
      bg.style.opacity = 0;
      setTimeout(() => {
        bg.style.backgroundImage =
          `linear-gradient(rgba(15,46,32,0.31),rgba(15,46,32,0.38)), url('${images[current]}')`;;
        bg.style.opacity = 1;
      }, 150);
    }
  }

  function nextSlide() {
    current = (current + 1) % images.length;
    setHeroBackground(current);
    resetInterval();
  }
  function prevSlide() {
    current = (current - 1 + images.length) % images.length;
    setHeroBackground(current);
    resetInterval();
  }

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', prevSlide);
    rightArrow.addEventListener('click', nextSlide);
  }

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 6000);
  }

  // INICIALIZAÇÃO
  if (bg) {
    setHeroBackground(current);
    resetInterval();
  }

  // ======= MENU RESPONSIVO =======
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("show");
      toggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
    });
  }

  // ======= TROCA DE IDIOMA (BANDEIRAS) =======
  window.trocarIdioma = function(lang) {
    if (lang === "en") {
      location.href = "index-en.html";
    } else {
      location.href = "index.html";
    }
  };
});