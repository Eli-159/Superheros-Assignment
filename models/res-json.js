module.exports.setResJson = (req, res, next) => {
    res.resJson = {
        success: false,
        errors: [],
        data: null,
        request: {
            url: req.originalUrl,
            id: parseInt(req.body.reqId ? req.body.reqId : (req.query.reqId ? req.query.reqId : undefined))
        },
        redirect: {
            set: false,
            url: null
        },
        user: {
            loggedIn: false,
            firstName: null,
            lastName: null,
            email: null,
            joinDate: null
        }
    };
    next();
};

module.exports.addUser = (req, res, next) => {
    if (!req.payload || !req.payload.user) return next();
    res.resJson.user = {
        loggedIn: true,
        firstName: req.payload.user.firstName,
        lastName: req.payload.user.lastName,
        email: req.payload.user.email,
        joinDate: req.payload.user.joinDate
    }
    next();
}