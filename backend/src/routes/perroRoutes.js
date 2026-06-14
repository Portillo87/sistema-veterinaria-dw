const express = require('express');
const router = express.Router();
const {
  obtenerPerros,
  obtenerPerroPorId,
  crearPerro,
  actualizarPerro,
  eliminarPerro
} = require('../controllers/perroController');

router.get('/', obtenerPerros);
router.get('/:id', obtenerPerroPorId);
router.post('/', crearPerro);
router.put('/:id', actualizarPerro);
router.delete('/:id', eliminarPerro);

module.exports = router;
