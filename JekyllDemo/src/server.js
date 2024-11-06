'use strict';

const express = require('express');
const path = require('path');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.render('index', {title: 'nav', body: 'nav.ejs'});
});

app.get('/user', (req, res) => {
  res.render('user', {title: 'User', body: 'user.ejs'});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
