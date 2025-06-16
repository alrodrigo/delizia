// Utilidades generales para la aplicación

// Dar formato a una fecha en formato legible
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Dar formato a la hora
export const formatTime = (dateString) => {
  if (!dateString) return 'Hora no disponible';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Hora inválida';
  
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Truncar texto si es muy largo
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calcular edad a partir de la fecha de nacimiento
export const calculateAge = (birthDateString) => {
  if (!birthDateString) return null;
  
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Formatear número a moneda
export const formatCurrency = (amount, currency = 'BOB') => {
  if (amount === null || amount === undefined) return '---';
  
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Generar iniciales a partir de un nombre
export const getInitials = (name) => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Obtener color en base a una cadena (útil para avatares)
export const stringToColor = (string) => {
  if (!string) return '#000000';
  
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};
