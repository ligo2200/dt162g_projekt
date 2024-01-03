"use strict";

// pull in express library
const express = require('express');
const router = express.Router();

// including model for user
const User = require('../models/user');

//use controller
const userController = require('../controllers/userController');


// get users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});


// get user by id
router.get('/:id', getUser, (req, res) => {
    res.send(res.user);

});


// create user
router.post('/', async (req, res) => {
    try {
      const { user, token } = await userController.createUser(req.body);
      res.status(201).json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  
  // login user
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const { user, token } = await userController.loginUser(username, password);
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });


// update course
router.patch('/:id', getUser, async (req, res) => {
    //check if body is not empty
    if (req.body.first_name != null) {
        res.user.first_name = req.body.first_name;
    }
    if (req.body.last_name != null) {
        res.user.last_name = req.body.last_name;
    }
    if (req.body.username != null) {
        res.user.username = req.body.username;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});


// deleting user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        res.json({ message: "Användare raderad" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// middleware function (getting id)
async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id);

        // if course doesn't exist
        if (user == null) {
            return res.status(404).json({ message: "Kan inte hitta användare" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;