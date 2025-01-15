// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.js');
const superheroRoutes = require('./superhero.js');
const topSuperheroRoutes = require('./top-superheroes.js');

router.use('/auth', authRoutes);
router.use('/member/superheroes', superheroRoutes);
router.use('/superheroes', topSuperheroRoutes);

router.use('/', (req, res, next) => {
    res.resJson.errors = '404 - That Resource Does Not Exist';
    res.status(404).json(res.resJson);
})

// The router is exported.
module.exports = router;