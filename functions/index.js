'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Example Cloud Function
exports.addUser = functions.auth.user().onCreate(user => {
  const uid = user.uid;
  const email = user.email;

  return admin.firestore().collection('users').doc(uid).set({
    email: email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
