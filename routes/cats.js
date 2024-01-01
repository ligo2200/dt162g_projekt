// pull in express library
const express = require('express');
const router = express.Router();
// including model for course
const Cat = require('../models/cat');


"use strict";


// get cats
router.get('/', async (req, res) => {
    try {
        const cats = await Cat.find();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});

// get user by id
router.get('/:id', getCat, (req, res) => {
    res.send(res.cat);

});

// create course
router.post('/', async (req, res) => {
    
    const cat = new Cat ({
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

// update course
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

// deleting course
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
        cat = await Cat.findById(req.params.id);

        // if course doesn't exist
        if (cat == null) {
            return res.status(404).json({ message: "Kan inte hitta katten" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.cat = cat;
    next();
}

module.exports = router;