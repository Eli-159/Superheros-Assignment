// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();
const auth = require('../../models/auth.js');

const authRoutes = require('./auth.js');
const memberRoutes = require('./member.js');

router.use('/auth', authRoutes);
router.use('/member', memberRoutes);

router.get('/', (req, res, next) => {
    res.redirect('/home');
});

router.get('/home', (req, res, next) => {
    if (req.payload && req.payload.user) {
        return res.redirect('/member/home')
    }
    res.render('./home', {
        std: res.resJson
    });
    console.log(req.originalUrl)
});

router.use('/', (req, res, next) => {
    res.status(404).render('errors/404', {
        std: res.resJson
    });
})

// The router is exported.
module.exports = router;