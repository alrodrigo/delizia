# 🚀 Proceso de Despliegue del Frontend Actualizado

## 1. 📋 Preparación para el Despliegue

### 1.1 Verificar cambios en servicios
```bash
# Desde la raíz del proyecto
cd frontend/src/services
# Ver cambios en los archivos de servicios
git diff empleadoService.js agenciaService.js asistenciaService.js desempenoService.js observacionService.js
```

### 1.2 Ejecutar pruebas
```bash
# Desde la raíz del proyecto
node test-frontend-integration.js
node test-evaluaciones-frontend.js
```

### 1.3 Variables de entorno
Verificar que el archivo `.env.production` tenga la configuración correcta:
```
REACT_APP_API_URL=https://api-delizia.vercel.app/api
```

## 2. 🛠️ Build del Frontend

```bash
# Desde la carpeta frontend
cd frontend
npm run build
```

Este comando generará una carpeta `build` con todos los archivos estáticos optimizados.

## 3. 🚀 Opciones de Despliegue

### 3.1 Despliegue con Vercel (Recomendado)

```bash
# Desde la raíz del proyecto
cd frontend
vercel --prod
```

### 3.2 Despliegue manual (Alternativa)
Si prefieres desplegar manualmente usando la interfaz web de Vercel:

1. Abre [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `delizia` o `PaginaDelizia`
3. Ve a la pestaña "Deployments"
4. Haz clic en "Import Project" o "Deploy"
5. Sube la carpeta `build` generada

## 4. ✅ Verificación Post-Despliegue

### 4.1 Verificar endpoints
```bash
# Ejecuta el script de verificación
./verificar-integracion.sh
```

### 4.2 Verificar en el navegador
1. Abre [https://delizia.vercel.app](https://delizia.vercel.app)
2. Inicia sesión y navega por todas las secciones
3. Verifica listado de empleados, agencias, asistencias y evaluaciones
4. Prueba creación y edición de registros

## 5. 🔍 Monitoreo Post-Despliegue

### 5.1 Verificar logs en Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la pestaña "Logs"
4. Revisa si hay errores o advertencias

### 5.2 Monitoreo automático (opcional)
```bash
# Ejecuta el monitor de redeployment
node monitor-redeploy.js
```

## 6. 🔄 Rollback (En caso de problemas)

Si encuentras problemas después del despliegue:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la pestaña "Deployments"
4. Encuentra la versión anterior funcional
5. Haz clic en los tres puntos (⋮) y selecciona "Promote to Production"

## 7. 📝 Documentación

Actualiza la documentación con los cambios realizados:
```bash
# Edita los archivos de documentación
nano CAMBIOS_FRONTEND_MONGODB.md
nano ESTADO_PROYECTO.md
```

## 🎯 Recordatorios Importantes

- ✅ Los servicios deben usar query parameters (`?id=ID`) en lugar de rutas dinámicas (`/ID`)
- ✅ Los datos se encuentran en `response.data` (no en `response.items`)
- ✅ El endpoint para evaluaciones es `/evaluaciones` (no `/desempenos`)
- ✅ Todos los IDs son strings de MongoDB (no números)
- ✅ Usar optional chaining (`?.`) para acceso seguro a datos
