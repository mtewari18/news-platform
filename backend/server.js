require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newsapp';

connectDB(MONGO_URI);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.send('News API is running'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
