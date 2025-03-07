import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurantId, setCartRestaurantId] = useState(null);
  const [cartRestaurantInfo, setCartRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar carrinho do armazenamento local ao iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Salvar carrinho no armazenamento local quando mudar
  useEffect(() => {
    saveCart();
  }, [cartItems, cartRestaurantId, cartRestaurantInfo]);

  const loadCart = async () => {
    try {
      const storedCart = await SecureStore.getItemAsync('cartItems');
      const storedRestaurantId = await SecureStore.getItemAsync('cartRestaurantId');
      const storedRestaurantInfo = await SecureStore.getItemAsync('cartRestaurantInfo');
      
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      
      if (storedRestaurantId) {
        setCartRestaurantId(storedRestaurantId);
      }
      
      if (storedRestaurantInfo) {
        setCartRestaurantInfo(JSON.parse(storedRestaurantInfo));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await SecureStore.setItemAsync('cartItems', JSON.stringify(cartItems));
      
      if (cartRestaurantId) {
        await SecureStore.setItemAsync('cartRestaurantId', cartRestaurantId);
      } else {
        await SecureStore.deleteItemAsync('cartRestaurantId');
      }
      
      if (cartRestaurantInfo) {
        await SecureStore.setItemAsync('cartRestaurantInfo', JSON.stringify(cartRestaurantInfo));
      } else {
        await SecureStore.deleteItemAsync('cartRestaurantInfo');
      }
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  const addToCart = (item, restaurantId, restaurantInfo) => {
    // Verificar se o item é de outro restaurante
    if (cartRestaurantId && cartRestaurantId !== restaurantId && cartItems.length > 0) {
      Alert.alert(
        'Limpar carrinho?',
        'Você já tem itens de outro restaurante no carrinho. Deseja limpar o carrinho e adicionar este item?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Limpar e adicionar', 
            onPress: () => {
              // Limpar carrinho e adicionar novo item
              setCartItems([{ ...item, quantity: 1 }]);
              setCartRestaurantId(restaurantId);
              setCartRestaurantInfo(restaurantInfo);
            }
          }
        ]
      );
      return;
    }

    // Verificar se o item já está no carrinho
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex >= 0) {
      // Atualizar quantidade se o item já existe
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Adicionar novo item
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }

    // Atualizar informações do restaurante
    setCartRestaurantId(restaurantId);
    setCartRestaurantInfo(restaurantInfo);
  };

  const updateCartItem = (itemId, quantity, notes = null) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity };
        
        // Atualizar notas se fornecidas
        if (notes !== null) {
          updatedItem.notes = notes;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setCartItems(updatedItems);
  };

  const removeFromCart = (itemId) => {
    const existingItem = cartItems.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      // Diminuir quantidade se for maior que 1
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCartItems(updatedItems);
    } else {
      // Remover item se quantidade for 1
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      
      // Se não houver mais itens, limpar informações do restaurante
      if (updatedItems.length === 0) {
        setCartRestaurantId(null);
        setCartRestaurantInfo(null);
      }
    }
  };

  const removeItemCompletely = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    
    // Se não houver mais itens, limpar informações do restaurante
    if (updatedItems.length === 0) {
      setCartRestaurantId(null);
      setCartRestaurantInfo(null);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurantId(null);
    setCartRestaurantInfo(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurantId,
        cartRestaurantInfo,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        removeItemCompletely,
        clearCart,
        getCartTotal,
        getCartItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
