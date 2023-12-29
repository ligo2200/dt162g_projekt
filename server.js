// pulling in librarys 
require('dotenv').config;
const express = require('express');
const mongoose = require('mongoose');


// expressfunction put in variable app
const app = express();


//connecting mongoose to mongodb
mongoose.connect('mongobd://localhost/catsite');
//connection put in variable db
const db = mongoose.connection;


// logging errors
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


// allow use of json
app.use(express.json());

// enable cors
app.use(cors());


// route setup
const catsRouter = require('./routes/cats');
const usersRouter = require('./routes/users');
// app use router
app.use('/cats', catsRouter);
app.use('/users', usersRouter);


// listening to port 3000
app.listen(3000, () => console.log('Server Started'));