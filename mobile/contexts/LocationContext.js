import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import api from '../services/api';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  
  useEffect(() => {
    requestLocationPermission();
    loadSavedAddresses();
  }, []);
  
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        await getCurrentLocation();
      } else {
        setError('Permissão de localização não concedida');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      setError('Não foi possível acessar sua localização');
      setLoading(false);
    }
  };
  
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      
      // Obter endereço a partir das coordenadas
      await getAddressFromCoordinates(latitude, longitude);
      
    } catch (error) {
      console.error('Erro ao obter localização atual:', error);
      setError('Não foi possível obter sua localização atual');
    } finally {
      setLoading(false);
    }
  };
  
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (response && response.length > 0) {
        const addressData = response[0];
        
        const formattedAddress = {
          street: addressData.street || 'Endereço desconhecido',
          number: addressData.streetNumber || '',
          neighborhood: addressData.district || addressData.subregion || '',
          city: addressData.city || '',
          state: addressData.region || '',
          zipCode: addressData.postalCode || '',
          country: addressData.country || '',
          latitude,
          longitude
        };
        
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Erro ao obter endereço a partir das coordenadas:', error);
    }
  };
  
  const loadSavedAddresses = async () => {
    try {
      // Carregar endereços do armazenamento local
      const storedAddresses = await SecureStore.getItemAsync('savedAddresses');
      
      if (storedAddresses) {
        setSavedAddresses(JSON.parse(storedAddresses));
      }
      
      // Carregar endereços do backend (se o usuário estiver autenticado)
      const token = await SecureStore.getItemAsync('userToken');
      
      if (token) {
        const response = await api.get('/users/addresses');
        
        if (response.data && response.data.length > 0) {
          setSavedAddresses(response.data);
          
          // Salvar no armazenamento local
          await SecureStore.setItemAsync('savedAddresses', JSON.stringify(response.data));
          
          // Definir endereço padrão, se existir
          const defaultAddress = response.data.find(addr => addr.isDefault);
          if (defaultAddress) {
            setAddress(defaultAddress);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar endereços salvos:', error);
    }
  };
  
  const addAddress = async (addressData) => {
    try {
      // Adicionar coordenadas se não fornecidas
      let addressWithCoords = { ...addressData };
      
      if (!addressWithCoords.latitude || !addressWithCoords.longitude) {
        try {
          const geocodeResult = await Location.geocodeAsync(
            `${addressData.street}, ${addressData.number}, ${addressData.city}, ${addressData.state}`
          );
          
          if (geocodeResult && geocodeResult.length > 0) {
            addressWithCoords.latitude = geocodeResult[0].latitude;
            addressWithCoords.longitude = geocodeResult[0].longitude;
          }
        } catch (geocodeError) {
          console.error('Erro ao geocodificar endereço:', geocodeError);
        }
      }
      
      // Salvar no backend
      const response = await api.post('/users/addresses', addressWithCoords);
      
      // Atualizar lista de endereços
      const updatedAddresses = [...savedAddresses, response.data];
      setSavedAddresses(updatedAddresses);
      
      // Salvar no armazenamento local
      await SecureStore.setItemAsync('savedAddresses', JSON.stringify(updatedAddresses));
      
      // Se for o endereço padrão ou o primeiro endereço, definir como atual
      if (addressWithCoords.isDefault || savedAddresses.length === 0) {
        setAddress(response.data);
      }
      
      return { success: true, address: response.data };
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Não foi possível adicionar o endereço' 
      };
    }
  };
  
  const updateAddress = async (addressId, addressData) => {
    try {
      // Atualizar no backend
      const response = await api.put(`/users/addresses/${addressId}`, addressData);
      
      // Atualizar lista de endereços
      const updatedAddresses = savedAddresses.map(addr => 
        addr.id === addressId ? response.data : addr
      );
      setSavedAddresses(updatedAddresses);
      
      // Salvar no armazenamento local
      await SecureStore.setItemAsync('savedAddresses', JSON.stringify(updatedAddresses));
      
      // Se for o endereço atual, atualizar
      if (address && address.id === addressId) {
        setAddress(response.data);
      }
      
      // Se o endereço atualizado for definido como padrão, atualizar outros endereços
      if (addressData.isDefault) {
        const newUpdatedAddresses = updatedAddresses.map(addr => 
          addr.id !== addressId ? { ...addr, isDefault: false } : addr
        );
        setSavedAddresses(newUpdatedAddresses);
        await SecureStore.setItemAsync('savedAddresses', JSON.stringify(newUpdatedAddresses));
        setAddress(response.data);
      }
      
      return { success: true, address: response.data };
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Não foi possível atualizar o endereço' 
      };
    }
  };
  
  const removeAddress = async (addressId) => {
    try {
      // Remover do backend
      await api.delete(`/users/addresses/${addressId}`);
      
      // Atualizar lista de endereços
      const updatedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
      setSavedAddresses(updatedAddresses);
      
      // Salvar no armazenamento local
      await SecureStore.setItemAsync('savedAddresses', JSON.stringify(updatedAddresses));
      
      // Se for o endereço atual, definir outro endereço como atual
      if (address && address.id === addressId) {
        const defaultAddress = updatedAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setAddress(defaultAddress);
        } else if (updatedAddresses.length > 0) {
          setAddress(updatedAddresses[0]);
        } else {
          setAddress(null);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover endereço:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Não foi possível remover o endereço' 
      };
    }
  };
  
  const selectAddress = async (addressId) => {
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    
    if (selectedAddress) {
      setAddress(selectedAddress);
      return { success: true };
    }
    
    return { success: false, message: 'Endereço não encontrado' };
  };
  
  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        address,
        savedAddresses,
        loading,
        error,
        permissionStatus,
        getCurrentLocation,
        getAddressFromCoordinates,
        addAddress,
        updateAddress,
        removeAddress,
        selectAddress,
        loadSavedAddresses
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
