export const getWhatsAppLink = (phoneNumber: string, message?: string): string => {
  // Limpiar el número de cualquier carácter no numérico
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Codificar el mensaje para URL
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  // Construir la URL
  const baseUrl = 'https://wa.me';
  const url = `${baseUrl}/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  
  return url;
};