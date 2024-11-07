'use strict';

///////////////////////////////////////
// Firebase

// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getFirestore, doc, setDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll} from 'firebase/storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDd61QH01I57mKYj86gXOJG7Irzn4QRQt8',
  authDomain: 'les-tripeux-f7bba.firebaseapp.com',
  projectId: 'les-tripeux-f7bba',
  storageBucket: 'les-tripeux-f7bba.firebasestorage.app',
  messagingSenderId: '410851617284',
  appId: '1:410851617284:web:9629fbbe1120eac5ee6351',
  measurementId: 'G-6S9XCLKRLT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
  ///////////////////////////////////////
  // Persistence
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      const email = document.querySelector('#email-login').value;
      const password = document.querySelector('#password-login').value;

      return signInWithEmailAndPassword(auth, email, password);
    })
    .catch(error => {
      console.error('Persistence error:', error.message);
    });

  ///////////////////////////////////////
  // subscribing to auth changes
  const unsubAuth = onAuthStateChanged(auth, user => {
    // Check if the user is logged in
    if (user) {
      ///////////////////////////////////////
      // Update UI

      // Add profile nav element in home when logged in
      const navLinks = document.querySelector(`#nav-profile`);
      if (navLinks && window.location.pathname.endsWith('/index.html')) navLinks.classList.remove('hidden');

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
      if (window.location.pathname !== '/JekyllTRIpeux/index.html') {
        window.location.href = '/JekyllTRIpeux/index.html'; // Redirect to login page
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
  // signing up
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
          window.location.href = '/JekyllTRIpeux/src/pages/user.html';
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
  // logging out
  const logoutButton = document.querySelector('.btn-logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          console.log('user logged out');
          window.location.href = '/JekyllTRIpeux/index.html';
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  }

  ///////////////////////////////////////
  // Storage
  ///////////////////////////////////////
  // Upload
  const fileInput = document.getElementById('imageInput');
  const uploadButton = document.getElementById('uploadButton');
  uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0]; // Get the selected file
    if (file) {
      const storageRef = ref(storage, 'uploads/' + file.name); // Create a reference to the file location

      // Upload the file
      uploadBytes(storageRef, file)
        .then(snapshot => {
          console.log('File uploaded successfully!');
          getDownloadURL(snapshot.ref).then(downloadURL => {
            console.log('File available at: ' + downloadURL); // Get the file URL
          });
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    }
  });

  ///////////////////////////////////////
  // Download & Delete
  const fileRef = ref(storage, 'uploads/your-file-name'); // Reference to the file
  getDownloadURL(fileRef)
    .then(url => {
      console.log('File available at:', url);
      // You can now use this URL to display the file, like in an <img> tag
      document.getElementById('myImage').src = url; // Example for image
    })
    .catch(error => {
      console.error('Error downloading file:', error);
    });

  deleteObject(fileRef)
    .then(() => {
      console.log('File deleted successfully!');
    })
    .catch(error => {
      console.error('Error deleting file:', error);
    });

  ///////////////////////////////////////
  // List files
  const folderRef = ref(storage, 'uploads/');
  listAll(folderRef)
    .then(res => {
      res.items.forEach(itemRef => {
        console.log(itemRef.fullPath); // Log each file's path
      });
    })
    .catch(error => {
      console.error('Error listing files:', error);
    });
});
