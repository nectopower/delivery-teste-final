import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import api from '../services/api';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Carregar pedidos quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setError('Não foi possível carregar seus pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  const getOrderById = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/orders/${orderId}`);
      setCurrentOrder(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      setError('Não foi possível carregar os detalhes do pedido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    if (!isAuthenticated) {
      throw new Error('Você precisa estar logado para fazer um pedido');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/orders', orderData);
      const newOrder = response.data;
      
      // Adicionar o novo pedido à lista
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      setCurrentOrder(newOrder);
      
      return newOrder;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      const errorMessage = error.response?.data?.message || 'Não foi possível criar o pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post(`/orders/${orderId}/cancel`);
      
      // Atualizar o status do pedido na lista
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'CANCELLED' } : order
        )
      );
      
      // Atualizar o pedido atual se for o mesmo
      if (currentOrder?.id === orderId) {
        setCurrentOrder(prev => ({ ...prev, status: 'CANCELLED' }));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      const errorMessage = error.response?.data?.message || 'Não foi possível cancelar o pedido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const rateOrder = async (orderId, rating, comment = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/orders/${orderId}/rate`, { rating, comment });
      
      // Atualizar o pedido na lista
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, rating, comment, isRated: true } : order
        )
      );
      
      // Atualizar o pedido atual se for o mesmo
      if (currentOrder?.id === orderId) {
        setCurrentOrder(prev => ({ ...prev, rating, comment, isRated: true }));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao avaliar pedido:', error);
      const errorMessage = error.response?.data?.message || 'Não foi possível avaliar o pedido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const rateDeliveryPerson = async (orderId, rating, comment = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/orders/${orderId}/rate-delivery`, { rating, comment });
      
      // Atualizar o pedido na lista
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, deliveryRating: rating, deliveryComment: comment, isDeliveryRated: true } : order
        )
      );
      
      // Atualizar o pedido atual se for o mesmo
      if (currentOrder?.id === orderId) {
        setCurrentOrder(prev => ({ 
          ...prev, 
          deliveryRating: rating, 
          deliveryComment: comment, 
          isDeliveryRated: true 
        }));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao avaliar entregador:', error);
      const errorMessage = error.response?.data?.message || 'Não foi possível avaliar o entregador';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getActiveOrders = () => {
    const activeStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'];
    return orders.filter(order => activeStatuses.includes(order.status));
  };

  const getPastOrders = () => {
    const completedStatuses = ['DELIVERED', 'CANCELLED'];
    return orders.filter(order => completedStatuses.includes(order.status));
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      PREPARING: 'Em preparo',
      READY: 'Pronto para entrega',
      OUT_FOR_DELIVERY: 'Saiu para entrega',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado'
    };
    
    return statusMap[status] || status;
  };

  const getOrderStatusColor = (status) => {
    const colorMap = {
      PENDING: '#FFA500', // Laranja
      CONFIRMED: '#3498DB', // Azul
      PREPARING: '#9B59B6', // Roxo
      READY: '#2ECC71', // Verde
      OUT_FOR_DELIVERY: '#1ABC9C', // Verde-água
      DELIVERED: '#27AE60', // Verde escuro
      CANCELLED: '#E74C3C' // Vermelho
    };
    
    return colorMap[status] || '#666';
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        refreshing,
        error,
        fetchOrders,
        refreshOrders,
        getOrderById,
        createOrder,
        cancelOrder,
        rateOrder,
        rateDeliveryPerson,
        getActiveOrders,
        getPastOrders,
        getOrderStatusText,
        getOrderStatusColor
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
