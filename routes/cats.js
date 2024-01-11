// pull in express library
const express = require('express');
const router = express.Router();
// including model for course
const Cat = require('../models/cat');
// jwt
const jwt = require('jsonwebtoken');


"use strict";


const authenticateToken = (req, res, next) => {
    // Authorization header requested from client
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Åtkomst nekad. Ingen token tillgänglig.' });
    }

    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    // verifying token, if token is correct user has access to route
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Åtkomst nekad. Ogiltig token.' });
        }

        req.user = user;
        next();
    });
};


// get cats
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cats = await Cat.find();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get cat by id
router.get('/:id', getCat, (req, res) => {
    res.send(res.cat);

});

// create cat
router.post('/', async (req, res) => {

    const cat = new Cat({
        name: req.body.name,
        color: req.body.color,
        age: req.body.age,
        description: req.body.description
    });

    try {
        const newCat = await cat.save();
        res.status(201).json(newCat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// update cat
router.patch('/:id', getCat, async (req, res) => {
    //check if body is not empty
    if (req.body.name != null) {
        res.cat.name = req.body.name;
    }
    if (req.body.color != null) {
        res.cat.color = req.body.color;
    }
    if (req.body.age != null) {
        res.cat.age = req.body.age;
    }
    if (req.body.description != null) {
        res.cat.description = req.body.description;
    }

    try {
        const updatedCat = await res.cat.save();
        res.json(updatedCat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

// deleting cat
router.delete('/:id', getCat, async (req, res) => {
    try {
        await res.cat.deleteOne();
        res.json({ message: "Katt raderad" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// middleware function (getting id)
async function getCat(req, res, next) {
    try {
        const cat = await Cat.findById(req.params.id);

        // if cat doesn't exist
        if (cat == null) {
            return res.status(404).json({ message: "Kan inte hitta katten" });
        }

        res.cat = cat;
        next();

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
/*
// middleware function (locked route)
async function authenticateToken(req, res, next) {
    try {
        // Authorization header requested from client
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Åtkomst nekad. Ingen token tillgänglig.' });
        }
        // verifying token, if token is correct user has access to route
        const user = await jwt.verify(token, process.env.JWT_SECRET);


        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Åtkomst nekad. Ogiltig token.' });
    }
};*/

module.exports = router;