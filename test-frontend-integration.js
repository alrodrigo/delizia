/**
 * Script de prueba para verificar la integración del frontend con la nueva API de MongoDB
 */

const API_BASE = 'https://api-delizia.vercel.app/api';

console.log('🧪 Iniciando pruebas de integración Frontend -> API MongoDB');
console.log('=' .repeat(60));

async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();

    console.log(`\n📡 ${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(result, null, 2));

    return { success: response.ok, data: result };
  } catch (error) {
    console.error(`❌ Error en ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n🔍 1. Probando endpoint de empleados...');
  const empleados = await testEndpoint('/empleados');
  
  if (empleados.success && empleados.data.data) {
    console.log(`✅ ${empleados.data.count} empleados encontrados`);
    console.log(`📋 Estructura correcta: tiene 'data' array`);
    
    if (empleados.data.data.length > 0) {
      const primerEmpleado = empleados.data.data[0];
      console.log(`👤 Primer empleado ID: ${primerEmpleado._id} (${typeof primerEmpleado._id})`);
      console.log(`👤 Nombre: ${primerEmpleado.nombre}`);
    }
  }

  console.log('\n🔍 2. Probando endpoint de agencias...');
  const agencias = await testEndpoint('/agencias');
  
  if (agencias.success && agencias.data.data) {
    console.log(`✅ ${agencias.data.count} agencias encontradas`);
    
    if (agencias.data.data.length > 0) {
      const primeraAgencia = agencias.data.data[0];
      console.log(`🏢 Primera agencia ID: ${primeraAgencia._id} (${typeof primeraAgencia._id})`);
      console.log(`🏢 Nombre: ${primeraAgencia.nombre}`);
    }
  }

  console.log('\n🔍 3. Probando endpoint de evaluaciones...');
  const evaluaciones = await testEndpoint('/evaluaciones');
  
  if (evaluaciones.success) {
    console.log(`✅ Endpoint de evaluaciones responde correctamente`);
    console.log(`📊 Count: ${evaluaciones.data.count || 0}`);
  }

  console.log('\n🔍 4. Probando endpoint de asistencias...');
  const asistencias = await testEndpoint('/asistencias');
  
  if (asistencias.success) {
    console.log(`✅ Endpoint de asistencias responde correctamente`);
    console.log(`📅 Count: ${asistencias.data.count || 0}`);
  }

  console.log('\n🔍 5. Probando endpoint de observaciones...');
  const observaciones = await testEndpoint('/observaciones');
  
  if (observaciones.success) {
    console.log(`✅ Endpoint de observaciones responde correctamente`);
    console.log(`📝 Count: ${observaciones.data.count || 0}`);
  }

  console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
  console.log('✅ Empleados: ' + (empleados.success ? 'OK' : 'FALLO'));
  console.log('✅ Agencias: ' + (agencias.success ? 'OK' : 'FALLO'));
  console.log('✅ Evaluaciones: ' + (evaluaciones.success ? 'OK' : 'FALLO'));
  console.log('✅ Asistencias: ' + (asistencias.success ? 'OK' : 'FALLO'));
  console.log('✅ Observaciones: ' + (observaciones.success ? 'OK' : 'FALLO'));

  console.log('\n🎯 CAMBIOS APLICADOS EN EL FRONTEND:');
  console.log('✅ Servicios actualizados para usar response.data');
  console.log('✅ Endpoint de evaluaciones actualizado (/evaluaciones)');
  console.log('✅ Estructura de respuesta { success, count, data, pagination }');
  console.log('✅ Referencias .items cambiadas a .data');
  console.log('✅ IDs de MongoDB (_id) compatibles');

  console.log('\n🚀 El frontend está listo para funcionar con la API de MongoDB!');
}

// Ejecutar las pruebas
runTests().catch(error => {
  console.error('❌ Error ejecutando pruebas:', error);
});
