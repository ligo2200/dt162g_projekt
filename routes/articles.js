// pull in express library
const express = require('express');
const router = express.Router();
// including model for article
const Article = require('../models/article');
// jwt
const jwt = require('jsonwebtoken');
// multer for uploading files
const multer = require('multer');
const upload = require('../multerConfig');
const fs = require('fs');


"use strict";

//middleware for authentification with token
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


// get articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get article by id
router.get('/:id', getArticle, (req, res) => {
    res.send(res.article);

});

// create article
/*router.post('/', async (req, res) => {

    const article = new Article({
        title: req.body.title,
        content: req.body.content,
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});*/

//create article
router.post('/', upload.single('image'), async (req, res) => {

    try {
        const { filename, path, mimetype } = req.file;

        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            // include imageinformation in articleobject
            image: {
                filename: filename,
                path: path,
                mimetype: mimetype
            }
        });

        // Save new article in database
        const newArticle = await article.save();

        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update article
router.patch('/:id', getArticle, upload.single('image'), async (req, res) => {

    //check if body is not empty
    if (req.body.title != null) {
        res.article.title = req.body.title;
    }
    if (req.body.content != null) {
        res.article.content = req.body.content;
    }

    //check if there is an uploaded image
    if (req.file) {

        const imagePath = 'uploads/' + req.file.filename;

        res.article.image = {
            filename: req.file.filename,
            path: imagePath, 
            mimetype: req.file.mimetype
        };
    }

    try {
        const updatedArticle = await res.article.save();
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

// deleting article
router.delete('/:id', getArticle, async (req, res) => {
    try {
        // check if article exists
        if (!res.article) {
            return res.status(404).json({ message: "Kan inte hitta artikeln" });
        }

        // path to image
        const imagePath = res.article.image.path;

        //erase article from database
        await res.article.deleteOne();

        //remove imagefile from filesystem (uploads)
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Kunde inte ta bort bildfilen:", err);
                return res.status(500).json({ message: "Kunde inte ta bort bildfilen" });
            }
            console.log("Bildfilen har tagits bort");
        });

        res.json({ message: "Artikel raderad" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// middleware function (getting id)
async function getArticle(req, res, next) {
    try {
        const article = await Article.findById(req.params.id);

        // if article doesn't exist
        if (article == null) {
            return res.status(404).json({ message: "Kan inte hitta artikeln" });
        }

        res.article = article;
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