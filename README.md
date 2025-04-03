# 📅 Gestor de Reservas

Aplicación web fullstack para gestionar reservas, con autenticación de usuarios, CRUD completo y panel de administración.

---

## Tecnologías Utilizadas

### Frontend
- React (v18+)
- React Router DOM (v6)
- Context API
- JavaScript
- Fetch API
- CSS

### Backend
- Node.js
- Express
- MongoDB (con Mongoose)
- JWT (JSON Web Token)
- dotenv
- Nodemailer (con Mailtrap para testing)

## Funcionalidades

✅ Autenticación de usuarios con JWT
✅ Inicio de sesión y cierre de sesión
✅ Rutas protegidas según el rol
✅ Dashboard para gestionar reservas
✅ Envío de correos al reservar
✅ CRUD completo para Espacios (solo para Admin)
✅ Sesión persistente con localStorage

## Estructura del Proyecto

/backend
  ├── models/
  ├── routes/
  ├── controllers/ (opcional)
  ├── middleware/
  ├── utils/
  └── server.js

/frontend
  ├── pages/
  ├── context/
  ├── services/
  ├── components/
  └── App.jsx


¡Gracias por visitar este proyecto!
Si te ha sido útil o inspirador, no dudes en dejar una estrella ⭐ en el repositorio.