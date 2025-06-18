import connectToDatabase from '../backend/src/config/mongodb.js';
import { Empleado, Agencia } from '../backend/src/models/index.js';

export default async function handler(req, res) {
  // Solo permitir POST para inicializar
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    // Conectar a MongoDB
    await connectToDatabase();

    // Verificar si ya hay datos
    const agenciasExistentes = await Agencia.countDocuments();
    const empleadosExistentes = await Empleado.countDocuments();

    if (agenciasExistentes > 0 || empleadosExistentes > 0) {
      return res.status(200).json({
        success: true,
        message: 'Los datos ya existen en la base de datos',
        data: {
          agencias: agenciasExistentes,
          empleados: empleadosExistentes
        }
      });
    }

    // Crear agencias de prueba
    const agencias = await Agencia.insertMany([
      {
        nombre: 'Agencia Centro',
        direccion: 'Av. Principal 123, Centro',
        telefono: '+51 999 123 456',
        email: 'centro@delizia.com',
        gerente: 'Ana García',
        activa: true
      },
      {
        nombre: 'Agencia Norte',
        direccion: 'Jr. Los Pinos 456, San Miguel',
        telefono: '+51 999 789 012',
        email: 'norte@delizia.com',
        gerente: 'Carlos Mendoza',
        activa: true
      },
      {
        nombre: 'Agencia Sur',
        direccion: 'Av. Libertad 789, Miraflores',
        telefono: '+51 999 345 678',
        email: 'sur@delizia.com',
        gerente: 'María Rodríguez',
        activa: true
      }
    ]);

    // Crear empleados de prueba
    const empleados = await Empleado.insertMany([
      {
        nombre: 'Juan Pérez',
        email: 'juan.perez@delizia.com',
        telefono: '+51 987 654 321',
        cargo: 'Vendedor',
        agencia: {
          _id: agencias[0]._id,
          nombre: agencias[0].nombre
        },
        salario: 2500,
        fechaIngreso: new Date('2023-01-15'),
        activo: true
      },
      {
        nombre: 'María López',
        email: 'maria.lopez@delizia.com',
        telefono: '+51 987 654 322',
        cargo: 'Supervisora',
        agencia: {
          _id: agencias[0]._id,
          nombre: agencias[0].nombre
        },
        salario: 3500,
        fechaIngreso: new Date('2022-08-10'),
        activo: true
      },
      {
        nombre: 'Carlos Silva',
        email: 'carlos.silva@delizia.com',
        telefono: '+51 987 654 323',
        cargo: 'Vendedor',
        agencia: {
          _id: agencias[1]._id,
          nombre: agencias[1].nombre
        },
        salario: 2500,
        fechaIngreso: new Date('2023-03-20'),
        activo: true
      },
      {
        nombre: 'Ana Torres',
        email: 'ana.torres@delizia.com',
        telefono: '+51 987 654 324',
        cargo: 'Coordinadora',
        agencia: {
          _id: agencias[2]._id,
          nombre: agencias[2].nombre
        },
        salario: 3200,
        fechaIngreso: new Date('2022-11-05'),
        activo: true
      }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Datos de prueba creados exitosamente',
      data: {
        agenciasCreadas: agencias.length,
        empleadosCreados: empleados.length,
        agencias: agencias,
        empleados: empleados
      }
    });

  } catch (error) {
    console.error('Error inicializando datos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al inicializar datos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
