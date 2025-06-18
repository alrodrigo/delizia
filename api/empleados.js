import connectToDatabase from '../backend/src/config/mongodb.js';
import { Empleado } from '../backend/src/models/index.js';

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
    const { action, id, page = 1, limit = 10, search, agencia } = query;

    switch (method) {
      case 'GET':
        if (action === 'get' && id) {
          // Obtener empleado por ID
          const empleado = await Empleado.findById(id).populate('agencia._id');
          if (!empleado) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }
          
          return res.status(200).json({
            success: true,
            data: empleado
          });
        } else {
          // Listar empleados con filtros y paginación
          const filter = {};
          
          if (search) {
            filter.$or = [
              { nombre: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { cargo: { $regex: search, $options: 'i' } }
            ];
          }
          
          if (agencia) {
            filter['agencia._id'] = agencia;
          }

          const skip = (parseInt(page) - 1) * parseInt(limit);
          const empleados = await Empleado.find(filter)
            .populate('agencia._id')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

          const total = await Empleado.countDocuments(filter);

          return res.status(200).json({
            success: true,
            count: empleados.length,
            data: empleados,
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
          // Crear nuevo empleado
          const nuevoEmpleado = new Empleado(body);
          await nuevoEmpleado.save();
          
          return res.status(201).json({
            success: true,
            message: 'Empleado creado exitosamente',
            data: nuevoEmpleado
          });
        }
        break;

      case 'PUT':
        if (action === 'update' && id) {
          // Actualizar empleado
          const empleadoActualizado = await Empleado.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
          );
          
          if (!empleadoActualizado) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }
          
          return res.status(200).json({
            success: true,
            message: 'Empleado actualizado exitosamente',
            data: empleadoActualizado
          });
        }
        break;

      case 'DELETE':
        if (action === 'delete' && id) {
          // Eliminar empleado (soft delete)
          const empleadoEliminado = await Empleado.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
          );
          
          if (!empleadoEliminado) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }
          
          return res.status(200).json({
            success: true,
            message: 'Empleado eliminado exitosamente'
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
    console.error('Error en endpoint empleados:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
