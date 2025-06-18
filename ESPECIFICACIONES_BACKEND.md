# 📋 Especificaciones para el Backend - Modelo de Datos

## 🔄 Estructura de Datos del Empleado

Para mantener consistencia entre frontend y backend, el modelo de Empleado debe incluir estos campos:

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `_id` | ObjectId | ID generado por MongoDB | "68532ca13781d5ed8767d00f" |
| `nombre` | String | Nombre del empleado | "Carlos" |
| `apellido` | String | Apellido del empleado | "Pérez" |
| `ci` | String | Cédula de identidad | "12345678" |
| `sexo` | String | Género (masculino, femenino, otro) | "masculino" |
| `edad` | Number | Edad numérica | 35 |
| `email` | String | Correo electrónico | "carlos@delizia.com" |
| `telefono` | String | Número telefónico | "555-617-9695" |
| `direccion` | String | Dirección postal | "Av. Principal 123" |
| `fechaNacimiento` | Date | Fecha de nacimiento | "1990-05-15T00:00:00.000Z" |
| `fechaIngreso` | Date | Fecha de contratación | "2024-01-01T00:00:00.000Z" |
| `puesto` | String | Puesto oficial | "Gerente de Ventas" |
| `cargo` | String | Cargo actual (puede ser igual al puesto) | "Gerente de Ventas" |
| `agencia` | Mixed | ID de agencia o objeto completo | "12345" o {_id: "12345", nombre: "Sucursal Centro"} |
| `salario` | Number | Salario en formato numérico | 45000 |
| `antecedentes` | String | Información de antecedentes | "Experiencia previa en..." |
| `cargosAnteriores` | String | Historial de cargos | "Vendedor (2018-2020), Supervisor (2020-2022)" |
| `recomendaciones` | String | Recomendaciones profesionales | "Excelente capacidad de liderazgo..." |
| `activo` | Boolean | Estado del empleado | true |

## 🔄 Estructura de Datos de la Agencia

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `_id` | ObjectId | ID generado por MongoDB | "685334b499a748d64a31091d" |
| `nombre` | String | Nombre de la agencia | "Sucursal Centro" |
| `direccion` | String | Dirección física | "Av. Principal 123" |
| `telefono` | String | Teléfono de contacto | "555-0001" |
| `email` | String | Correo electrónico | "centro@delizia.com" |
| `gerente` | String | Nombre del gerente | "María González" |
| `activa` | Boolean | Estado de la agencia | true |

## 🔄 Estructura de Datos de la Evaluación (Desempeño)

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `_id` | ObjectId | ID generado por MongoDB | "6853322866e13df1b366f567" |
| `empleado` | Mixed | ID de empleado u objeto | "68532ca13781d5ed8767d00f" o {_id: "68532ca13781d5ed8767d00f", nombre: "Carlos"} |
| `periodo` | String | Periodo evaluado | "2025-06" |
| `puntuacion` | Number | Puntuación general | 85 |
| `puntualidad` | Number | Evaluación de puntualidad (1-5) | 4 |
| `proactividad` | Number | Evaluación de proactividad (1-5) | 3 |
| `calidadServicio` | Number | Evaluación de calidad (1-5) | 5 |
| `observaciones` | String | Comentarios sobre la evaluación | "Excelente rendimiento..." |
| `fechaEvaluacion` | Date | Fecha de la evaluación | "2025-06-18T00:00:00.000Z" |
| `evaluador` | String | Persona que evalúa | "Test Manager" |
| `metas` | Object | Objetivos específicos | {ventas: 90, atencionCliente: 88} |

## 🔄 Estructura de Datos de Asistencia

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `_id` | ObjectId | ID generado por MongoDB | "685334db10d404de7f86e246" |
| `empleado` | Mixed | ID de empleado u objeto | "68532ca13781d5ed8767d00f" o {_id: "68532ca13781d5ed8767d00f", nombre: "Carlos"} |
| `fecha` | Date | Fecha de asistencia | "2025-06-18T00:00:00.000Z" |
| `horaEntrada` | String | Hora de llegada | "08:30" |
| `horaSalida` | String | Hora de salida | "17:30" |
| `estado` | String | Estado (presente, ausente, tardanza) | "tardanza" |
| `observaciones` | String | Comentarios adicionales | "Llegó tarde por tráfico intenso" |

