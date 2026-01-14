// Simple helper to set up socket handlers

const jwt = require('jsonwebtoken');

function setupSocket(io) {
  io.on('connection', (socket) => {
    try {
      // Try auth.token (explicit), then query, then cookies
      let token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        const cookieHeader = socket.handshake.headers?.cookie;
        if (cookieHeader) {
          const match = cookieHeader.split(';').map(s=>s.trim()).find(s=>s.startsWith('token='));
          if (match) token = match.split('=')[1];
        }
      }

      if (!token) {
        // disconnect unauthorized sockets to avoid idle anonymous connections
        try { socket.disconnect(true); } catch (e) {}
        return;
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;
      socket.join(userId);
      // also join a global room for broadcast if desired
      socket.join('global');

      socket.on('disconnect', () => {});
    } catch (err) {
      // ignore invalid tokens
    }
  });
}

module.exports = setupSocket;
