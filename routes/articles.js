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
// to sanitize input
const sanitizeHtml = require('sanitize-html');


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

//get articles registrered by user
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        const articles = await Article.find({ userId: req.params.userId });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// get article by id
router.get('/:id', getArticle, (req, res) => {
    res.send(res.article);

});

//create article
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {

    try {
        let imagePath = null;

        if (req.file) {
            const { filename } = req.file;
            imagePath = filename;
        }

        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            // Include image path in catobject
            image: imagePath,
            // include which user created cat
            userId: req.user.userId
        });

        // sanitize inputdata before saving
        article.title = sanitizeHtml(req.body.title);
        article.content = sanitizeHtml(req.body.content);

        // Save new article in database
        const newArticle = await article.save();

        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update article
router.patch('/:id', authenticateToken, getArticle, upload.single('image'), async (req, res) => {

    try {
        //get article from database
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Kan inte hitta artikel" });
        }
        //check if body is not empty
        if (req.body.title != null) {
            res.article.title = req.body.title;
        }
        if (req.body.content != null) {
            res.article.content = req.body.content;
        }

        //check if there is an uploaded image
        if (req.file) {

            res.article.image = req.file.filename;
        }

        // sanitize inputdata before saving
        res.article.title = sanitizeHtml(req.body.title);
        res.article.content = sanitizeHtml(req.body.content);

        // saving updated article
        const updatedArticle = await res.article.save();
        //sending response as json
        res.json(updatedArticle);
    } catch (err) {
        console.error("Fel vid uppdatering av artikeln:", err);
        res.status(500).json({ message: "Ett internt fel uppstod vid uppdatering av artikeln." });
    }

});

// deleting article
router.delete('/:id', authenticateToken, getArticle, async (req, res) => {

    try {
        // check if article exists
        if (!res.article) {
            return res.status(404).json({ message: "Kan inte hitta artikeln" });
        }

        //erase article from database
        await res.article.deleteOne();

        if (res.article.image) {
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

module.exports = router;