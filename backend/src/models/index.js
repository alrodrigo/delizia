import mongoose from 'mongoose';

// Esquema para Empleado
const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    required: true
  },
  agencia: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agencia'
    },
    nombre: String
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
  salario: {
    type: Number,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Esquema para Agencia
const agenciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  gerente: {
    type: String,
    required: true
  },
  activa: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Esquema para Asistencia
const asistenciaSchema = new mongoose.Schema({
  empleado: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      required: true
    },
    nombre: String
  },
  fecha: {
    type: Date,
    required: true
  },
  horaEntrada: String,
  horaSalida: String,
  estado: {
    type: String,
    enum: ['presente', 'tardanza', 'ausente', 'falta'],
    required: true
  },
  observaciones: String
}, {
  timestamps: true
});

// Esquema para Desempeño
const desempenoSchema = new mongoose.Schema({
  empleado: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      required: true
    },
    nombre: String
  },
  periodo: {
    type: String,
    required: true
  },
  puntuacion: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  metas: {
    ventas: Number,
    atencionCliente: Number,
    puntualidad: Number,
    trabajoEquipo: Number
  },
  observaciones: String,
  fechaEvaluacion: {
    type: Date,
    default: Date.now
  },
  evaluador: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Esquema para Observación
const observacionSchema = new mongoose.Schema({
  empleado: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      required: true
    },
    nombre: String
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['positiva', 'negativa', 'neutra', 'reconocimiento', 'mejora', 'seguimiento'],
    required: true
  },
  categoria: String,
  descripcion: {
    type: String,
    required: true
  },
  observador: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Crear modelos evitando re-compilación
const Empleado = mongoose.models.Empleado || mongoose.model('Empleado', empleadoSchema);
const Agencia = mongoose.models.Agencia || mongoose.model('Agencia', agenciaSchema);
const Asistencia = mongoose.models.Asistencia || mongoose.model('Asistencia', asistenciaSchema);
const Desempeno = mongoose.models.Desempeno || mongoose.model('Desempeno', desempenoSchema);
const Observacion = mongoose.models.Observacion || mongoose.model('Observacion', observacionSchema);

export { Empleado, Agencia, Asistencia, Desempeno, Observacion };
