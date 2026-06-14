const HistorialClinico = require('../models/HistorialClinico');

const obtenerHistorialPorMascota = async (req, res) => {
  try {
    const historial = await HistorialClinico.find({ mascota: req.params.mascotaId })
      .populate('mascota', 'nombre raza')
      .sort({ fechaConsulta: -1 });
    res.json({ ok: true, datos: historial });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el historial clínico' });
  }
};

const crearHistorial = async (req, res) => {
  try {
    const registro = new HistorialClinico(req.body);
    await registro.save();
    const registroPopulado = await registro.populate('mascota', 'nombre raza');
    res.status(201).json({
      ok: true,
      mensaje: 'Consulta médica registrada correctamente',
      datos: registroPopulado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ ok: false, mensaje: 'Error de validación', errores });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al registrar la consulta médica' });
  }
};

const actualizarHistorial = async (req, res) => {
  try {
    const registro = await HistorialClinico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('mascota', 'nombre raza');
    if (!registro)
      return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
    res.json({
      ok: true,
      mensaje: 'Consulta médica actualizada correctamente',
      datos: registro
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ ok: false, mensaje: 'Error de validación', errores });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar la consulta médica' });
  }
};

const eliminarHistorial = async (req, res) => {
  try {
    const registro = await HistorialClinico.findByIdAndDelete(req.params.id);
    if (!registro)
      return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
    res.json({ ok: true, mensaje: 'Consulta médica eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar la consulta médica' });
  }
};

module.exports = {
  obtenerHistorialPorMascota,
  crearHistorial,
  actualizarHistorial,
  eliminarHistorial
};
