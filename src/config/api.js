// Configuração de URLs para desenvolvimento e produção
const config = {
  development: {
    API_URL: 'http://localhost:3001'
  },
  production: {
    API_URL: 'https://recityec-production.up.railway.app'
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_URL = config[environment].API_URL;

export default config;