/**
 * SERVER ENTRY POINT
 * Configuración principal de Express, middleware y conexión a BD.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la Base de Datos
connectDB();

// Middlewares Esenciales
app.use(cors()); // Habilita CORS para permitir peticiones del frontend
app.use(express.json()); // Parsea bodies JSON
app.use(express.urlencoded({ extended: true })); // Parsea bodies URL-encoded

// Rutas
app.use('/api/contact', contactRoutes);

// Health Check (útil para monitoreo en Render/Railway)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Manejo de errores global (Basic)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});