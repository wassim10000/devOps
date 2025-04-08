const express = require('express');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const verifyJWT = require('./middlewares/auth');

dotenv.config();
const app = express();

// Routes publiques (auth, register)
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true
}));

// Routes protégées
app.use('/api/salles', verifyJWT, createProxyMiddleware({
  target: process.env.SALLE_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/reservations', verifyJWT, createProxyMiddleware({
  target: process.env.RESERVATION_SERVICE_URL,
  changeOrigin: true
}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
