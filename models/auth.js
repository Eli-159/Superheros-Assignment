const jwt = require('jsonwebtoken');

module.exports.authenticateToken = function (req, res, next) {
    // Gather the jwt access token from the request header
    let token = req.cookies.jwt;
    if (!token) {
      res.status(401); // if there isn't any token
      next();
      return;
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          res.status(403);
          return next();
        }
        req.payload = payload;
        res.status(200);
        next(); // pass the execution off to whatever request the client intended
      });
    } catch(e) {
      res.status(403);
      return next();
    }
  }

  module.exports.generateToken = function (payload) {
    if (payload.hasOwnProperty('exp')) {
      delete payload.exp;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: (process.env.JWT_EXPIRY)});
  }