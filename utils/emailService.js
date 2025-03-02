const nodemailer = require("nodemailer");

const enviarCorreo = async (destinatario, asunto, mensaje) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"Gestor de Reservas" <noreply@gestorreservas.com>`,
            to: destinatario,
            subject: asunto,
            text: mensaje,
        });

        console.log("✅ Correo enviado (Mailtrap): ", info.messageId);
    } catch (error) {
        console.error("❌ Error al enviar el correo: ", error);
    }
};

module.exports = enviarCorreo;
