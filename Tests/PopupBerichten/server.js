const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit-form', (req, res) => {
  console.log(req.body);
  res.send(`Form received! You entered: ${req.body.inputField}`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));