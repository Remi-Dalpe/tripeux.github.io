'use strict';

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
  const [entry] = entries;

  // Check if the image is visible
  if (!entry || !entry.isIntersecting) return;

  // Replace the src w/ the data-src
  entry.target.src = entry.target.dataset.src;

  // Removal of blur effect
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Stop observing the image as it's loaded already
  observer.unobserve(entry.target);
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
