const express = require('express');
const router = express.Router();
const {
  obtenerHistorialPorMascota,
  crearHistorial,
  actualizarHistorial,
  eliminarHistorial
} = require('../controllers/historialController');

router.get('/mascota/:mascotaId', obtenerHistorialPorMascota);
router.post('/', crearHistorial);
router.put('/:id', actualizarHistorial);
router.delete('/:id', eliminarHistorial);

module.exports = router;
