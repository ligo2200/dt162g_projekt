// pulling in librarys 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');


// expressfunction put in variable app
const app = express();


//connecting mongoose to mongodb
mongoose.connect(process.env.DATABASE_URL);
//connection put in variable db
const db = mongoose.connection;


// logging errors
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


// allow use of json
app.use(express.json());

// enable cors
app.use(cors());

// combining express with react
app.use(express.static(path.join(__dirname, 'client', 'build')));

// requests directed to react
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


// route setup
const catsRouter = require('./routes/cats');
const usersRouter = require('./routes/users');
// app use router
app.use('/cats', catsRouter);
app.use('/users', usersRouter);


// listening to port 3000
app.listen(3000, () => console.log('Server Started'));