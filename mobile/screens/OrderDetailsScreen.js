import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

const OrderDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const { isAuthenticated } = useAuth();
  const { 
    getOrderById, 
    currentOrder, 
    loading, 
    error, 
    cancelOrder,
    rateOrder,
    rateDeliveryPerson,
    getOrderStatusText,
    getOrderStatusColor
  } = useOrder();
  
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingType, setRatingType] = useState('order'); // 'order' ou 'delivery'
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    if (isAuthenticated && orderId) {
      loadOrderDetails();
    }
  }, [isAuthenticated, orderId]);
  
  const loadOrderDetails = async () => {
    await getOrderById(orderId);
  };
  
  const handleCancelOrder = () => {
    Alert.alert(
      'Cancelar pedido',
      'Tem certeza que deseja cancelar este pedido?',
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim, cancelar', 
          onPress: async () => {
            const result = await cancelOrder(orderId);
            
            if (result.success) {
              Alert.alert('Sucesso', 'Pedido cancelado com sucesso');
            } else {
              Alert.alert('Erro', result.message || 'Não foi possível cancelar o pedido');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleRateOrder = () => {
    setRatingType('order');
    setRating(5);
    setComment('');
    setRatingModalVisible(true);
  };
  
  const handleRateDelivery = () => {
    setRatingType('delivery');
    setRating(5);
    setComment('');
    setRatingModalVisible(true);
  };
  
  const submitRating = async () => {
    try {
      let result;
      
      if (ratingType === 'order') {
        result = await rateOrder(orderId, rating, comment);
      } else {
        result = await rateDeliveryPerson(orderId, rating, comment);
      }
      
      if (result.success) {
        Alert.alert(
          'Avaliação enviada',
          'Obrigado por avaliar! Sua opinião é muito importante para nós.'
        );
        setRatingModalVisible(false);
      } else {
        Alert.alert('Erro', result.message || 'Não foi possível enviar sua avaliação');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar sua avaliação');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.notLoggedInText}>
            Faça login para ver os detalhes do pedido
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (loading && !currentOrder) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Carregando detalhes do pedido...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadOrderDetails}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!currentOrder) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pedido não encontrado</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const canCancel = ['PENDING', 'CONFIRMED'].includes(currentOrder.status);
  const canRate = currentOrder.status === 'DELIVERED' && !currentOrder.isRated;
  const canRateDelivery = currentOrder.status === 'DELIVERED' && 
                          currentOrder.deliveryPerson && 
                          !currentOrder.isDeliveryRated;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.orderHeader}>
          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumberLabel}>Pedido nº</Text>
            <Text style={styles.orderNumber}>{currentOrder.orderNumber || `#${currentOrder.id}`}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getOrderStatusColor(currentOrder.status) }]}>
            <Text style={styles.statusText}>{getOrderStatusText(currentOrder.status)}</Text>
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>
            {formatDate(currentOrder.createdAt)} às {formatTime(currentOrder.createdAt)}
          </Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.restaurantContainer}>
            <Image
              source={{ uri: currentOrder.restaurant.imageUrl || 'https://via.placeholder.com/100' }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{currentOrder.restaurant.name}</Text>
              <Text style={styles.restaurantAddress}>
                {currentOrder.restaurant.address?.street}, {currentOrder.restaurant.address?.number}
              </Text>
              <Text style={styles.restaurantPhone}>
                {currentOrder.restaurant.phone || 'Telefone não disponível'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          
          {currentOrder.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemQuantity}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.dish.name}</Text>
                {item.notes && (
                  <Text style={styles.itemNotes}>{item.notes}</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.dish.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(currentOrder.subtotal)}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Taxa de entrega</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(currentOrder.deliveryFee)}
            </Text>
          </View>
          
          {currentOrder.discount > 0 && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Desconto</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{formatCurrency(currentOrder.discount)}
              </Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(currentOrder.total)}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          
          <View style={styles.paymentMethod}>
            <Ionicons
              name={currentOrder.paymentMethod === 'CREDIT_CARD' ? 'card-outline' : 'cash-outline'}
              size={20}
              color="#666"
            />
            <Text style={styles.paymentMethodText}>
              {currentOrder.paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Dinheiro'}
            </Text>
          </View>
          
          {currentOrder.paymentMethod === 'CASH' && currentOrder.changeFor && (
            <View style={styles.changeInfo}>
              <Text style={styles.changeLabel}>Troco para:</Text>
              <Text style={styles.changeValue}>{formatCurrency(currentOrder.changeFor)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.addressIcon} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>
                {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.number}
                {currentOrder.deliveryAddress.complement ? `, ${currentOrder.deliveryAddress.complement}` : ''}
              </Text>
              <Text style={styles.addressDetails}>
                {currentOrder.deliveryAddress.neighborhood}, {currentOrder.deliveryAddress.city} - {currentOrder.deliveryAddress.state}
              </Text>
              <Text style={styles.addressZipCode}>{currentOrder.deliveryAddress.zipCode}</Text>
            </View>
          </View>
        </View>
        
        {currentOrder.deliveryPerson && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entregador</Text>
            
            <View style={styles.deliveryPersonContainer}>
              <Image
                source={{ uri: currentOrder.deliveryPerson.profileImage || 'https://via.placeholder.com/50' }}
                style={styles.deliveryPersonImage}
              />
              <View style={styles.deliveryPersonInfo}>
                <Text style={styles.deliveryPersonName}>{currentOrder.deliveryPerson.name}</Text>
                <Text style={styles.deliveryPersonPhone}>{currentOrder.deliveryPerson.phone}</Text>
              </View>
            </View>
          </View>
        )}
        
        {currentOrder.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.notesText}>{currentOrder.notes}</Text>
          </View>
        )}
        
        {currentOrder.isRated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sua Avaliação</Text>
            
            <View style={styles.ratingContainer}>
              <StarRating rating={currentOrder.rating} size={20} />
              <Text style={styles.ratingValue}>{currentOrder.rating.toFixed(1)}</Text>
            </View>
            
            {currentOrder.comment && (
              <Text style={styles.ratingComment}>{currentOrder.comment}</Text>
            )}
          </View>
        )}
        
        {currentOrder.isDeliveryRated && currentOrder.deliveryPerson && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliação do Entregador</Text>
            
            <View style={styles.ratingContainer}>
              <StarRating rating={currentOrder.deliveryRating} size={20} />
              <Text style={styles.ratingValue}>{currentOrder.deliveryRating.toFixed(1)}</Text>
            </View>
            
            {currentOrder.deliveryComment && (
              <Text style={styles.ratingComment}>{currentOrder.deliveryComment}</Text>
            )}
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelOrder}
            >
              <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
            </TouchableOpacity>
          )}
          
          {canRate && (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={handleRateOrder}
            >
              <Text style={styles.rateButtonText}>Avaliar Pedido</Text>
            </TouchableOpacity>
          )}
          
          {canRateDelivery && (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={handleRateDelivery}
            >
              <Text style={styles.rateButtonText}>Avaliar Entregador</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      {/* Modal de Avaliação */}
      <Modal
        visible={ratingModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {ratingType === 'order' ? 'Avaliar Pedido' : 'Avaliar Entregador'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setRatingModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.ratingQuestion}>
                {ratingType === 'order'
                  ? 'Como foi sua experiência com este pedido?'
                  : 'Como foi o serviço de entrega?'}
              </Text>
              
              <View style={styles.starRatingContainer}>
                <StarRating
                  rating={rating}
                  size={40}
                  onRatingChange={setRating}
                  editable={true}
                />
              </View>
              
              <Text style={styles.commentLabel}>Comentário (opcional):</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Conte-nos mais sobre sua experiência..."
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={140}
              />
              <Text style={styles.characterCount}>{comment.length}/140</Text>
            </View>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitRating}
            >
              <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumberLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#666',
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
  summaryItem: {
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
  discountValue: {
    color: '#27AE60',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    marginLeft: 10,
  },
  changeInfo: {
    flexDirection: 'row',
    marginTop: 10,
  },
  changeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
  },
  addressIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 5,
  },
  addressDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  addressZipCode: {
    fontSize: 14,
    color: '#666',
  },
  deliveryPersonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryPersonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  deliveryPersonInfo: {
    flex: 1,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deliveryPersonPhone: {
    fontSize: 14,
    color: '#666',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ratingComment: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  actionsContainer: {
    padding: 15,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rateButton: {
    backgroundColor: '#FF4500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
  },
  ratingQuestion: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  starRatingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#FF4500',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;
