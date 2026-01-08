const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors()); // Allows frontend access
app.use(express.json()); 

const { verifyToken, checkRole } = require('./middleware/auth');
const dotenv = require('dotenv');
dotenv.config();
const PORT= process.env.PORT;
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
const ownerRoutes = require('./routes/ownerRoutes');
app.use('/api/owner', ownerRoutes);
// Import and use your store routes
const storeRoutes = require('./routes/storeRoutes');
app.use('/api/stores', storeRoutes);

app.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
    res.send('Welcome Admin');
});
 

app.get('/test',(req, res) => {
    res.send('Test route accessible to all');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: "This message is from Backend... !" });
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/test`);
});