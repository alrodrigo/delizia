// Prueba del endpoint en producción
console.log('🧪 Probando endpoint en producción');
console.log('=' .repeat(50));

import fetch from 'node-fetch';

const VERCEL_URL = 'https://delizia.vercel.app';

async function testProduction() {
  try {
    console.log('🔍 Probando endpoint empleados-db en producción...');
    
    // 1. Health check
    console.log('\n💚 1. Health Check');
    const healthResponse = await fetch(`${VERCEL_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('Status:', healthResponse.status);
    console.log('Health:', healthData);

    // 2. Obtener empleados
    console.log('\n👥 2. Obtener empleados');
    const empleadosResponse = await fetch(`${VERCEL_URL}/api/empleados-db`);
    const empleadosData = await empleadosResponse.json();
    console.log('Status:', empleadosResponse.status);
    console.log('Empleados:', empleadosData);

    // 3. Crear empleado nuevo
    console.log('\n➕ 3. Crear empleado');
    const nuevoEmpleado = {
      nombre: 'TestUser',
      apellido: 'Production',
      email: 'test@delizia.com',
      telefono: '123-456-7890',
      agencia: 'Sucursal Test',
      agenciaId: 99,
      cargo: 'Tester',
      fechaIngreso: '2024-06-18',
      salario: 40000,
      estado: 'activo'
    };

    const createResponse = await fetch(`${VERCEL_URL}/api/empleados-db`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoEmpleado),
    });
    const createData = await createResponse.json();
    console.log('Status:', createResponse.status);
    console.log('Nuevo empleado:', createData);

    console.log('\n✅ Pruebas completadas');
    console.log('\n💡 Si ves "usando MongoDB", ¡la persistencia está activa!');
    console.log('💡 Si ves "mock", revisa las variables de entorno en Vercel');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Posibles problemas:');
    console.log('1. URL incorrecta - verifica tu dominio de Vercel');
    console.log('2. Variable MONGODB_URI no configurada en Vercel');
    console.log('3. El despliegue aún no terminó');
  }
}

testProduction();
