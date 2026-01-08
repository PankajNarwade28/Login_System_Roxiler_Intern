// middleware/auth.js
const jwt = require('jsonwebtoken');

// Verify if token is valid
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("A token is required for authentication");
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // Contains id and role
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

// Check if user role matches the required role for the route
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send("Access Denied: Unauthorized Role");
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };