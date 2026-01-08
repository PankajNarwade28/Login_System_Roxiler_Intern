const db = require('../config/db');

const getUsers = async (req, res) => {
    try {
        // Extract query parameters for sorting and filtering 
        const { sortBy = 'name', order = 'ASC', role, name } = req.query;
        
        let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
        const params = [];

        // Apply filters 
        if (role) {
            query += " AND role = ?";
            params.push(role);
        }
        if (name) {
            query += " AND name LIKE ?";
            params.push(`%${name}%`);
        }

        // Apply sorting 
        query += ` ORDER BY ${sortBy} ${order}`;

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers };