'use strict';

///////////////////////////////////////
// Modal windows

const overlay = document.querySelector('.overlay');
const modals = document.querySelectorAll('.modal');
const btnCloseModals = document.querySelectorAll('.btn--close-modal');

// Function to open modal
const openModal = function (modalId) {
  document.getElementById(modalId).classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Function to close all modals
const closeModal = function () {
  modals.forEach(modal => modal.classList.add('hidden'));
  overlay.classList.add('hidden');
};

// Event delegation for opening modals
document.addEventListener('click', function (e) {
  const modalId = e.target.dataset.modal;
  if (modalId) {
    e.preventDefault();
    openModal(modalId);
  }
});

// Close modals on close button click or overlay click
btnCloseModals.forEach(btn => btn.addEventListener('click', closeModal));
overlay.addEventListener('click', closeModal);

// Close modals on 'Escape' key press
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////
// Sliders

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
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
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
