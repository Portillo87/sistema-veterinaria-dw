const express = require('express');
const router = express.Router();
const {
  obtenerPropietarios,
  obtenerPropietarioPorId,
  crearPropietario,
  actualizarPropietario,
  eliminarPropietario
} = require('../controllers/propietarioController');

router.get('/', obtenerPropietarios);
router.get('/:id', obtenerPropietarioPorId);
router.post('/', crearPropietario);
router.put('/:id', actualizarPropietario);
router.delete('/:id', eliminarPropietario);

module.exports = router;
