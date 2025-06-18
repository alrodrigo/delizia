#!/bin/bash

# Script para verificar integración frontend-MongoDB
# Autor: Rodrigo
# Uso: ./verificar-integracion.sh

# Colores para terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================================${NC}"
echo -e "${BLUE}🧪 VERIFICADOR DE INTEGRACIÓN FRONTEND-MONGODB DELIZIA${NC}"
echo -e "${BLUE}========================================================${NC}"

# Verificar conexión a la API
echo -e "\n${BLUE}1. Verificando conexión a la API...${NC}"
API_URL="https://api-delizia.vercel.app/api/health"
echo -e "Conectando a ${API_URL}"

HEALTH_RESPONSE=$(curl -s "$API_URL")
if [[ "$HEALTH_RESPONSE" == *"\"success\":true"* ]]; then
  echo -e "${GREEN}✅ API respondiendo correctamente${NC}"
else
  echo -e "${RED}❌ Error: API no responde correctamente${NC}"
  echo -e "Respuesta: $HEALTH_RESPONSE"
fi

# Verificar endpoints principales
echo -e "\n${BLUE}2. Verificando endpoints principales...${NC}"

endpoints=("empleados" "agencias" "evaluaciones" "asistencias" "observaciones")

for endpoint in "${endpoints[@]}"; do
  echo -e "\nProbando endpoint: /api/$endpoint"
  
  RESPONSE=$(curl -s "https://api-delizia.vercel.app/api/$endpoint")
  
  # Mostrar respuesta resumida
  SUCCESS=$(echo $RESPONSE | grep -o '"success":true' || echo "")
  COUNT=$(echo $RESPONSE | grep -o '"count":[0-9]*' || echo "")
  
  if [[ "$SUCCESS" != "" ]]; then
    echo -e "${GREEN}✅ Endpoint /api/$endpoint responde correctamente${NC}"
    echo -e "${GREEN}   $COUNT${NC}"
  else
    echo -e "${RED}❌ Error en endpoint /api/$endpoint${NC}"
    echo -e "   Respuesta: ${RESPONSE:0:100}..."
  fi
done

# Verificar servicio específico de empleados-db (híbrido)
echo -e "\n${BLUE}3. Verificando servicio híbrido empleados-db...${NC}"
EMPLEADOS_DB_RESPONSE=$(curl -s "https://api-delizia.vercel.app/api/empleados-db")

if [[ "$EMPLEADOS_DB_RESPONSE" == *"\"success\":true"* ]]; then
  echo -e "${GREEN}✅ Servicio híbrido empleados-db funcionando${NC}"
  # Determinar si está usando MongoDB
  if [[ "$EMPLEADOS_DB_RESPONSE" == *"\"usingMongoDB\":true"* ]]; then
    echo -e "${GREEN}✅ Usando MongoDB (persistencia real)${NC}"
  else
    echo -e "${RED}⚠️ Usando datos mock (no persistente)${NC}"
  fi
else
  echo -e "${RED}❌ Error en servicio híbrido empleados-db${NC}"
fi

# Instrucciones para pruebas manuales
echo -e "\n${BLUE}4. Instrucciones para pruebas en el frontend:${NC}"
echo -e "1. Abre https://delizia.vercel.app en el navegador"
echo -e "2. Inicia sesión con las credenciales proporcionadas"
echo -e "3. Verifica el listado de empleados, agencias y evaluaciones"
echo -e "4. Intenta crear un nuevo registro para probar la persistencia"

echo -e "\n${BLUE}5. Scripts de prueba disponibles:${NC}"
echo -e "${GREEN}node test-frontend-integration.js${NC} - Prueba completa de integración"
echo -e "${GREEN}node test-evaluaciones-frontend.js${NC} - Prueba específica para evaluaciones"
echo -e "${GREEN}node test-crud-query-params.js${NC} - Prueba de operaciones CRUD con query params"

echo -e "\n${BLUE}========================================================${NC}"
echo -e "${GREEN}✅ Verificación completada${NC}"
echo -e "${BLUE}========================================================${NC}"
