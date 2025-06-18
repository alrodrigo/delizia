import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://rodrigoorozco:MwAMgT4sT9JGNxeD@deliziacluster.3qgvb.mongodb.net/delizia?retryWrites=true&w=majority&appName=DeliziaCluster';

async function testConnection() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    console.log('📊 Estado:', mongoose.connection.readyState);
    console.log('🏢 Base de datos:', mongoose.connection.name);
    
    // Crear una colección de prueba
    const testSchema = new mongoose.Schema({
      nombre: String,
      fecha: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', testSchema);
    const nuevoTest = new Test({ nombre: 'Prueba de conexión' });
    await nuevoTest.save();
    
    console.log('✅ Documento de prueba creado exitosamente');
    
    // Limpiar
    await Test.deleteOne({ _id: nuevoTest._id });
    console.log('🧹 Documento de prueba eliminado');
    
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Código de error:', error.code);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Posibles soluciones:');
      console.log('1. Verifica tu conexión a internet');
      console.log('2. Verifica que el cluster esté activo en MongoDB Atlas');
      console.log('3. Verifica las reglas de firewall/IP whitelist');
    }
  }
}

testConnection();
