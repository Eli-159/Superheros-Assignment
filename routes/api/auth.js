// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../models/auth.js');

// Catches all login submits.
router.post('/login', (req, res, next) => {
    const database = res.app.locals.database;
    if (!req.body.email || !req.body.password) return res.status(400).json()
    database.getUser(decodeURIComponent(req.body.email)).then(user => {
        if (!user) {
            res.resJson.errors.push('No user could be found with that email address.');
            return res.status(401).json(res.resJson);
        }
        bcrypt.compare(req.body.password, user.password).then(match => {
            if (match === true) {
                res.cookie('jwt', auth.generateToken({
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        joinDate: user.joinDate
                    }
                }));
                res.resJson.success = true;
                res.resJson.redirect.set = true;
                res.resJson.redirect.url = '/member/home';
                return res.status(200).json(res.resJson);
            } else {
                res.resJson.errors.push('Incorrect Password. Please try again.');
                return res.status(401).json(res.resJson);
            }
        }).catch((err) => {
            console.log(err)
            res.resJson.errors.push('Sorry, an error occured while trying to validate your password.');
            return res.status(500).json(res.resJson);
        });
    }).catch((err) => {
        res.resJson.errors.push('Sorry, an error occured while trying to find your account.');
        return res.status(500).json(res.resJson);
    });
});

// Catches all requests to logout.
router.get('/logout', (req, res, next) => {
    // Clears the jwt cookie from the response.
    res.clearCookie('jwt', {path: '/'});
    // Redirects the user to the home page.
    res.redirect('/home');
});

// The router is exported.
module.exports = router;