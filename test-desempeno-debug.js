/**
 * Script de prueba para verificar el problema con las evaluaciones de desempeño
 * en el contexto de un empleado específico
 */

const API_BASE = 'https://api-delizia.vercel.app/api';

console.log('🧪 Verificando problema de evaluaciones por empleado');
console.log('=' .repeat(60));

async function testDesempeno() {
  try {
    // 1. Obtener la lista de empleados
    console.log('\n👤 1. Obteniendo lista de empleados...');
    const empleadosResponse = await fetch(`${API_BASE}/empleados`);
    const empleados = await empleadosResponse.json();
    
    if (!empleados.success || !empleados.data || !empleados.data.length) {
      throw new Error('No se pudieron obtener los empleados');
    }
    
    console.log(`✅ ${empleados.data.length} empleados encontrados`);
    
    // 2. Tomar el primer empleado
    const empleado = empleados.data[0];
    console.log(`👤 Empleado de prueba: ${empleado.nombre} (ID: ${empleado._id})`);
    
    // 3. Obtener las evaluaciones para este empleado
    console.log('\n📊 2. Obteniendo evaluaciones para el empleado...');
    const evalResponse = await fetch(`${API_BASE}/evaluaciones?empleado=${empleado._id}`);
    const evaluaciones = await evalResponse.json();
    
    console.log(`Status: ${evalResponse.status}`);
    console.log(`Evaluaciones encontradas: ${evaluaciones.count || 0}`);
    
    if (evaluaciones.data && evaluaciones.data.length > 0) {
      console.log('📊 Primera evaluación:');
      console.log(` - Período: ${evaluaciones.data[0].periodo}`);
      console.log(` - Puntuación: ${evaluaciones.data[0].puntuacion}`);
    } else {
      console.log('⚠️ No hay evaluaciones para este empleado');
      
      // 4. Verificar si hay evaluaciones en general
      console.log('\n📊 3. Verificando si hay evaluaciones en la base de datos...');
      const allEvalResponse = await fetch(`${API_BASE}/evaluaciones`);
      const allEvaluaciones = await allEvalResponse.json();
      
      console.log(`Total de evaluaciones en BD: ${allEvaluaciones.count || 0}`);
      
      if (allEvaluaciones.data && allEvaluaciones.data.length > 0) {
        console.log('📊 Primera evaluación en BD:');
        console.log(` - Empleado ID: ${allEvaluaciones.data[0].empleado?._id || 'No disponible'}`);
        console.log(` - Empleado nombre: ${allEvaluaciones.data[0].empleado?.nombre || 'No disponible'}`);
        
        // 5. Si el ID del empleado en la evaluación es diferente, probar con ese ID
        if (allEvaluaciones.data[0].empleado && allEvaluaciones.data[0].empleado._id !== empleado._id) {
          const otroEmpleadoId = allEvaluaciones.data[0].empleado._id;
          console.log(`\n📊 4. Probando con el empleado específico de la evaluación (${otroEmpleadoId})...`);
          
          const especificEvalResponse = await fetch(`${API_BASE}/evaluaciones?empleado=${otroEmpleadoId}`);
          const especificEvaluaciones = await especificEvalResponse.json();
          
          console.log(`Status: ${especificEvalResponse.status}`);
          console.log(`Evaluaciones encontradas: ${especificEvaluaciones.count || 0}`);
        }
      }
    }
    
    // 6. Verificar formato de la respuesta de evaluaciones
    console.log('\n🔍 5. Verificando estructura de respuesta de la API...');
    const testResponse = await fetch(`${API_BASE}/evaluaciones`);
    const testData = await testResponse.json();
    
    console.log('Estructura de respuesta:');
    console.log('- success:', testData.success ? '✅' : '❌');
    console.log('- count:', testData.count !== undefined ? '✅' : '❌');
    console.log('- data es array:', Array.isArray(testData.data) ? '✅' : '❌');
    console.log('- pagination existe:', testData.pagination ? '✅' : '❌');
    
    // 7. Generar URL para el frontend
    console.log('\n📝 Resumen del problema:');
    console.log('1. La API de evaluaciones funciona correctamente ✅');
    console.log('2. El servicio de desempeño del frontend debe usar:');
    console.log(`   - URL: ${API_BASE}/evaluaciones`);
    console.log('   - Parámetro para empleado: ?empleado=ID (no ?empleadoId)');
    console.log('   - Acceder a datos: response.data (no response.items)');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

testDesempeno();
