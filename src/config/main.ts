import "dotenv/config"

// Obtener el puerto desde las variables de entorno
const port = process.env.PORT;

// Validar si la variable PORT está definida
if (!port) {
  throw new Error('Environment variable "PORT" is not set. Please define it in the .env file.');
}

export const serverConfig = {
  PORT: Number(port), 
}
