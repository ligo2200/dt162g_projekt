"use strict";

// pull in express library
const express = require('express');
const router = express.Router();
// including model for course
const User = require('../models/user');

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

// create course
router.post('/', async (req, res) => {
    
    const user = new User ({
        first_name: req.body.first_name, 
        last_name: req.body.last_name,
        username: req.body.username, 
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

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

// deleting course
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        res.json({ message: "Användare raderad" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

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