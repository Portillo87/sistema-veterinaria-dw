const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema(
  {
    fechaConsulta: {
      type: Date,
      required: [true, 'La fecha de consulta es obligatoria']
    },
    motivoConsulta: {
      type: String,
      required: [true, 'El motivo de consulta es obligatorio'],
      trim: true
    },
    diagnostico: {
      type: String,
      required: [true, 'El diagnóstico es obligatorio'],
      trim: true
    },
    tratamiento: {
      type: String,
      required: [true, 'El tratamiento es obligatorio'],
      trim: true
    },
    veterinarioResponsable: {
      type: String,
      required: [true, 'El veterinario responsable es obligatorio'],
      trim: true
    },
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Perro',
      required: [true, 'La mascota es obligatoria']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HistorialClinico', historialSchema);
