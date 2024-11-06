'use strict';

const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'dist', 'bundle.js');
const destPath = path.join(__dirname, 'docs', 'bundle.js');

// Ensure the file exists before copying
fs.copyFile(sourcePath, destPath, err => {
  if (err) {
    console.error('Error copying bundle.js:', err);
  } else {
    console.log('bundle.js copied to /docs/');
  }
});
