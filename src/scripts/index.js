'use strict';

///////////////////////////////////////
// Firebase

// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// import {getFirestore, doc, setDoc} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC7MIWUoNHq_UX8Bg3hskqerJBZlBlqZJ8',
  authDomain: 'tripeux-b3873.firebaseapp.com',
  projectId: 'tripeux-b3873',
  storageBucket: 'tripeux-b3873.firebasestorage.app',
  messagingSenderId: '645776349175',
  appId: '1:645776349175:web:f01b73b1143e1df05300f2',
  measurementId: 'G-9PWXJ42NBV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// init services
// const db = getFirestore();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
  ///////////////////////////////////////
  // Login effect
  const login = function () {
    window.location.href = '/src/pages/user.html';
  };

  ///////////////////////////////////////
  // subscribing to auth changes
  const unsubAuth = onAuthStateChanged(auth, user => {
    // Check if the user is logged in
    if (user) {
      ///////////////////////////////////////
      // Update UI

      // Add profile nav element in home when logged in
      const navLinks = document.querySelector(`#nav-profile`);
      if (navLinks) navLinks.classList.remove('hidden');

      // Replace login btn
      const btnNav = document.querySelector(`.nav__link--btn`);
      btnNav.textContent = 'Se déconnecter';
      btnNav.setAttribute('data-modal', 'logout');

      // Update the section header with the username
      const userameDisplayElement = document.querySelector('#userDisplayName');
      if (userameDisplayElement) {
        userameDisplayElement.textContent = user.displayName;
      }
    } else {
      console.log('User is signed out');
      if (window.location.pathname !== '/dist/index.html') {
        window.location.href = '/dist/index.html'; // Redirect to login page
      }
    }
  });

  ///////////////////////////////////////
  // unsubscribing from changes (auth & db)
  const unsubButton = document.querySelector('.unsub');
  unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');
    unsubAuth();
  });

  ///////////////////////////////////////
  // signing users up
  const signupForm = document.querySelector('#signup');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();

      const username = document.querySelector('#username').value;
      const email = document.querySelector('#email-signup').value;
      const password = document.querySelector('#password-signup').value;

      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Update the user profile w/ username
          const user = userCredential.user;
          return updateProfile(user, {
            displayName: username,
          });
        })
        .then(() => {
          login();
        })
        .then(() => {
          console.log('user created');
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  }

  ///////////////////////////////////////
  // logging in
  const loginForm = document.querySelector('#login');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = document.querySelector('#email-login').value;
      const password = document.querySelector('#password-login').value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log('user logged in');
          login();
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  }

  ///////////////////////////////////////
  // logging out
  const logoutButton = document.querySelector('.btn-logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          console.log('user logged out');
          window.location.href = '/dist/index.html';
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  }
});
