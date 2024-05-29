const { User } = require('../models');
const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Access denied. No token provided.'
            });
        }
        const decoded = await verifyToken(token);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token.'
            });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token.'
        });
    }
};

module.exports = authMiddleware;
