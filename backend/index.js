process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS configuration to allow Netlify frontend
app.use(cors({
  origin: "https://beautiful-caramel-d6ee9a.netlify.app",
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/photos', require('./routes/photos'));

// Start server
app.listen(port, () => {
  console.log(`iPhotos listening at http://localhost:${port}`);
});
