// Función API para Vercel Serverless
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Logging para debug
  console.log('API llamada:', req.method, req.url);
  console.log('Query:', req.query);
  console.log('Body:', req.body);

  // La ruta viene en req.query.path desde vercel.json
  const path = req.query.path ? `/${req.query.path}` : req.url || '/';
  
  console.log('Path recibido:', path);

  try {
    // Ruta raíz - test
    if (req.method === 'GET' && path === '/') {
      return res.json({ 
        message: 'API de control de personal Delizia funcionando',
        timestamp: new Date().toISOString(),
        env: {
          nodeEnv: process.env.NODE_ENV,
          hasMongoUri: !!process.env.MONGODB_URI,
          hasJwtSecret: !!process.env.JWT_SECRET
        }
      });
    }

    // Ruta de login
    if (req.method === 'POST' && path === '/auth/login') {
      const { email, password } = req.body;
      
      console.log('Intento de login:', email);

      // Verificar que tengamos las variables de entorno
      if (!process.env.MONGODB_URI) {
        return res.status(500).json({ 
          error: 'MONGODB_URI no configurado',
          env: Object.keys(process.env).filter(k => k.includes('MONGO'))
        });
      }

      // Importar dependencias dinámicamente
      const mongoose = await import('mongoose');
      const bcrypt = await import('bcryptjs');
      const jwt = await import('jsonwebtoken');

      // Modelo Usuario
      let Usuario;
      try {
        Usuario = mongoose.default.model('Usuario');
      } catch {
        const userSchema = new mongoose.default.Schema({
          nombre: String,
          email: String,
          password: String,
          rol: String
        });
        Usuario = mongoose.default.model('Usuario', userSchema);
      }

      // Conectar a MongoDB
      if (mongoose.default.connection.readyState !== 1) {
        await mongoose.default.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
      }

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
    }

    // Ruta de registro
    if (req.method === 'POST' && path === '/auth/register') {
      const { nombre, email, password } = req.body;
      
      console.log('Intento de registro:', email);

      // Verificar que tengamos las variables de entorno
      if (!process.env.MONGODB_URI) {
        return res.status(500).json({ 
          error: 'MONGODB_URI no configurado' 
        });
      }

      // Importar dependencias dinámicamente
      const mongoose = await import('mongoose');
      const bcrypt = await import('bcryptjs');

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

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Hash de la contraseña
      const salt = await bcrypt.default.genSalt(10);
      const passwordHash = await bcrypt.default.hash(password, salt);

      // Crear usuario
      const nuevoUsuario = new Usuario({
        nombre,
        email,
        password: passwordHash,
        rol: 'empleado' // Por defecto los nuevos usuarios son empleados
      });

      await nuevoUsuario.save();

      console.log('Usuario registrado exitosamente:', email);

      return res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario: {
          id: nuevoUsuario._id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol
        }
      });
    }

    // Ruta no encontrada
    return res.status(404).json({ 
      message: 'Ruta no encontrada', 
      method: req.method,
      url: req.url,
      path: path,
      query: req.query
    });

  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
}
