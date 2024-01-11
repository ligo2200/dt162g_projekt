"use strict";

// pull in express library
const express = require('express');
const router = express.Router();

// including model for user
const User = require('../models/user');

//use controller
const userController = require('../controllers/userController');
const user = require('../models/user');

//encoding password
const bcrypt = require('bcrypt');
const saltRounds = 10;


// get users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// get user by id
router.get('/:id', getUser, async (req, res) => {

    try {

        // return response
        res.json(res.user);
    } catch (err) {
        // return error message
        res.status(500).json({ message: err.message });
    }
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


// update user
router.put('/:id', getUser, async (req, res) => {
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
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        res.user.password = hashedPassword;
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
        //delete user
        await user.deleteOne();
        res.json({ message: "Användare raderad" });
    } catch (err) {
        // error message
        res.status(500).json({ message: err.message });
    }
});


// middleware function (getting id)
async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);

        // if user doesn't exist
        if (user == null) {
            return res.status(404).json({ message: "Kan inte hitta användare" });
        }

        res.user = user;
        next();  
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports = router;