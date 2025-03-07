import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { useOrder } from '../contexts/OrderContext';
import api from '../services/api';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cartItems, cartRestaurantId, cartRestaurantInfo, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { currentLocation, savedAddresses } = useLocation();
  const { createOrder } = useOrder();
  
  const [selectedAddress, setSelectedAddress] = useState(currentLocation);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  
  useEffect(() => {
    if (!cartItems.length || !cartRestaurantId) {
      Alert.alert('Carrinho vazio', 'Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
      navigation.goBack();
      return;
    }
    
    calculateDeliveryFee();
  }, [cartItems, cartRestaurantId, selectedAddress]);
  
  const calculateDeliveryFee = async () => {
    if (!selectedAddress || !cartRestaurantId) return;
    
    try {
      const response = await api.post('/delivery-fee/calculate', {
        restaurantId: cartRestaurantId,
        deliveryAddress: {
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude
        }
      });
      
      setDeliveryFee(response.data.fee);
      setEstimatedTime(response.data.estimatedTime);
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
      // Set default values if calculation fails
      setDeliveryFee(5);
      setEstimatedTime(30);
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Endereço necessário', 'Por favor, selecione um endereço de entrega.');
      return;
    }
    
    if (paymentMethod === 'CASH' && (!changeFor || parseFloat(changeFor) < getCartTotal() + deliveryFee)) {
      Alert.alert('Troco inválido', 'Por favor, informe um valor válido para o troco.');
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = {
        restaurantId: cartRestaurantId,
        items: cartItems.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          notes: item.notes || ''
        })),
        deliveryAddress: {
          street: selectedAddress.street,
          number: selectedAddress.number,
          complement: selectedAddress.complement || '',
          neighborhood: selectedAddress.neighborhood,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude
        },
        paymentMethod,
        changeFor: paymentMethod === 'CASH' ? parseFloat(changeFor) : null,
        notes
      };
      
      const order = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order details
      navigation.replace('OrderDetails', { orderId: order.id });
      
      Alert.alert('Pedido realizado', 'Seu pedido foi realizado com sucesso!');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Erro', 'Não foi possível realizar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          
          {selectedAddress ? (
            <View style={styles.addressCard}>
              <View style={styles.addressInfo}>
                <Text style={styles.addressText}>
                  {selectedAddress.street}, {selectedAddress.number}
                </Text>
                {selectedAddress.complement && (
                  <Text style={styles.addressComplement}>{selectedAddress.complement}</Text>
                )}
                <Text style={styles.addressCity}>
                  {selectedAddress.neighborhood}, {selectedAddress.city} - {selectedAddress.state}
                </Text>
                <Text style={styles.addressZip}>{selectedAddress.zipCode}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => {/* Open address selection */}}
              >
                <Text style={styles.changeButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => {/* Open address selection */}}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FF4500" />
              <Text style={styles.addAddressText}>Adicionar endereço</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'CREDIT_CARD' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('CREDIT_CARD')}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons name="card-outline" size={24} color="#666" />
              <Text style={styles.paymentOptionText}>Cartão de Crédito</Text>
            </View>
            
            {paymentMethod === 'CREDIT_CARD' && (
              <Ionicons name="checkmark-circle" size={24} color="#FF4500" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'CASH' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons name="cash-outline" size={24} color="#666" />
              <Text style={styles.paymentOptionText}>Dinheiro</Text>
            </View>
            
            {paymentMethod === 'CASH' && (
              <Ionicons name="checkmark-circle" size={24} color="#FF4500" />
            )}
          </TouchableOpacity>
          
          {paymentMethod === 'CASH' && (
            <View style={styles.changeContainer}>
              <Text style={styles.changeLabel}>Troco para:</Text>
              <TextInput
                style={styles.changeInput}
                placeholder="R$ 0,00"
                keyboardType="numeric"
                value={changeFor}
                onChangeText={setChangeFor}
              />
            </View>
          )}
        </View>
        
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemQuantity}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.notes && (
                  <Text style={styles.itemNotes}>{item.notes}</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Alguma observação para o restaurante?"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
        
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de entrega</Text>
              <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
            
            <View style={styles.deliveryTimeContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.deliveryTimeText}>
                Tempo estimado de entrega: {estimatedTime} min
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Finalizar Pedido</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressComplement: {
    fontSize: 14,
    marginBottom: 5,
  },
  addressCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  addressZip: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    justifyContent: 'center',
  },
  changeButtonText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addAddressText: {
    color: '#FF4500',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderWidth: 1,
    borderColor: '#FF4500',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  changeLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  changeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemQuantity: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityText: {
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deliveryTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpace: {
    height: 20,
  },
});

export default CheckoutScreen;
