// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/member/home');
});

router.get('/home', (req, res, next) => {
    res.render('member/home', {
        std: res.resJson
    });
});

router.get('/superheroes', (req, res, next) => {
    res.render('member/superhero.ejs', {
        std: res.resJson
    });
});

router.get('/superheroes/search', (req, res, next) => {
    res.render('member/search-superheroes', {
        std: res.resJson
    });
});

// The router is exported.
module.exports = router;