const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Access denied. You do not have the required permissions.' });
        }
        next();
    };
};

module.exports = roleMiddleware
