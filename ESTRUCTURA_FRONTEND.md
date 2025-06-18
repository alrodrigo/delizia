# 🛠️ Estructura del Frontend y Solución de Inconsistencias con API

## 📋 Modelo de Empleado en el Frontend

El formulario de empleado en el frontend espera los siguientes campos:

| Campo | Tipo | Notas |
|-------|------|-------|
| `nombre` | String | Obligatorio |
| `apellido` | String | Obligatorio |
| `ci` | String | Obligatorio |
| `sexo` | String | "masculino", "femenino", "otro" |
| `edad` | Number | Entero positivo |
| `telefono` | String | |
| `direccion` | String | |
| `fechaNacimiento` | Date | |
| `fechaContratacion` | Date | Por defecto fecha actual |
| `puesto` | String | Obligatorio |
| `cargo` | String | Si está vacío, se usa puesto |
| `agencia` | String/Object | ID de agencia o objeto agencia |
| `antecedentes` | String | |
| `cargosAnteriores` | String | |
| `recomendaciones` | String | |
| `activo` | Boolean | Por defecto true |

## 🔍 Inconsistencias Detectadas

Se han identificado las siguientes inconsistencias entre el frontend y la API:

1. **Campo Email/Correo**:
   - El frontend usa ambos `correo` y `email`
   - La API devuelve `email`
   - Solución: El componente EmpleadoDatosPerfil.js ya maneja esto con `empleado.email || empleado.correo`

2. **Campos Sexo y Edad**:
   - El frontend envía estos campos y espera mostrarlos
   - La API posiblemente no está guardando o devolviendo estos campos
   - Solución: Asegurarse de que estos campos estén incluidos en el modelo de Empleado en la API

3. **Campo Agencia**:
   - El frontend acepta tanto un string (ID) como un objeto (completo)
   - La API devuelve diferentes formatos (a veces string, a veces objeto)
   - Solución: EmpleadoDatosPerfil.js maneja esto con: `typeof empleado.agencia === 'object' ? empleado.agencia?.nombre : empleado.agencia`

## 🔄 Solución para Consistencia de Datos

### 1. Solución en Frontend (Ya Implementada)

El componente EmpleadoDatosPerfil.js ya incluye código para manejar diferentes formatos de datos:

```javascript
// Manejo de correo/email
{ label: 'Correo', value: empleado.email || empleado.correo }

// Manejo de cargo/puesto
{ label: 'Cargo', value: empleado.cargo || empleado.puesto }

// Manejo de agencia como string u objeto
{ label: 'Agencia', value: typeof empleado.agencia === 'object' ? empleado.agencia?.nombre : empleado.agencia }
```

### 2. Estructura de Tabla en MongoDB

La tabla/colección `empleados` en MongoDB debería tener esta estructura:

```javascript
{
  _id: ObjectId,
  nombre: String,
  apellido: String,
  ci: String, 
  sexo: String,
  edad: Number,
  email: String,  // También referenciado como correo en frontend
  telefono: String,
  direccion: String,
  fechaNacimiento: Date,
  fechaContratacion: Date,  // O fechaIngreso
  puesto: String,  // También referenciado como cargo
  cargo: String,
  agencia: { _id: String, nombre: String } | String,
  antecedentes: String,
  cargosAnteriores: String,
  recomendaciones: String,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Recomendación para el Backend

El endpoint de empleados debería:

1. **Al recibir datos (POST/PUT)**:
   - Aceptar todos los campos enviados por el frontend
   - No eliminar campos como `sexo` y `edad` aunque estén vacíos

2. **Al enviar respuestas (GET)**:
   - Incluir todos los campos del modelo
   - Incluir campos con valores null o undefined para que el frontend pueda manejarlos

## 🚀 Despliegue

Para consistencia, asegúrate de que la API desplegada:

1. Acepta todos los campos enviados por el frontend
2. No elimina campos aunque estén vacíos
3. Devuelve una estructura de datos consistente

## 🧹 Organización del Workspace

Se ha creado un script `limpiar-workspace.sh` que elimina todos los archivos innecesarios y mantiene solo lo esencial para el frontend:

```bash
# Ejecutar script de limpieza
./limpiar-workspace.sh
```

El script mantiene:
- Directorio `/frontend` completo
- Documentación relevante (CAMBIOS_FRONTEND_MONGODB.md, etc.)
- Scripts de prueba específicos para el frontend
