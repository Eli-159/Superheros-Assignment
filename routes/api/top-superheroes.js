// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();

router.get('/top-:num', (req, res, next) => {
    const database = req.app.locals.database;
    const reqQue = req.app.locals.reqQue;

    if (req.originalUrl.includes('/member/')) {
        if (req.params.num > 50) {
            res.resJson.errors.push('Max Number of Top Superheroes is 50');
            return res.status(400).json(res.resJson);
        }
    } else if (req.params.num > 10) {
        res.resJson.errors.push('Unauthenticated Viewing of Top Superheroes is Limited to the Top 10');
        return res.status(400).json(res.resJson);
    }

    database.topSuperheroes(req.params.num).then(data => {
        const calls = [];
        data.forEach(superhero => {
            calls.push(() => {
                return fetch(`https://www.superheroapi.com/api.php/${process.env.ACCESS_TOKEN}/${superhero.id}`)
            });
        });
        return reqQue.addReqs(calls).wait;
    }).then(data => {
        return Promise.all(data.map(val => val.json().then((val) => {
            if (val.response !== 'success') throw Error(val.error);
            delete val.response
            return val;
        })));
    }).then(data => {
        res.resJson.success = true;
        res.resJson.data = data;
        res.status(200).json(res.resJson);
    }).catch(err => {
        console.log(err);
        res.resJson.errors.push('An Unexpected Error Occured While Trying to Find the Top Superheroes');
        res.status(500).json(res.resJson);
    });
});


// The router is exported.
module.exports = router;