const Propietario = require('../models/Propietario');

const obtenerPropietarios = async (req, res) => {
  try {
    const propietarios = await Propietario.find().sort({ nombreCompleto: 1 });
    res.json({ ok: true, datos: propietarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener los propietarios' });
  }
};

const obtenerPropietarioPorId = async (req, res) => {
  try {
    const propietario = await Propietario.findById(req.params.id);
    if (!propietario)
      return res.status(404).json({ ok: false, mensaje: 'Propietario no encontrado' });
    res.json({ ok: true, datos: propietario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el propietario' });
  }
};

const crearPropietario = async (req, res) => {
  try {
    const propietario = new Propietario(req.body);
    await propietario.save();
    res.status(201).json({
      ok: true,
      mensaje: 'Propietario registrado correctamente',
      datos: propietario
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ ok: false, mensaje: 'Error de validación', errores });
    }
    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        ok: false,
        mensaje: `El valor del campo '${campo}' ya existe en el sistema`
      });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al registrar el propietario' });
  }
};

const actualizarPropietario = async (req, res) => {
  try {
    const propietario = await Propietario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!propietario)
      return res.status(404).json({ ok: false, mensaje: 'Propietario no encontrado' });
    res.json({
      ok: true,
      mensaje: 'Propietario actualizado correctamente',
      datos: propietario
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ ok: false, mensaje: 'Error de validación', errores });
    }
    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        ok: false,
        mensaje: `El valor del campo '${campo}' ya existe en el sistema`
      });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar el propietario' });
  }
};

const eliminarPropietario = async (req, res) => {
  try {
    const propietario = await Propietario.findByIdAndDelete(req.params.id);
    if (!propietario)
      return res.status(404).json({ ok: false, mensaje: 'Propietario no encontrado' });
    res.json({ ok: true, mensaje: 'Propietario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar el propietario' });
  }
};

module.exports = {
  obtenerPropietarios,
  obtenerPropietarioPorId,
  crearPropietario,
  actualizarPropietario,
  eliminarPropietario
};
