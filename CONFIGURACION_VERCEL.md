# 🚀 CONFIGURACIÓN VERCEL - PASO A PASO

## 📝 Variables de Entorno para Vercel

Ve a tu proyecto en Vercel y agrega estas variables de entorno:

### 1. Ve a Vercel Dashboard
- Abre https://vercel.com/dashboard
- Selecciona tu proyecto "delizia" o "PaginaDelizia"

### 2. Ve a Settings > Environment Variables

### 3. Agrega esta variable:

**Nombre:** `MONGODB_URI`
**Valor:** `mongodb+srv://adelgadoq:EOt9BLdXCNmZWekA@cluster0.odu4rtq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
**Ambiente:** Marca las 3 opciones (Production, Preview, Development)

### 4. Opcional - JWT Secret:

**Nombre:** `JWT_SECRET`
**Valor:** `delizia_super_secret_key_2024_production`
**Ambiente:** Marca las 3 opciones (Production, Preview, Development)

## 🔄 Después de agregar las variables:

1. Ve a "Deployments" 
2. Haz clic en "Redeploy" en el último deployment
3. O simplemente espera a que Vercel detecte los nuevos archivos de GitHub

## 🧪 URLs para probar:

Una vez que se despliegue, prueba estos endpoints:

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/health

# Obtener empleados (debería mostrar datos de MongoDB)
curl https://tu-proyecto.vercel.app/api/empleados-db

# Crear empleado
curl -X POST https://tu-proyecto.vercel.app/api/empleados-db \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro",
    "apellido": "García",
    "email": "pedro@delizia.com",
    "telefono": "123-456-7894",
    "agencia": "Sucursal Oeste",
    "agenciaId": 5,
    "cargo": "Vendedor",
    "fechaIngreso": "2024-06-18",
    "salario": 32000,
    "estado": "activo"
  }'
```

## 🎯 Actualizar Frontend

El frontend ya está configurado para usar `/api/empleados-db`, pero asegúrate de que en tu archivo de entorno de producción esté:

```
REACT_APP_API_URL=https://tu-proyecto.vercel.app/api
```

## ✅ Verificación

Si todo funciona verás:
- ✅ "Conexión exitosa a MongoDB Atlas" en los logs
- ✅ "Usando MongoDB para empleados" 
- ✅ Los empleados creados se guardan permanentemente
- ✅ Los datos persisten entre recargas de página
