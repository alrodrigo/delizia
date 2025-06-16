// API endpoint para login - Vercel Serverless Functions
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { email, password } = req.body;
    
    console.log('Intento de login:', email);

    // Verificar que tengamos las variables de entorno
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'MONGODB_URI no configurado'
      });
    }

    // Importar dependencias dinámicamente
    const mongoose = await import('mongoose');
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    // Conectar a MongoDB
    if (mongoose.default.connection.readyState !== 1) {
      await mongoose.default.connect(process.env.MONGODB_URI);
    }

    // Modelo Usuario
    const UsuarioSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      rol: { type: String, default: 'empleado' },
      fechaCreacion: { type: Date, default: Date.now }
    });

    const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log('Usuario no encontrado:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const esValida = await bcrypt.default.compare(password, usuario.password);
    if (!esValida) {
      console.log('Contraseña incorrecta para:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.default.sign(
      { 
        id: usuario._id, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    console.log('Login exitoso para:', email);
    
    return res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
}
