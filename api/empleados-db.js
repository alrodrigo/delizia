import { connectToDatabase } from '../utils/mongodb.js';

// Permitir CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Datos mock como fallback
const empleadosMock = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@delizia.com',
    telefono: '123-456-7890',
    agencia: 'Sucursal Centro',
    agenciaId: 1,
    cargo: 'Vendedor',
    fechaIngreso: '2023-01-15',
    salario: 35000,
    estado: 'activo'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria@delizia.com',
    telefono: '123-456-7891',
    agencia: 'Sucursal Norte',
    agenciaId: 2,
    cargo: 'Supervisor',
    fechaIngreso: '2022-06-10',
    salario: 45000,
    estado: 'activo'
  }
];

let nextId = 3;

export default async function handler(req, res) {
  // Manejar preflight de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Aplicar headers CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { method, query } = req;
    let useDatabase = false;
    let db = null;

    // Intentar conectar a MongoDB
    try {
      const connection = await connectToDatabase();
      db = connection.db;
      useDatabase = true;
      console.log('✅ Usando MongoDB para empleados');
    } catch (dbError) {
      console.log('⚠️ MongoDB no disponible, usando datos mock:', dbError.message);
      useDatabase = false;
    }

    switch (method) {
      case 'GET':
        if (query.id) {
          // Obtener empleado específico
          if (useDatabase) {
            const empleado = await db.collection('empleados').findOne({ id: parseInt(query.id) });
            if (!empleado) {
              return res.status(404).json({
                success: false,
                message: 'Empleado no encontrado'
              });
            }
            return res.status(200).json({
              success: true,
              data: empleado,
              count: 1
            });
          } else {
            const empleado = empleadosMock.find(e => e.id === parseInt(query.id));
            if (!empleado) {
              return res.status(404).json({
                success: false,
                message: 'Empleado no encontrado'
              });
            }
            return res.status(200).json({
              success: true,
              data: empleado,
              count: 1
            });
          }
        } else {
          // Obtener todos los empleados
          if (useDatabase) {
            const empleados = await db.collection('empleados').find({}).toArray();
            return res.status(200).json({
              success: true,
              data: empleados,
              count: empleados.length
            });
          } else {
            return res.status(200).json({
              success: true,
              data: empleadosMock,
              count: empleadosMock.length
            });
          }
        }

      case 'POST':
        // Crear nuevo empleado
        const nuevoEmpleado = {
          id: useDatabase ? new Date().getTime() : nextId++,
          ...req.body,
          fechaCreacion: new Date().toISOString()
        };

        if (useDatabase) {
          await db.collection('empleados').insertOne(nuevoEmpleado);
          return res.status(201).json({
            success: true,
            data: nuevoEmpleado,
            message: 'Empleado creado exitosamente en MongoDB'
          });
        } else {
          empleadosMock.push(nuevoEmpleado);
          return res.status(201).json({
            success: true,
            data: nuevoEmpleado,
            message: 'Empleado creado exitosamente (mock)'
          });
        }

      case 'PUT':
        // Actualizar empleado
        if (!query.id) {
          return res.status(400).json({
            success: false,
            message: 'ID de empleado requerido'
          });
        }

        if (useDatabase) {
          const result = await db.collection('empleados').updateOne(
            { id: parseInt(query.id) },
            { $set: { ...req.body, fechaActualizacion: new Date().toISOString() } }
          );
          
          if (result.matchedCount === 0) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }

          const empleadoActualizado = await db.collection('empleados').findOne({ id: parseInt(query.id) });
          return res.status(200).json({
            success: true,
            data: empleadoActualizado,
            message: 'Empleado actualizado exitosamente en MongoDB'
          });
        } else {
          const index = empleadosMock.findIndex(e => e.id === parseInt(query.id));
          if (index === -1) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }

          empleadosMock[index] = { ...empleadosMock[index], ...req.body };
          return res.status(200).json({
            success: true,
            data: empleadosMock[index],
            message: 'Empleado actualizado exitosamente (mock)'
          });
        }

      case 'DELETE':
        // Eliminar empleado
        if (!query.id) {
          return res.status(400).json({
            success: false,
            message: 'ID de empleado requerido'
          });
        }

        if (useDatabase) {
          const result = await db.collection('empleados').deleteOne({ id: parseInt(query.id) });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }

          return res.status(200).json({
            success: true,
            message: 'Empleado eliminado exitosamente de MongoDB'
          });
        } else {
          const index = empleadosMock.findIndex(e => e.id === parseInt(query.id));
          if (index === -1) {
            return res.status(404).json({
              success: false,
              message: 'Empleado no encontrado'
            });
          }

          empleadosMock.splice(index, 1);
          return res.status(200).json({
            success: true,
            message: 'Empleado eliminado exitosamente (mock)'
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
        return res.status(405).json({
          success: false,
          message: `Método ${method} no permitido`
        });
    }

  } catch (error) {
    console.error('❌ Error en /api/empleados-db:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}
