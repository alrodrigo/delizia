// Script para verificar que MongoDB funciona en la API
console.log('🔄 Verificando MongoDB en API después de configurar variable...');
console.log('=' .repeat(60));

import fetch from 'node-fetch';

const API_URL = 'https://api-delizia.vercel.app/api';

async function testMongoDB() {
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n🔍 Intento ${attempts}/${maxAttempts}...`);
    
    try {
      // 1. Verificar que la API responde
      console.log('📡 Verificando conectividad...');
      const healthResponse = await fetch(`${API_URL}`, { 
        timeout: 10000 
      });
      
      if (!healthResponse.ok) {
        console.log(`❌ API no responde: ${healthResponse.status}`);
        console.log('⏳ Esperando 30 segundos para reintentar...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        continue;
      }
      
      console.log('✅ API responde correctamente');
      
      // 2. Obtener empleados actuales
      console.log('📋 Obteniendo empleados actuales...');
      const empleadosResponse = await fetch(`${API_URL}/empleados`);
      const empleadosData = await empleadosResponse.json();
      
      console.log(`📊 Empleados encontrados: ${empleadosData.count || 0}`);
      console.log('👥 Lista actual:', empleadosData.data?.map(e => e.nombre) || []);
      
      // 3. Crear empleado de prueba
      console.log('\n➕ Creando empleado de prueba...');
      const nuevoEmpleado = {
        nombre: `Test MongoDB ${Date.now()}`,
        email: `test${Date.now()}@delizia.com`,
        telefono: '999-888-777',
        cargo: 'MongoDB Tester',
        agencia: '1',
        fechaIngreso: '2024-06-18',
        salario: 6000,
        activo: true
      };
      
      const createResponse = await fetch(`${API_URL}/empleados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEmpleado),
      });
      
      if (!createResponse.ok) {
        console.log('❌ Error creando empleado:', createResponse.status);
        continue;
      }
      
      const createData = await createResponse.json();
      console.log('✅ Empleado creado:', createData.nombre || 'Sin nombre');
      const empleadoId = createData._id;
      
      // 4. Verificar persistencia
      console.log('\n🔍 Verificando persistencia...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
      
      const verificarResponse = await fetch(`${API_URL}/empleados`);
      const verificarData = await verificarResponse.json();
      
      const empleadoEncontrado = verificarData.data?.find(e => e._id === empleadoId);
      
      if (empleadoEncontrado) {
        console.log('🎉 ¡ÉXITO! El empleado se guardó en MongoDB');
        console.log('✅ Persistencia funcionando correctamente');
        console.log('📄 Empleado:', empleadoEncontrado.nombre);
        return true;
      } else {
        console.log('❌ El empleado NO se guardó (usando datos mock)');
        console.log('⚠️ MongoDB no está conectado correctamente');
      }
      
      break;
      
    } catch (error) {
      console.log(`❌ Error en intento ${attempts}:`, error.message);
      
      if (attempts < maxAttempts) {
        console.log('⏳ Esperando 30 segundos para reintentar...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }
  
  console.log('\n💡 Si sigue fallando:');
  console.log('1. Verifica que la variable MONGODB_URI esté configurada');
  console.log('2. Fuerza un redeploy en Vercel');
  console.log('3. Espera unos minutos más para que propague');
  
  return false;
}

testMongoDB();
