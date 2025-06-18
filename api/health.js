// Health check endpoint para Vercel
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API Delizia funcionando correctamente',
      timestamp: new Date().toISOString(),
      mongodb: process.env.MONGODB_URI ? 'Configurado' : 'No configurado',
      endpoints: [
        '/api/health',
        '/api/empleados-db',
        '/api/agencias'
      ]
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Método no permitido'
  });
}
