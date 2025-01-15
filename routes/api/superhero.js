// Inports the required libraries and other files.
const express = require('express');
const router = express.Router();

// Imports the sub-routing file
const topSuperheroRoutes = require('./top-superheroes.js');

// Catches get requests without further routes (/api/member/superheroes)
router.get('/', (req, res, next) => {
    // Loads the database and reqQue class instances into variables
    const database = req.app.locals.database;
    const reqQue = req.app.locals.reqQue;
    // Tests that an id was provided, terminating the request with an error message if not
    if (!req.query.id) {
        res.resJson.errors.push('No Superhero ID Specified');
        return res.status(400).json(res.resJson);
    }
    // Adds a request to the queue
    const request = reqQue.addReqs([() => {
        return fetch(`https://www.superheroapi.com/api.php/${process.env.ACCESS_TOKEN}/${req.query.id}`)
    }]);

    // Groups the two promises
    Promise.all([
        // Superhero API request
        request.wait.then(res => res[0].json()).then(data => {
            // Reformats the response, checking for an error
            if (data.response !== 'success') throw Error(data.error);
            delete data.response
            return data;
        }),
        // Database query
        database.getForumPosts(req.query.id)
    ]).then(data => {
        // Updates the response JSON and sends it
        res.resJson.success = true;
        res.resJson.data = {
            ...data[0],
            forum: data[1]
        };
        res.status(200).json(res.resJson);
        // Increments the superhero popularity
        database.incSuperheroPop(req.query.id).catch(console.log);
    })
    .catch(err => {
        // Returns an error message if any error is caught
        res.resJson.errors.push('An Unexpected Error Occured While Trying to Fetch That Superhero');
        res.status(500).json(res.resJson);
    });
});

// Passes requests through the top superhero routes
router.use('/', topSuperheroRoutes);

// Catches all requests to search for a superhero
router.get('/search', (req, res, next) => {
    // Loads the request queue into a variable
    const reqQue = req.app.locals.reqQue;
    // Terminates the request and sends an error if no search term is provided
    if (!req.query.term) {
        res.resJson.errors.push('No Seach Term Specified');
        return res.status(400).json(res.resJson);
    }
    // Adds the Superhero API request to the queue
    const request = reqQue.addReqs([() => {
        return fetch(`https://www.superheroapi.com/api.php/${process.env.ACCESS_TOKEN}/search/${req.query.term}`)
    }]);
    // Waits for the request to execute
    request.wait.then(res => res[0].json())
    .then(data => {
        // Throws an error if the response is not successful
        if (data.response !== 'success') throw Error(data.error);
        // Updates the response JSON and sends it back
        res.resJson.success = true;
        res.resJson.data = data.results;
        res.status(200).json(res.resJson);
    })
    .catch(err => {
        // Returns an error message if any errors are caught
        res.resJson.errors.push('An Unexpected Error Occured While Trying to Search For That Superhero');
        res.status(500).json(res.resJson);
    });
});

// The router is exported.
module.exports = router;