const mongoose = require('mongoose');

const propietarioSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    dui: {
      type: String,
      required: [true, 'El DUI es obligatorio'],
      unique: true,
      trim: true,
      match: [/^\d{8}-\d$/, 'El DUI debe tener el formato 00000000-0']
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true
    },
    correo: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'El correo no tiene un formato válido']
    },
    direccion: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Propietario', propietarioSchema);
