import express from 'express';
import cors from 'cors';
import empleadosHandler from './api/empleados-db.js';
import agenciasHandler from './api/agencias.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json());

// Wrapper para convertir handlers de Vercel a Express
function vercelToExpress(handler) {
  return async (req, res) => {
    try {
      // Configurar las variables de entorno para MongoDB
      process.env.MONGODB_URI = 'mongodb+srv://adelgadoq:EOt9BLdXCNmZWekA@cluster0.odu4rtq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
      
      await handler(req, res);
    } catch (error) {
      console.error('Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor',
          error: error.message 
        });
      }
    }
  };
}

// Rutas API
app.use('/api/empleados-db', vercelToExpress(empleadosHandler));
app.use('/api/agencias', vercelToExpress(agenciasHandler));

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    mongodb: process.env.MONGODB_URI ? 'Configurado' : 'No configurado'
  });
});

// Página de inicio
app.get('/', (req, res) => {
  res.json({
    message: 'API Delizia - Servidor de desarrollo',
    endpoints: [
      'GET /api/health',
      'GET/POST/PUT/DELETE /api/empleados-db',
      'GET/POST/PUT/DELETE /api/agencias'
    ],
    frontend_url: 'http://localhost:3001'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   GET  http://localhost:${PORT}/api/empleados-db`);
  console.log(`   GET  http://localhost:${PORT}/api/agencias`);
  console.log(`🌐 Frontend debería estar en http://localhost:3001`);
  console.log(`💾 MongoDB: ${process.env.MONGODB_URI ? 'Configurado' : 'No configurado'}`);
});
