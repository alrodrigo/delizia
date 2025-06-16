const mongoose = require('mongoose');

async function testMongoDB() {
  try {
    console.log('🔄 Probando conexión a MongoDB Atlas...');
    
    const mongoUri = 'mongodb+srv://alrodrigo:kzlvbimoEMJF14On@alvaro.q28r0ui.mongodb.net/delizia_db?retryWrites=true&w=majority&appName=Alvaro';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conexión a MongoDB exitosa!');
    
    // Verificar que podemos escribir/leer
    const testSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    // Crear un documento de prueba
    const testDoc = new TestModel({ test: 'Conexión funcionando' });
    await testDoc.save();
    console.log('✅ Documento de prueba creado:', testDoc._id);
    
    // Leer el documento
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Documento leído:', foundDoc.test);
    
    // Limpiar - eliminar el documento de prueba
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('✅ Documento de prueba eliminado');
    
    // Verificar si existe el usuario admin
    const userSchema = new mongoose.Schema({
      nombre: String,
      email: String,
      password: String,
      rol: String
    });
    
    const Usuario = mongoose.model('Usuario', userSchema);
    const adminUser = await Usuario.findOne({ email: 'admin@delizia.com' });
    
    if (adminUser) {
      console.log('✅ Usuario admin encontrado:');
      console.log('   - Email:', adminUser.email);
      console.log('   - Rol:', adminUser.rol);
      console.log('   - ID:', adminUser._id);
    } else {
      console.log('❌ Usuario admin NO encontrado');
    }
    
    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testMongoDB();
