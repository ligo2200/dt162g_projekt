// pull in express library
const express = require('express');
const router = express.Router();
// including model for cat
const Cat = require('../models/cat');
// jwt
const jwt = require('jsonwebtoken');
// multer for uploading files
const multer = require('multer');
const upload = require('../multerConfig');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const path = require('path');
// to sanitize input
const sanitizeHtml = require('sanitize-html');

"use strict";

const authenticateToken = (req, res, next) => {
    // Authorization header requested from client
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Åtkomst nekad. Ingen token tillgänglig.' });
    }

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

        const catsWithImage = cats.map(cat => {
            const imageUrl = cat.image;

            return {
                _id: cat._id,
                name: cat.name,
                breed: cat.breed,
                birth: cat.birth,
                color: cat.color,
                description: cat.description,
                image: imageUrl,
            };
        });

        res.json(catsWithImage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get cats registrered by user
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        const cats = await Cat.find({ userId: req.params.userId });
        res.json(cats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get cat by id
router.get('/:id', getCat, async (req, res) => {

    try {
        console.log("Kattobjekt:", res.cat);
        res.status(200).json(res.cat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


// Get cat by name
router.get('/name/:name', async (req, res) => {
    const catName = req.params.name;
    try {
        const cat = await Cat.findOne({ name: catName });
        if (!cat) {
            return res.status(404).json({ message: "Katten hittades inte." });
        }
        res.status(200).json(cat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// create cat
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {

    try {
        let imagePath = null;

        if (req.file) {
            const { filename } = req.file;
            imagePath = filename;
        }


        const cat = new Cat({
            name: req.body.name,
            breed: req.body.breed,
            birth: req.body.birth,
            color: req.body.color,
            description: req.body.description,
            // Include image path in catobject
            image: imagePath,
            // include which user created cat
            userId: req.user.userId
        });

        // sanitize inputdata before saving
        cat.name = sanitizeHtml(req.body.name);
        cat.breed = sanitizeHtml(req.body.breed);
        cat.color = sanitizeHtml(req.body.color);
        cat.description = sanitizeHtml(req.body.description);

        // Save new cat in database
        const newCat = await cat.save();

        res.status(201).json(newCat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update cat
router.patch('/:id', getCat, upload.single('image'), async (req, res) => {

    try {

        //get cat from database
        const cat = await Cat.findById(req.params.id);
        if (!cat) {
            return res.status(404).json({ message: "Kan inte hitta katt" });
        }

        //check if body is not empty
        if (req.body.name != null) {
            res.cat.name = req.body.name;
        }
        if (req.body.breed != null) {
            res.cat.breed = req.body.breed;
        }
        if (req.body.birth != null) {
            res.cat.birth = req.body.birth;
        }
        if (req.body.color != null) {
            res.cat.color = req.body.color;
        }
        if (req.body.description != null) {
            res.cat.description = req.body.description;
        }


        //check if there is an uploaded image
        if (req.file) {

            res.cat.image = req.file.filename;
        }

        // sanitize inputdata before saving
        res.cat.name = sanitizeHtml(req.body.name);
        res.cat.breed = sanitizeHtml(req.body.breed);
        res.cat.color = sanitizeHtml(req.body.color);
        res.cat.description = sanitizeHtml(req.body.description);

        //saving updated cat
        const updatedCat = await res.cat.save();

        res.json(updatedCat);
    } catch (err) {
        console.error("Fel vid uppdatering av katten:", err);
        res.status(500).json({ message: "Ett internt fel uppstod vid uppdatering av katten." });
    }
});

// deleting cat
router.delete('/:id', getCat, async (req, res) => {

    try {

        //erase cat from database
        await Cat.findByIdAndDelete(req.params.id);

        if (res.cat.image) {

            // path to image
            const imagePath = path.join(__dirname, '..', 'uploads', res.cat.image);

            //remove imagefile from filesystem (uploads)
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Kunde inte ta bort bildfilen:", err);
                    return res.status(500).json({ message: "Kunde inte ta bort bildfilen" });
                }
                console.log("Bildfilen har tagits bort");
            });
        }


        res.status(200).json({ message: "Katt raderad" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

module.exports = router;