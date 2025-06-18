// Test rápido con timeout para evitar congelamiento
console.log('🧪 Probando conexión MongoDB con timeout');
console.log('=' .repeat(50));

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://adelgadoq:EOt9BLdXCNmZWekA@cluster0.odu4rtq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function testWithTimeout() {
  let client = null;
  
  try {
    console.log('🔄 Conectando con timeout de 5 segundos...');
    
    // Crear cliente con timeout más corto
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // 5 segundos máximo
      connectTimeoutMS: 5000,          // 5 segundos para conectar
      socketTimeoutMS: 5000,           // 5 segundos para operaciones
      maxPoolSize: 1,                  // Solo una conexión
      minPoolSize: 0
    });

    // Conectar con timeout manual adicional
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de conexión')), 5000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    
    console.log('✅ ¡Conexión exitosa!');
    
    // Probar una operación simple
    const db = client.db('delizia');
    const collection = db.collection('test');
    
    console.log('📝 Insertando documento de prueba...');
    const result = await collection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Conexión funcionando' 
    });
    
    console.log('✅ Documento insertado:', result.insertedId);
    
    // Leer el documento
    const doc = await collection.findOne({ _id: result.insertedId });
    console.log('📖 Documento leído:', doc);
    
    // Limpiar
    await collection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Documento eliminado');
    
    console.log('\n🎉 ¡TODO FUNCIONA PERFECTAMENTE!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Timeout')) {
      console.log('\n💡 La conexión está tardando mucho. Posibles causas:');
      console.log('1. Problemas de red o firewall');
      console.log('2. IP no está en whitelist');
      console.log('3. Cluster está pausado');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Error de autenticación:');
      console.log('1. Verifica usuario y contraseña');
      console.log('2. Verifica que el usuario tenga permisos');
    }
    
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('🔌 Conexión cerrada');
      } catch (e) {
        console.log('⚠️ Error cerrando conexión:', e.message);
      }
    }
    
    // Forzar salida del proceso
    process.exit(0);
  }
}

testWithTimeout();
