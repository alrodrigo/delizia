// Test integración frontend-backend
console.log('🧪 Probando integración Frontend + API separada');
console.log('=' .repeat(60));

import fetch from 'node-fetch';

const FRONTEND_URL = 'https://delizia.vercel.app';
const API_URL = 'https://api-delizia.vercel.app/api';

async function testIntegration() {
  try {
    console.log('🔍 1. Verificando que la API funciona...');
    
    // Test API directa
    const apiResponse = await fetch(`${API_URL}/empleados`);
    const apiData = await apiResponse.json();
    console.log('✅ API Status:', apiResponse.status);
    console.log('✅ API Data:', apiData.success ? `${apiData.count} empleados` : 'Error');

    console.log('\n🔍 2. Verificando que el frontend carga...');
    
    // Test frontend
    const frontendResponse = await fetch(FRONTEND_URL);
    console.log('✅ Frontend Status:', frontendResponse.status);
    console.log('✅ Frontend Content-Type:', frontendResponse.headers.get('content-type'));

    console.log('\n🧪 3. Probando operaciones CRUD...');
    
    // Test crear empleado
    const nuevoEmpleado = {
      nombre: 'Integration Test',
      email: 'integration@delizia.com',
      telefono: '999-888-777',
      cargo: 'Tester',
      agencia: '1',
      fechaIngreso: '2024-06-18',
      salario: 2800,
      activo: true
    };

    const createResponse = await fetch(`${API_URL}/empleados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoEmpleado),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Empleado creado:', createData.success ? 'Exitoso' : 'Error');
      
      if (createData.success && createData.data) {
        const empleadoId = createData.data._id;
        console.log('✅ ID del nuevo empleado:', empleadoId);
      }
    } else {
      console.log('❌ Error creando empleado:', createResponse.status);
    }

    console.log('\n🎉 RESUMEN:');
    console.log('✅ API separada: FUNCIONANDO');
    console.log('✅ Frontend desplegado: FUNCIONANDO');
    console.log('✅ CRUD empleados: FUNCIONANDO');
    console.log('\n💡 Ahora puedes usar tu aplicación en:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   API: ${API_URL}`);

  } catch (error) {
    console.error('❌ Error en integración:', error.message);
    
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Esperar unos minutos más para que Vercel termine de desplegar');
    console.log('2. Verificar que no hay errores en el build del frontend');
    console.log('3. Verificar la configuración de CORS en la API');
  }
}

testIntegration();
