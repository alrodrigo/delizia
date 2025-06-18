import { connectToDatabase } from '../utils/mongodb.js';
import { Agencia } from '../backend/src/models/index.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Conectar a MongoDB
    await connectToDatabase();

    const { method, query, body } = req;
    const { action, id, page = 1, limit = 10, search } = query;

    switch (method) {
      case 'GET':
        if (action === 'get' && id) {
          // Obtener agencia por ID
          const agencia = await Agencia.findById(id);
          if (!agencia) {
            return res.status(404).json({
              success: false,
              message: 'Agencia no encontrada'
            });
          }
          
          return res.status(200).json({
            success: true,
            data: agencia
          });
        } else {
          // Listar agencias con filtros y paginación
          const filter = {};
          
          if (search) {
            filter.$or = [
              { nombre: { $regex: search, $options: 'i' } },
              { gerente: { $regex: search, $options: 'i' } },
              { direccion: { $regex: search, $options: 'i' } }
            ];
          }

          const skip = (parseInt(page) - 1) * parseInt(limit);
          const agencias = await Agencia.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

          const total = await Agencia.countDocuments(filter);

          return res.status(200).json({
            success: true,
            count: agencias.length,
            data: agencias,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total,
              pages: Math.ceil(total / parseInt(limit))
            }
          });
        }

      case 'POST':
        if (action === 'create') {
          // Crear nueva agencia
          const nuevaAgencia = new Agencia(body);
          await nuevaAgencia.save();
          
          return res.status(201).json({
            success: true,
            message: 'Agencia creada exitosamente',
            data: nuevaAgencia
          });
        }
        break;

      case 'PUT':
        if (action === 'update' && id) {
          // Actualizar agencia
          const agenciaActualizada = await Agencia.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
          );
          
          if (!agenciaActualizada) {
            return res.status(404).json({
              success: false,
              message: 'Agencia no encontrada'
            });
          }
          
          return res.status(200).json({
            success: true,
            message: 'Agencia actualizada exitosamente',
            data: agenciaActualizada
          });
        }
        break;

      case 'DELETE':
        if (action === 'delete' && id) {
          // Eliminar agencia (soft delete)
          const agenciaEliminada = await Agencia.findByIdAndUpdate(
            id,
            { activa: false },
            { new: true }
          );
          
          if (!agenciaEliminada) {
            return res.status(404).json({
              success: false,
              message: 'Agencia no encontrada'
            });
          }
          
          return res.status(200).json({
            success: true,
            message: 'Agencia eliminada exitosamente'
          });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({
          success: false,
          message: `Método ${method} no permitido`
        });
    }

    return res.status(400).json({
      success: false,
      message: 'Acción no válida o parámetros faltantes'
    });

  } catch (error) {
    console.error('Error en endpoint agencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
