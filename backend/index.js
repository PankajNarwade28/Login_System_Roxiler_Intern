const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors()); // Allows frontend access
app.use(express.json());
const userRoutes = require('./routes/userRoutes');
const { verifyToken, checkRole } = require('./middleware/auth');
const dotenv = require('dotenv');
dotenv.config();
const PORT= process.env.PORT;

app.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
    res.send('Welcome Admin');
});

// Routes
app.use('/api/users', userRoutes);

app.get('/test',(req, res) => {
    res.send('Test route accessible to all');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: "This message is from Backend... !" });
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/test`);
});