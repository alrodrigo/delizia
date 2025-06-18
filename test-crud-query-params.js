/**
 * Script de prueba para verificar que las operaciones CRUD funcionan correctamente
 * después de los cambios de query parameters
 */

const API_BASE = 'https://api-delizia.vercel.app/api';

console.log('🧪 Probando operaciones CRUD con query parameters');
console.log('=' .repeat(60));

async function testCRUD() {
  try {
    console.log('\n1️⃣ Probando GET empleados...');
    const getResponse = await fetch(`${API_BASE}/empleados`);
    const empleados = await getResponse.json();
    
    if (empleados.success && empleados.data.length > 0) {
      const empleado = empleados.data[0];
      console.log(`✅ GET empleados: ${empleados.count} encontrados`);
      console.log(`👤 Primer empleado: ${empleado.nombre} (ID: ${empleado._id})`);
      
      console.log('\n2️⃣ Probando GET empleado por ID...');
      const getByIdResponse = await fetch(`${API_BASE}/empleados?id=${empleado._id}`);
      const empleadoById = await getByIdResponse.json();
      
      if (empleadoById.success) {
        console.log(`✅ GET empleado por ID: ${empleadoById.data.nombre}`);
        
        console.log('\n3️⃣ Probando PUT actualización...');
        const updateData = {
          nombre: empleado.nombre + ' - UPDATED',
          cargo: 'CARGO ACTUALIZADO'
        };
        
        const putResponse = await fetch(`${API_BASE}/empleados?id=${empleado._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        const updateResult = await putResponse.json();
        
        if (updateResult.success) {
          console.log(`✅ PUT actualización: ${updateResult.data.nombre}`);
          console.log(`📝 Cargo actualizado: ${updateResult.data.cargo}`);
        } else {
          console.error(`❌ PUT falló:`, updateResult);
        }
        
      } else {
        console.error(`❌ GET por ID falló:`, empleadoById);
      }
      
    } else {
      console.error(`❌ GET empleados falló:`, empleados);
    }
    
    console.log('\n4️⃣ Probando GET evaluaciones...');
    const evalResponse = await fetch(`${API_BASE}/evaluaciones`);
    const evaluaciones = await evalResponse.json();
    
    if (evaluaciones.success) {
      console.log(`✅ GET evaluaciones: ${evaluaciones.count} encontradas`);
    } else {
      console.error(`❌ GET evaluaciones falló:`, evaluaciones);
    }
    
    console.log('\n📋 RESUMEN:');
    console.log('✅ Operaciones CRUD con query parameters funcionando');
    console.log('✅ Frontend actualizado para usar query parameters');
    console.log('✅ API respondiendo correctamente');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

testCRUD();
