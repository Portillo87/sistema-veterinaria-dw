const Perro = require('../models/Perro');

const obtenerPerros = async (req, res) => {
  try {
    const perros = await Perro.find().populate('propietario').sort({ nombre: 1 });
    res.json({ ok: true, datos: perros });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener las mascotas' });
  }
};

const obtenerPerroPorId = async (req, res) => {
  try {
    const perro = await Perro.findById(req.params.id).populate('propietario');
    if (!perro)
      return res.status(404).json({ ok: false, mensaje: 'Mascota no encontrada' });
    res.json({ ok: true, datos: perro });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener la mascota' });
  }
};

const crearPerro = async (req, res) => {
  try {
    const nuevoPerro = new Perro(req.body);
    await nuevoPerro.save();
    const perroPopulado = await nuevoPerro.populate('propietario');
    res.status(201).json({
      ok: true,
      mensaje: 'Mascota registrada correctamente',
      datos: perroPopulado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ ok: false, mensaje: 'Error de validación', errores });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al registrar la mascota' });
  }
};

const actualizarPerro = async (req, res) => {
  try {
    const perroActualizado = await Perro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('propietario');
    if (!perroActualizado)
      return res.status(404).json({ ok: false, mensaje: 'Mascota no encontrada' });
    res.json({
      ok: true,
      mensaje: 'Mascota actualizada correctamente',
      datos: perroActualizado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ ok: false, mensaje: 'Error de validación', errores });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar la mascota' });
  }
};

const eliminarPerro = async (req, res) => {
  try {
    const perro = await Perro.findByIdAndDelete(req.params.id);
    if (!perro)
      return res.status(404).json({ ok: false, mensaje: 'Mascota no encontrada' });
    res.json({ ok: true, mensaje: 'Mascota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar la mascota' });
  }
};

module.exports = {
  obtenerPerros,
  obtenerPerroPorId,
  crearPerro,
  actualizarPerro,
  eliminarPerro
};
