const mongoose = require('mongoose');

const perroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    raza: {
      type: String,
      required: [true, 'La raza es obligatoria'],
      trim: true
    },
    edad: {
      type: Number,
      required: [true, 'La edad es obligatoria'],
      min: [0, 'La edad no puede ser negativa']
    },
    peso: {
      type: Number,
      required: [true, 'El peso es obligatorio'],
      min: [0, 'El peso no puede ser negativo']
    },
    sexo: {
      type: String,
      required: [true, 'El sexo es obligatorio'],
      enum: {
        values: ['Macho', 'Hembra'],
        message: 'El sexo debe ser Macho o Hembra'
      }
    },
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Propietario',
      required: [true, 'El propietario es obligatorio']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Perro', perroSchema);
