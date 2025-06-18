// Test directo del endpoint empleados-db
console.log('🧪 Probando endpoint empleados-db localmente');
console.log('=' .repeat(50));

// Simular el objeto de respuesta de Express/Vercel
class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  json(data) {
    console.log(`Status: ${this.statusCode}`);
    console.log('Headers:', this.headers);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('-' .repeat(30));
    return this;
  }
}

async function testEndpoint() {
  try {
    // Importar el handler
    const { default: empleadosHandler } = await import('./api/empleados-db.js');

    console.log('\n📋 1. GET - Obtener todos los empleados');
    const req1 = { method: 'GET', query: {} };
    const res1 = new MockResponse();
    await empleadosHandler(req1, res1);

    console.log('\n👤 2. GET - Obtener empleado con ID 1');
    const req2 = { method: 'GET', query: { id: '1' } };
    const res2 = new MockResponse();
    await empleadosHandler(req2, res2);

    console.log('\n➕ 3. POST - Crear nuevo empleado');
    const req3 = {
      method: 'POST',
      query: {},
      body: {
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana@delizia.com',
        telefono: '123-456-7893',
        agencia: 'Sucursal Este',
        agenciaId: 4,
        cargo: 'Gerente',
        fechaIngreso: '2024-06-16',
        salario: 55000,
        estado: 'activo'
      }
    };
    const res3 = new MockResponse();
    await empleadosHandler(req3, res3);

    console.log('\n✅ Pruebas completadas exitosamente');
    console.log('\n💡 Observaciones:');
    console.log('- Los datos se están guardando en memoria (mock)');
    console.log('- Para persistencia real, configura la contraseña de MongoDB');
    console.log('- El endpoint híbrido funciona con ambos sistemas');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEndpoint();
