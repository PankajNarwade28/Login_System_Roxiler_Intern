const jwt = require('jsonwebtoken');

// Middleware to check if user is logged in
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user payload (id, role) to request [cite: 9]
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Middleware to check specific roles (e.g., Admin only)
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'System Administrator') {
        return res.status(403).json({ message: "Require Admin Role!" });
    }
    next();
};

// Ensure this is a function returning a middleware
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Unauthorized Role" });
        }
        next();
    };
};

module.exports = { verifyToken, isAdmin, checkRole };