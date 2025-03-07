import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Criar instância do axios com configurações base
const api = axios.create({
  // URL que pode ser acessada de qualquer rede
  baseURL: 'http://192.168.1.100:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação a todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Erro ao adicionar token à requisição:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (Não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Limpar dados de autenticação
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        delete api.defaults.headers.common['Authorization'];
        
        // Redirecionar para login (isso deve ser tratado no componente)
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        
        // Limpar dados de autenticação
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        delete api.defaults.headers.common['Authorization'];
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Função para atualizar a URL base (útil para testes ou ambientes diferentes)
export const updateBaseURL = (newBaseURL) => {
  api.defaults.baseURL = newBaseURL;
};

// Função para verificar a conectividade com o backend
export const checkConnection = async () => {
  try {
    const response = await api.get('/health');
    return { connected: true, status: response.status };
  } catch (error) {
    console.error('Erro ao verificar conexão com o backend:', error);
    return { connected: false, error };
  }
};

export default api;
