#!/bin/bash

# Script para limpiar archivos innecesarios en el workspace
# Autor: GitHub Copilot
# Fecha: 18 de junio de 2025

# Colores para terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================================${NC}"
echo -e "${BLUE}🧹 LIMPIEZA DEL WORKSPACE FRONTEND DELIZIA${NC}"
echo -e "${BLUE}========================================================${NC}"

# Archivos de documentación a mantener
KEEP_DOCS=(
  "CAMBIOS_FRONTEND_MONGODB.md"
  "PROCESO_DESPLIEGUE_FRONTEND.md" 
  "VERIFICACION_INTEGRACION_MONGODB.md"
  "README.md"
)

# Scripts de prueba específicos del frontend a mantener
KEEP_TESTS=(
  "test-frontend-integration.js"
  "test-crud-query-params.js" 
  "test-evaluaciones-frontend.js"
  "test-desempeno-debug.js"
  "test-empleados-update.js"
  "monitor-redeploy.js"
  "verificar-integracion.sh"
)

# Confirmar eliminación
echo -e "${YELLOW}⚠️ Este script eliminará archivos que no son necesarios para el frontend.${NC}"
echo -e "${YELLOW}⚠️ Se mantendrán solo los archivos específicos del frontend.${NC}"
read -p "¿Deseas continuar? (s/n): " confirm
if [[ $confirm != "s" && $confirm != "S" ]]; then
  echo -e "${GREEN}Operación cancelada.${NC}"
  exit 0
fi

# Eliminar directorio backend
if [ -d "backend" ]; then
  echo -e "${YELLOW}Eliminando directorio backend...${NC}"
  rm -rf backend
  echo -e "${GREEN}✅ Directorio backend eliminado${NC}"
fi

# Eliminar directorio api
if [ -d "api" ]; then
  echo -e "${YELLOW}Eliminando directorio api...${NC}"
  rm -rf api
  echo -e "${GREEN}✅ Directorio api eliminado${NC}"
fi

# Eliminar directorio pages si no está vacío
if [ -d "pages" ] && [ "$(ls -A pages)" ]; then
  echo -e "${YELLOW}Eliminando directorio pages...${NC}"
  rm -rf pages
  echo -e "${GREEN}✅ Directorio pages eliminado${NC}"
fi

# Eliminar directorio utils si no está vacío y no es parte del frontend
if [ -d "utils" ] && [ "$(ls -A utils)" ] && [ ! -d "frontend/src/utils" ]; then
  echo -e "${YELLOW}Eliminando directorio utils...${NC}"
  rm -rf utils
  echo -e "${GREEN}✅ Directorio utils eliminado${NC}"
fi

# Eliminar archivos de test innecesarios
echo -e "${YELLOW}Eliminando archivos de prueba innecesarios...${NC}"
for file in test-*.js test-*.html; do
  if [ -f "$file" ]; then
    # Verificar si el archivo está en la lista de mantener
    KEEP=false
    for keep_file in "${KEEP_TESTS[@]}"; do
      if [ "$file" = "$keep_file" ]; then
        KEEP=true
        break
      fi
    done
    
    if [ "$KEEP" = false ]; then
      echo -e "  🗑️  Eliminando $file"
      rm "$file"
    else
      echo -e "  💾 Manteniendo $file"
    fi
  fi
done

# Eliminar archivos de configuración innecesarios
echo -e "${YELLOW}Eliminando archivos de documentación innecesarios...${NC}"
for file in *.md; do
  if [ -f "$file" ]; then
    # Verificar si el archivo está en la lista de mantener
    KEEP=false
    for keep_file in "${KEEP_DOCS[@]}"; do
      if [ "$file" = "$keep_file" ]; then
        KEEP=true
        break
      fi
    done
    
    if [ "$KEEP" = false ]; then
      echo -e "  🗑️  Eliminando $file"
      rm "$file"
    else
      echo -e "  💾 Manteniendo $file"
    fi
  fi
done

echo -e "\n${GREEN}✅ Limpieza completada${NC}"
echo -e "${BLUE}========================================================${NC}"
echo -e "📁 El workspace ahora contiene solo los archivos necesarios para el frontend"
echo -e "📝 Se mantuvieron los archivos de documentación importantes"
echo -e "🧪 Se mantuvieron los scripts de prueba específicos del frontend"
echo -e "${BLUE}========================================================${NC}"
