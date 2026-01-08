const db = require('../config/db');

// 1. Fetch System Stats
const getStats = async (req, res) => {
    try {
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [storeCount] = await db.execute('SELECT COUNT(*) as count FROM stores');
        const [ratingCount] = await db.execute('SELECT COUNT(*) as count FROM ratings');

        res.json({
            users: userCount[0].count,
            stores: storeCount[0].count,
            ratings: ratingCount[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Fetch User Listings (Name, Email, Address, Role)
// adminController.js
const getAllUsers = async (req, res) => {
    try {
        // Double check that 'role' is included in the SELECT statement
        const [users] = await db.execute(
            'SELECT id, name, email, address, role FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Fetch Store Listings (Name, Owner Email, Address, Rating)
const getAllStores = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id, 
                s.name, 
                s.address, 
                u.email as owner_email,
                CAST(COALESCE(AVG(r.rating_value), 0) AS DECIMAL(10,1)) as overallRating
            FROM stores s
            JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
        `;
        const [stores] = await db.execute(query);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/adminController.js
const createStore = async (req, res) => {
    const { name, address, ownerId } = req.body;
    try {
        // Insert new store linked to the selected Owner ID
        const [result] = await db.execute(
            'INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)',
            [name, address, ownerId]
        );
        res.status(201).json({ message: "Store created", storeId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 

module.exports = { getStats, getAllUsers, getAllStores , createStore};