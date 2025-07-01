const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const app = express();
const port = process.env.PORT || 5000;

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

connectToMongo();

// ⚠️ Temporarily allow all CORS origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/photos', require('./routes/photos'));

app.listen(port, () => {
  console.log(`iPhotos listening at http://localhost:${port}`);
});
