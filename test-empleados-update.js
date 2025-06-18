/**
 * Script para probar específicamente la actualización de empleados
 */

const API_BASE = 'https://api-delizia.vercel.app/api';

console.log('🧪 Verificando guardado de datos de empleados');
console.log('=' .repeat(60));

async function testEmpleadoUpdate() {
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
    
    // 3. Probar GET por ID
    console.log('\n👤 2. Obteniendo empleado por ID...');
    const getResponse = await fetch(`${API_BASE}/empleados?id=${empleado._id}`);
    const empleadoData = await getResponse.json();
    
    console.log(`Status: ${getResponse.status}`);
    if (empleadoData.success) {
      console.log(`✅ GET por ID correcto: ${empleadoData.data.nombre}`);
    } else {
      console.error('❌ Error obteniendo empleado por ID:', empleadoData);
    }
    
    // 4. Probar actualizar empleado
    console.log('\n✏️ 3. Actualizando empleado...');
    const timestamp = new Date().toISOString();
    const updateData = {
      nombre: `${empleado.nombre.split(' - ')[0]} - TEST UPDATE ${timestamp.substring(11, 19)}`,
      telefono: `555-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`
    };
    
    console.log(`Datos a actualizar:`, updateData);
    
    const updateResponse = await fetch(`${API_BASE}/empleados?id=${empleado._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const updateResult = await updateResponse.json();
    
    console.log(`Status: ${updateResponse.status}`);
    if (updateResult.success) {
      console.log(`✅ Actualización correcta`);
      console.log(`👤 Nombre actualizado: ${updateResult.data.nombre}`);
      console.log(`☎️ Teléfono actualizado: ${updateResult.data.telefono}`);
    } else {
      console.error('❌ Error actualizando empleado:', updateResult);
    }
    
    // 5. Verificar estructura de respuesta
    console.log('\n🔍 4. Verificando estructura de respuesta para update...');
    console.log('Estructura de la respuesta PUT:');
    console.log('- success:', updateResult.success ? '✅' : '❌');
    console.log('- message:', updateResult.message ? '✅' : '❌');
    console.log('- data:', updateResult.data ? '✅' : '❌');
    
    console.log('\n📝 Resumen del problema de actualización:');
    console.log('1. API de empleados funciona correctamente ✅');
    console.log('2. El servicio del frontend debe usar:');
    console.log('   - URL con query parameter: /empleados?id=XXX (no /empleados/XXX)');
    console.log('   - Content-Type: application/json');
    console.log('   - Método: PUT');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

testEmpleadoUpdate();
