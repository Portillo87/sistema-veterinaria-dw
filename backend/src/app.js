const express = require('express');
const cors = require('cors');

const perroRoutes = require('./routes/perroRoutes');
const propietarioRoutes = require('./routes/propietarioRoutes');
const historialRoutes = require('./routes/historialRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/perros', perroRoutes);
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/historial', historialRoutes);

module.exports = app;
