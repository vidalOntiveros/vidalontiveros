const Message = require('../models/Message');

// @desc    Enviar mensaje de contacto
// @route   POST /api/contact
// @access  Public
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Guardar en Base de Datos
        const newMessage = await Message.create({ name, email, message });

        // Aquí iría la lógica de envío de Email (ej. Nodemailer o SendGrid)
        // Por ahora, simulamos el envío exitoso.
        // Ejemplo: await sendEmail({ to: process.env.ADMIN_EMAIL, subject: 'Nuevo Mensaje', body: message });

        res.status(201).json({ 
            success: true, 
            data: newMessage, 
            message: 'Mensaje recibido correctamente' 
        });

    } catch (error) {
        console.error(error);
        
        // Manejo de errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// @desc    Obtener mensajes (Para tu panel de admin futuro)
// @route   GET /api/contact
// @access  Private (Implementar autenticación en el futuro)
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};