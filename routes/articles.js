// pull in express library
const express = require('express');
const router = express.Router();
// including model for article
const Article = require('../models/article');
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


// get articles
router.get('/', authenticateToken, async (req, res) => {
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
router.post('/', async (req, res) => {

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
})

// update article
router.patch('/:id', getArticle, async (req, res) => {
    //check if body is not empty
    if (req.body.title != null) {
        res.cat.title = req.body.title;
    }
    if (req.body.content != null) {
        res.cat.content = req.body.content;
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
        await res.article.deleteOne();
        res.json({ message: "Artikel raderad" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// middleware function (getting id)
async function getArticle(req, res, next) {
    try {
        const article = await Article.findById(req.params.id);

        // if cat doesn't exist
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