require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const setupSocket = require('./socket');

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }
});

setupSocket(io);
app.set('io', io);

const path = require('path');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Connect DB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/gigflow');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gigs', require('./routes/gigs'));
app.use('/api/bids', require('./routes/bids'));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve frontend static files in production if present
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public')
  app.use(express.static(publicPath))

  // For client-side routing, serve index.html for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(publicPath, 'index.html'))
  })
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
