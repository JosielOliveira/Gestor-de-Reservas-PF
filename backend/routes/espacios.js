const express = require("express");
const { espacios } = require("../data/espacios"); // Importamos la lista de espacios

const router = express.Router();

// 📌 Endpoint para obtener todos los espacios deportivos
router.get("/", (req, res) => {
    res.json(espacios);
});

module.exports = router;
