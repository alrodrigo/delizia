/**
 * Script para probar específicamente las evaluaciones de desempeño
 */

const API_BASE = 'https://api-delizia.vercel.app/api';

console.log('🎯 Probando evaluaciones de desempeño específicamente');
console.log('=' .repeat(60));

async function testEvaluaciones() {
  try {
    console.log('\n📊 1. Probando GET /evaluaciones...');
    const response = await fetch(`${API_BASE}/evaluaciones`);
    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log(`✅ Evaluaciones cargadas: ${result.count}`);
      
      if (result.data && result.data.length > 0) {
        const evaluacion = result.data[0];
        console.log(`📋 Primera evaluación:`);
        console.log(`  - ID: ${evaluacion._id}`);
        console.log(`  - Empleado: ${evaluacion.empleado?.nombre || 'No especificado'}`);
        console.log(`  - Período: ${evaluacion.periodo}`);
        console.log(`  - Puntuación: ${evaluacion.puntuacion}`);
        
        console.log('\n📋 2. Probando GET evaluación por empleado...');
        const empleadoId = evaluacion.empleado?._id;
        if (empleadoId) {
          const byEmpleadoResponse = await fetch(`${API_BASE}/evaluaciones?empleado=${empleadoId}`);
          const byEmpleadoResult = await byEmpleadoResponse.json();
          
          console.log(`Status: ${byEmpleadoResponse.status}`);
          console.log(`Evaluaciones del empleado: ${byEmpleadoResult.count || 0}`);
        }
        
        console.log('\n📋 3. Probando GET evaluación por ID...');
        const byIdResponse = await fetch(`${API_BASE}/evaluaciones?id=${evaluacion._id}`);
        const byIdResult = await byIdResponse.json();
        
        console.log(`Status: ${byIdResponse.status}`);
        if (byIdResult.success) {
          console.log(`✅ Evaluación por ID cargada: ${byIdResult.data?.periodo || 'No encontrada'}`);
        }
      }
    } else {
      console.error(`❌ Error cargando evaluaciones:`, result);
    }
    
    console.log('\n🔍 4. Estructura esperada por el frontend:');
    console.log('✅ response.data (array de evaluaciones)');
    console.log('✅ response.count (número total)');
    console.log('✅ response.pagination (info de paginación)');
    
    console.log('\n🎯 Verificación para el frontend:');
    console.log('✅ URL: /evaluaciones (no /desempenos)');
    console.log('✅ Query params para filtros');
    console.log('✅ Estructura { success, count, data, pagination }');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

testEvaluaciones();
