// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();
const auth = require('../../models/auth.js');


// Catches all get requests for the login page, passing them first through the JWT authentication function.
router.get('/login', auth.authenticateToken, (req, res, next) => {
    // Tests if the current response code is 200, meaning that it has already been validated as a logged on user.
    if (res.statusCode == 200) {
        // If the user is already logged in, they are redirected to the member home page.
        res.redirect('/member/home');
    } else {
        // If the user is not logged in, the status is corrected to 200 and the login page rendered.
        res.status(200).render('login', {
            std: res.resJson
        });
    }
});

// The router is exported.
module.exports = router;