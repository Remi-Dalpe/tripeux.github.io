'use strict';
/////////////////////////////////////////////////
////////////////////////////////////////////////
// Performances ////////////////////////////////
////////////////////////////////////////////////
// Lazy Loading Images

// Selection of all images w/ date-src attribute
const imgTargets = document.querySelectorAll(`img[data-src]`);

// Function to load image when it enters the viewport
const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    // Remove blur effect after the image is loaded
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    // Stop observing the image as it's already loaded
    observer.unobserve(entry.target);
  });
};

// Creation of an IntersectionObserver instance
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: [0.1, 0.5, 1.0], // Array of thresholds for better responsiveness
  rootMargin: '500px', // Load images earlier before they enter the viewport
});

// Observe each image target
imgTargets.forEach(img => imgObserver.observe(img));

// Fallback for browsers without IntersectionObserver support
if (!('IntersectionObserver' in window)) {
  imgTargets.forEach(img => {
    // Replace src with data-src
    img.src = img.dataset.src;

    // Remove blur effect after the image is loaded
    img.addEventListener('load', function () {
      img.classList.remove('lazy-img');
    });
  });
}
