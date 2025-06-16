// Test del frontend para diagnosticar problemas de API
async function testFrontendAPI() {
  try {
    console.log('🔄 Probando API desde el frontend...');
    
    // Primero probar el endpoint raíz
    console.log('\n1. Probando endpoint raíz...');
    const testResponse = await fetch('https://delizia.vercel.app/api/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Status raíz:', testResponse.status);
    console.log('Headers raíz:', Object.fromEntries(testResponse.headers.entries()));
    const rootData = await testResponse.text();
    console.log('Response raíz:', rootData.substring(0, 200) + '...');
    
    // Luego probar el login
    console.log('\n2. Probando login...');
    const loginResponse = await fetch('https://delizia.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@delizia.com',
        password: 'admin123'
      })
    });
    
    console.log('Status login:', loginResponse.status);
    console.log('Headers login:', Object.fromEntries(loginResponse.headers.entries()));
    const loginData = await loginResponse.text();
    console.log('Response login:', loginData);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login funcionando');
      try {
        const jsonData = JSON.parse(loginData);
        console.log('Token recibido:', jsonData.token ? 'SÍ' : 'NO');
        console.log('Usuario:', jsonData.usuario);
      } catch (e) {
        console.log('❌ Respuesta no es JSON válido');
      }
    } else {
      console.log('❌ Login no funcionando');
    }
    
    // Probar registro
    console.log('\n3. Probando registro...');
    const registerResponse = await fetch('https://delizia.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Usuario Test',
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log('Status registro:', registerResponse.status);
    const registerData = await registerResponse.text();
    console.log('Response registro:', registerData);
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
  }
}

testFrontendAPI();
