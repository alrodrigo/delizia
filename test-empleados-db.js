import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/empleados-db';

async function testEmpleadosDB() {
  console.log('🧪 Probando endpoint /api/empleados-db');
  console.log('=' .repeat(50));

  try {
    // 1. GET - Obtener todos los empleados
    console.log('\n📋 1. Obteniendo todos los empleados...');
    const response1 = await fetch(API_URL);
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Respuesta:', JSON.stringify(data1, null, 2));

    // 2. GET - Obtener empleado específico
    console.log('\n👤 2. Obteniendo empleado con ID 1...');
    const response2 = await fetch(`${API_URL}?id=1`);
    const data2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Respuesta:', JSON.stringify(data2, null, 2));

    // 3. POST - Crear nuevo empleado
    console.log('\n➕ 3. Creando nuevo empleado...');
    const nuevoEmpleado = {
      nombre: 'Carlos',
      apellido: 'Rodriguez',
      email: 'carlos@delizia.com',
      telefono: '123-456-7892',
      agencia: 'Sucursal Sur',
      agenciaId: 3,
      cargo: 'Cajero',
      fechaIngreso: '2024-01-15',
      salario: 30000,
      estado: 'activo'
    };

    const response3 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoEmpleado),
    });
    const data3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Respuesta:', JSON.stringify(data3, null, 2));

    console.log('\n✅ Pruebas completadas');
    console.log('\n💡 Notas:');
    console.log('- Si ves "mock" en los mensajes, está usando datos temporales');
    console.log('- Si ves "MongoDB", está usando la base de datos real');
    console.log('- Para activar MongoDB, configura la contraseña en .env.local');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n💡 ¿El servidor está corriendo?');
    console.log('   Para probar localmente: npm run dev en el directorio backend');
    console.log('   Para Vercel: vercel dev');
  }
}

testEmpleadosDB();
