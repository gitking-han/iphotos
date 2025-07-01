const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const app = express();
const port = process.env.PORT || 5000;

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// ✅ Connect Mongo
connectToMongo();

// ✅ Correct and complete CORS setup
const allowedOrigins = [
  'https://teal-buttercream-3caf29.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight OPTIONS request (important!)
app.options('*', cors());

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/photos', require('./routes/photos'));

// ✅ Start server
app.listen(port, () => {
  console.log(`iPhotos listening at http://localhost:${port}`);
});
