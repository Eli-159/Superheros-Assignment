// Inports the required libaries and other files.
const express = require('express');
const router = express.Router();
const auth = require('../models/auth.js');
const resJson = require('../models/res-json.js');


// All requests are first authenticated as JWTs and then passed into the function defined below.
router.use('/', resJson.setResJson, auth.authenticateToken, (req, res, next) => {
    // Tests if the request passes security requirements
    if (!req.originalUrl.includes('/member')) return next();
    if (res.statusCode == 200) return next();

    // Sets the appropriate error message.
    const errorMsg = {};
    if (res.statusCode == 401) {
        errorMsg.title = 'Unauthenticated';
        errorMsg.msg = 'You must be logged in to access this resource. Please log in or create an account and try again.'
    } else if (res.statusCode == 403) {
        errorMsg.title = 'Session Timeout';
        errorMsg.msg = 'It appears your session has timed out. Please log in again.';
    }

    // Sends the message in the appropriate way.
    if (req.originalUrl.includes('/api')) {
        res.resJson.errors.push(errorMsg.msg);
        res.json(res.resJson);
    } else {
        res.render('errors/std-err', {
            errTitle: errorMsg.title,
            errMsg: errorMsg.msg,
            std: res.resJson
        });
    }
}, resJson.addUser);

// The router is exported.
module.exports = router;