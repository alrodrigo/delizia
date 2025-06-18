# 🚀 Configuración de MongoDB Atlas para Delizia

## Paso 1: Obtener la Connection String de MongoDB Atlas

### En tu cluster de MongoDB Atlas:

1. **Haz clic en "Connect"** (botón azul en tu cluster)
2. **Selecciona "Drivers"** (no "Compass" ni "Shell")
3. **Selecciona Node.js** como driver
4. **Copia la connection string** que se parece a:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 2: Configurar la Connection String

1. **Reemplaza `<username>` y `<password>`** con tus credenciales
2. **Agrega el nombre de la base de datos** después de `.net/`:
   ```
   mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/delizia?retryWrites=true&w=majority
   ```

### Paso 3: Configurar Variables de Entorno

**Opción A: Archivo Local (.env.local)**
```bash
# Edita el archivo .env.local
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/delizia?retryWrites=true&w=majority
```

**Opción B: Variables de Entorno de Vercel (para producción)**
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ir a Settings > Environment Variables
3. Agregar nueva variable:
   - **Name:** `MONGODB_URI`
   - **Value:** tu connection string completa

## Paso 4: Probar la Conexión

```bash
# Ejecutar test de conexión
node test-mongodb-connection.js
```

Si ves "✅ Conexión exitosa a MongoDB Atlas!" estás listo.

## Paso 5: Inicializar Datos de Prueba

Una vez desplegado, puedes inicializar datos haciendo una petición POST a:
```
https://tu-dominio.vercel.app/api/init-data
```

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Desplegar a Vercel
vercel --prod

# Probar endpoint localmente
curl -X GET "http://localhost:3000/api/empleados?action=list&page=1&limit=10"
```

## 📋 Endpoints Disponibles

### Empleados
- `GET /api/empleados?action=list` - Listar empleados
- `GET /api/empleados?action=get&id=ID` - Obtener empleado
- `POST /api/empleados?action=create` - Crear empleado
- `PUT /api/empleados?action=update&id=ID` - Actualizar empleado
- `DELETE /api/empleados?action=delete&id=ID` - Eliminar empleado

### Agencias
- `GET /api/agencias?action=list` - Listar agencias
- `GET /api/agencias?action=get&id=ID` - Obtener agencia
- `POST /api/agencias?action=create` - Crear agencia
- `PUT /api/agencias?action=update&id=ID` - Actualizar agencia
- `DELETE /api/agencias?action=delete&id=ID` - Eliminar agencia

## ⚠️ Importante

1. **Nunca subas archivos .env*** a Git
2. **Usa variables de entorno en Vercel** para producción
3. **La base de datos estará vacía inicialmente** - usa `/api/init-data` para crear datos de prueba
4. **Los datos son persistentes** - se mantendrán entre despliegues

## 🆘 Troubleshooting

### Error: "MONGODB_URI is not defined"
- Verifica que hayas configurado la variable de entorno
- En local: archivo `.env.local`
- En Vercel: Environment Variables en el dashboard

### Error: "Authentication failed"
- Verifica usuario y contraseña en la connection string
- Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "Network timeout"
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- O configura acceso desde cualquier IP (0.0.0.0/0) para Vercel
