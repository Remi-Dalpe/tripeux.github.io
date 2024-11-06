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
