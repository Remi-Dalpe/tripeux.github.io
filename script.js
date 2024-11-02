'use strict';

/////////////////////////////////////////////////
// Slider

const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll(`.dots__dot`).forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };
  //  Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // curSlide - 1: -100%, 0%, 100%, 200%

  //  Previous slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // curSlide + 1: 0%, 100%, 200%, 300%

  const init = function () {
    goToSlide(0);
    createDots(0);
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/////////////////////////////////////////////////
////////////////////////////////////////////////
// Performances ////////////////////////////////
////////////////////////////////////////////////
// Lazy Loading Images

// Selecting all images w/ date-src attribute
const imgTargets = document.querySelectorAll(`img[data-src]`);

// Loading images when it enters view port
const loadImg = function (entries, observer) {
  // Destructuring entries to get the first
  entries.forEach(entry => {
    // Check if the image is visible
    if (!entry.isIntersecting) return;

    // Replace the src w/ the data-src
    entry.target.src = entry.target.dataset.src;

    // Removal of blur effect
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    // Stop observing the image as it's loaded already
    observer.unobserve(entry.target);
  });
};

// Creates observer w/ argument: callback function loadImg to be executed when images come into view
const imgObserver = new IntersectionObserver(loadImg, {
  // Viewport selected as root for intersection detection
  root: null,
  // Trigger before image becomes visible
  threshold: 0.1,
  // Observer triggers loadImg when image is within 200px of viewport for early loading
  rootMargin: '200px',
});

// Iterates over all imgTargets & instruct the observer to observe them
imgTargets.forEach(img => imgObserver.observe(img));
