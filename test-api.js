// Test directo del API usando fetch nativo de Node 18+
async function testLoginAPI() {
  try {
    console.log('🔄 Probando API de login...');
    
    const response = await fetch('https://delizia-g8p1vl7wl-alvaros-projects-fffd2a04.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@delizia.com',
        password: 'admin123'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ API funcionando correctamente');
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Login exitoso:', jsonData);
      } catch (e) {
        console.log('⚠️  Respuesta no es JSON válido');
      }
    } else {
      console.log('❌ API no funcionando');
    }
    
  } catch (error) {
    console.error('❌ Error de red:', error.message);
  }
}

testLoginAPI();
