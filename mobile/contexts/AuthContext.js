import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário já está autenticado ao iniciar o app
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
          
          // Configurar o token para todas as requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      // Salvar token e dados do usuário
      await SecureStore.setItemAsync('userToken', access_token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      // Configurar o token para todas as requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setToken(access_token);
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token, user } = response.data;
      
      // Salvar token e dados do usuário
      await SecureStore.setItemAsync('userToken', access_token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      // Configurar o token para todas as requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setToken(access_token);
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Limpar token e dados do usuário
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Remover token das requisições
      delete api.defaults.headers.common['Authorization'];
      
      setToken(null);
      setCurrentUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, message: 'Erro ao fazer logout.' };
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/users/profile', profileData);
      const updatedUser = response.data;
      
      // Atualizar dados do usuário no armazenamento
      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
      
      setCurrentUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao alterar senha. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/forgot-password', { email });
      
      return { 
        success: true, 
        message: 'Instruções para redefinir sua senha foram enviadas para seu e-mail.' 
      };
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao solicitar redefinição de senha. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      
      return { success: true, message: 'Senha redefinida com sucesso!' };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao redefinir senha. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
