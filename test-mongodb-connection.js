import connectToDatabase from './backend/src/config/mongodb.js';

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a MongoDB Atlas...');
    
    const connection = await connectToDatabase();
    console.log('✅ Conexión exitosa a MongoDB Atlas!');
    console.log('📊 Estado de la conexión:', connection.connection.readyState);
    console.log('🏢 Base de datos:', connection.connection.name);
    
    // Cerrar la conexión
    await connection.connection.close();
    console.log('🔌 Conexión cerrada exitosamente');
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    
    if (error.message.includes('MONGODB_URI')) {
      console.log('\n📝 Pasos para configurar:');
      console.log('1. Ve a tu cluster en MongoDB Atlas');
      console.log('2. Haz clic en "Connect" > "Drivers"');
      console.log('3. Copia la connection string');
      console.log('4. Crea un archivo .env.local con:');
      console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    }
  }
}

testConnection();
