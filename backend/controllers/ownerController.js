const db = require('../config/db');
// controllers/ownerController.js
const getMyStoreData = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [storeInfo] = await db.execute(`
            SELECT 
                s.id, s.name, 
                CAST(COALESCE(AVG(r.rating_value), 0) AS DECIMAL(10,1)) as averageRating,
                COUNT(r.id) as ratingsCount
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = ?
            GROUP BY s.id
        `, [ownerId]);

        if (storeInfo.length === 0) {
            return res.status(404).json({ message: "No store found for this owner." });
        }

        // REMOVED r.created_at because the column does not exist in your table
        const [feedbacks] = await db.execute(`
            SELECT 
                u.name as userName, 
                r.rating_value as rating
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
        `, [storeInfo[0].id]);

        res.json({
            name: storeInfo[0].name,
            averageRating: parseFloat(storeInfo[0].averageRating || 0),
            ratingsCount: storeInfo[0].ratingsCount || 0,
            feedbacks: feedbacks || []
        });
    } catch (error) {
        console.error("Owner Dash Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getMyStoreData };