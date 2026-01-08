const db = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
 
// LOGIN API
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate Token with Role for access control [cite: 9]
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

 // SIGNUP API
const signupUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    // Validation: Name (20-60 chars) [cite: 63]
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: "Name must be between 20 and 60 characters." });
    }

    // Validation: Password (8-16 chars, Uppercase, Special Char) [cite: 65, 66]
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Password must be 8-16 chars, include one uppercase and one special character." 
        });
    }

    // Validation: Address (Max 400 chars) [cite: 64]
    if (address.length > 400) {
        return res.status(400).json({ message: "Address cannot exceed 400 characters." });
    }

    try {
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Standard users sign up; Admin adds others [cite: 10, 17]
        const userRole = role || 'Normal User'; 
        
        await db.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, userRole]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE PASSWORD API
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Extracted from verifyToken middleware

    // 1. Requirement Validation: Password Complexity (8-16 chars, Upper, Special)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ 
            message: "New password must be 8-16 chars, include one uppercase and one special character." 
        });
    }

    try {
        // 2. Fetch current user from database
        const [rows] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rows[0];

        // 3. Compare Old Password with stored hash
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        // 4. Hash the New Password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 5. Update the Database
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// MUST export them all at once like this:
module.exports = { 
    getUsers, 
    loginUser, 
    signupUser ,
    updatePassword
};