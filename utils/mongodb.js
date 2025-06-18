import { MongoClient } from 'mongodb';

// Connection string directa o desde variables de entorno
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adelgadoq:EOt9BLdXCNmZWekA@cluster0.odu4rtq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let client = null;
let db = null;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
      ssl: true,
      tlsInsecure: false,
      retryWrites: true,
      w: 'majority'
    });

    await client.connect();
    
    // Usar la base de datos 'delizia'
    db = client.db('delizia');
    
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    return { client, db };
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 Conexión cerrada');
  }
}

export { db, client };
