// pulling in librarys 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');

const debug = require('debug')('app:server'); // Ange det namespace som passar din applikation, till exempel 'app:server'



// expressfunction put in variable app
const app = express();

app.use('/uploads', express.static('uploads'));


//connecting mongoose to mongodb
mongoose.connect(process.env.DATABASE_URL);
//connection put in variable db
const db = mongoose.connection;


// logging errors
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


// allow use of json
app.use(express.json());

// Only allow requests from http://localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // allow credentials (i.e. cookies, authentication)
};

// enable cors
app.use(cors(corsOptions));



/*
// combining express with react
app.use(express.static(path.join(__dirname, 'client', 'build')));

// requests directed to react
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
*/


// route setup
const catsRouter = require('./routes/cats');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
// app use router
app.use('/cats', catsRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);


// listening to port 3000
app.listen(3000, () => {
  console.log('Server Started');
  debug('servern lyssnar på port 3000');
});