## 🔄 Estructura de Datos de Observación

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `_id` | ObjectId | ID generado por MongoDB | "6853322961719f5289c10dcc" |
| `empleado` | Mixed | ID de empleado u objeto | "68532ca13781d5ed8767d00f" o {_id: "68532ca13781d5ed8767d00f", nombre: "Carlos"} |
| `fecha` | Date | Fecha de la observación | "2025-06-18T00:00:00.000Z" |
| `tipo` | String | Tipo (positiva, correctiva) | "positiva" |
| `categoria` | String | Categoría | "Productividad" |
| `descripcion` | String | Descripción detallada | "Excelente trabajo en proyecto..." |
| `observador` | String | Persona que observa | "Test Supervisor" |

## 🔗 Endpoints API Necesarios

### 1. Empleados

```
GET    /api/empleados                    # Obtener lista de empleados
GET    /api/empleados?id={id}            # Obtener empleado por ID
GET    /api/empleados?agencia={id}       # Filtrar por agencia
POST   /api/empleados                    # Crear empleado
PUT    /api/empleados?id={id}            # Actualizar empleado
DELETE /api/empleados?id={id}            # Eliminar empleado (soft delete)
```

### 2. Agencias

```
GET    /api/agencias                     # Obtener lista de agencias
GET    /api/agencias?id={id}             # Obtener agencia por ID
POST   /api/agencias                     # Crear agencia
PUT    /api/agencias?id={id}             # Actualizar agencia
DELETE /api/agencias?id={id}             # Eliminar agencia (soft delete)
```

### 3. Evaluaciones (Desempeño)

```
GET    /api/evaluaciones                 # Obtener lista de evaluaciones
GET    /api/evaluaciones?id={id}         # Obtener evaluación por ID
GET    /api/evaluaciones?empleado={id}   # Filtrar por empleado
POST   /api/evaluaciones                 # Crear evaluación
PUT    /api/evaluaciones?id={id}         # Actualizar evaluación
DELETE /api/evaluaciones?id={id}         # Eliminar evaluación
```

### 4. Asistencias

```
GET    /api/asistencias                  # Obtener lista de asistencias
GET    /api/asistencias?id={id}          # Obtener asistencia por ID
GET    /api/asistencias?empleado={id}    # Filtrar por empleado
POST   /api/asistencias                  # Crear asistencia
PUT    /api/asistencias?id={id}          # Actualizar asistencia
DELETE /api/asistencias?id={id}          # Eliminar asistencia
```

### 5. Observaciones

```
GET    /api/observaciones                # Obtener lista de observaciones
GET    /api/observaciones?id={id}        # Obtener observación por ID
GET    /api/observaciones?empleado={id}  # Filtrar por empleado
POST   /api/observaciones                # Crear observación
PUT    /api/observaciones?id={id}        # Actualizar observación
DELETE /api/observaciones?id={id}        # Eliminar observación
```

## 📊 Formato de Respuesta API

Todas las respuestas de la API deben seguir este formato consistente:

```javascript
{
  "success": true,           // Boolean: estado de la operación
  "count": 5,                // Number: cantidad de registros (solo en listas)
  "data": [...] | {...},     // Array u Object: datos solicitados
  "pagination": {            // Object: información de paginación (opcional)
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10
  },
  "message": "..."           // String: mensaje descriptivo (opcional)
}
```

## ⚠️ Puntos Críticos a Tener en Cuenta

1. **Campos Consistentes**: Mantener todos los campos en el mismo formato y nombre.

2. **IDs de MongoDB**: Los IDs deben ser strings compatibles con MongoDB.

3. **Campos Relacionales**: Para campos como `empleado` o `agencia`, mantener consistencia en el formato (ya sea ID o objeto).

4. **No Renombrar Campos**: Mantener los mismos nombres de campos entre frontend y backend.

5. **Mantener Campos Vacíos**: No eliminar campos vacíos, devolver null o valor por defecto.

6. **Query Parameters**: Usar siempre query parameters (`?id=123`) en lugar de rutas dinámicas (`/123`).
