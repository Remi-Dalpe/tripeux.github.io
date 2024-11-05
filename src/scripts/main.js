'use strict';

///////////////////////////////////////
// Firebase

const firebaseConfig = {
  apiKey: 'AIzaSyDeQ4o_cOvSTnw-0zpDahOU8-kg9XLC7sI',
  authDomain: 'les-tripeux.firebaseapp.com',
  projectId: 'les-tripeux',
  storageBucket: 'les-tripeux.firebasestorage.app',
  messagingSenderId: '837399057365',
  appId: '1:837399057365:web:9b3e0bbcaa935b9ab3e35c',
  measurementId: 'G-4B209CSTS5',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  // FullCalendar configuration
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',

    events: function (fetchInfo, successCallback, failureCallback) {
      const user = firebase.auth().currentUser;
      if (user) {
        db.collection('events')
          .where('userId', '==', user.uid)
          .get()
          .then(querySnapshot => {
            const events = [];
            querySnapshot.forEach(doc => {
              events.push(doc.data());
            });
            successCallback(events);
          })
          .catch(error => failureCallback(error));
      } else {
        successCallback([]); // No events if not authenticated
      }
    },
    eventClick: function (info) {
      alert('Event: ' + info.event.title);
      info.jsEvent.preventDefault(); // Prevent browser from following the link
    },
  });

  // Render the calendar
  calendar.render();

  // Firebase authentication state observer
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User is signed in:', user);
      calendar.refetchEvents(); // Refetch events when user signs in
    } else {
      console.log('No user is signed in.');
      calendar.removeAllEvents(); // Clear events when user signs out
    }
  });

  // Example sign-in (Replace with your own sign-in logic)
  auth.signInAnonymously().catch(error => {
    console.error('Error signing in:', error);
  });
});

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
