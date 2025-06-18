// Monitor para detectar cuando MongoDB esté funcionando
console.log('🔄 Monitoreando redeploy de API...');
console.log('=' .repeat(50));

import fetch from 'node-fetch';

const API_URL = 'https://api-delizia.vercel.app/api';

async function monitorRedeploy() {
  let intentos = 0;
  const maxIntentos = 20; // 10 minutos de monitoreo
  
  console.log('⏳ Esperando que el redeploy complete...');
  console.log('💡 Esto puede tomar 2-5 minutos');
  
  while (intentos < maxIntentos) {
    intentos++;
    console.log(`\n🔍 Verificación ${intentos}/${maxIntentos} (${new Date().toLocaleTimeString()})`);
    
    try {
      // Crear empleado único para cada prueba
      const timestamp = Date.now();
      const empleadoPrueba = {
        nombre: `Monitor ${timestamp}`,
        email: `monitor${timestamp}@delizia.com`,
        telefono: '111-222-333',
        cargo: 'Monitor',
        agencia: '1',
        fechaIngreso: '2024-06-18',
        salario: 1000,
        activo: true
      };
      
      // Crear empleado
      const createResponse = await fetch(`${API_URL}/empleados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoPrueba),
        timeout: 10000
      });
      
      if (!createResponse.ok) {
        console.log(`❌ API error: ${createResponse.status}`);
        await sleep(30000);
        continue;
      }
      
      const createData = await createResponse.json();
      console.log(`✅ Empleado creado: ${createData.nombre || 'Sin nombre'}`);
      
      // Verificar persistencia después de 3 segundos
      await sleep(3000);
      
      const getResponse = await fetch(`${API_URL}/empleados`, { timeout: 10000 });
      const getData = await getResponse.json();
      
      // Buscar el empleado que acabamos de crear
      const empleadoEncontrado = getData.data?.find(e => 
        e.nombre === empleadoPrueba.nombre || 
        e.email === empleadoPrueba.email
      );
      
      if (empleadoEncontrado) {
        console.log('🎉 ¡MONGODB FUNCIONANDO!');
        console.log('✅ Empleado persistió correctamente');
        console.log('📊 Total empleados:', getData.count);
        console.log('\n🚀 ¡Tu aplicación ya funciona con persistencia real!');
        console.log('🌐 Ve a: https://delizia.vercel.app');
        console.log('💾 Los datos ahora se guardan en MongoDB');
        return true;
      } else {
        console.log('⚠️ Empleado no persistió (aún usando mock)');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Esperar 30 segundos antes del siguiente intento
    if (intentos < maxIntentos) {
      console.log('⏳ Esperando 30 segundos...');
      await sleep(30000);
    }
  }
  
  console.log('\n⏰ Tiempo de monitoreo agotado');
  console.log('💡 El redeploy puede estar tardando más de lo normal');
  console.log('🔧 Verifica en Vercel Dashboard que el deploy haya completado');
  
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

monitorRedeploy();
