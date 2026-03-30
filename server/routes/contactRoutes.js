const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');

// Ruta pública para enviar mensajes
router.route('/').post(sendMessage);

module.exports = router;