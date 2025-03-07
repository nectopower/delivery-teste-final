import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLocation } from '../contexts/LocationContext';
import api from '../services/api';
import StarRating from '../components/StarRating';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const RestaurantScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurantId, highlightDishId } = route.params;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { currentLocation } = useLocation();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);
  
  useEffect(() => {
    if (highlightDishId && dishes.length > 0) {
      const dish = dishes.find(d => d.id === highlightDishId);
      if (dish) {
        handleDishPress(dish);
      }
    }
  }, [highlightDishId, dishes]);
  
  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar dados do restaurante
      const restaurantResponse = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(restaurantResponse.data);
      
      // Carregar categorias do restaurante
      const categoriesResponse = await api.get(`/restaurants/${restaurantId}/categories`);
      setCategories(categoriesResponse.data);
      
      if (categoriesResponse.data.length > 0) {
        setActiveCategory(categoriesResponse.data[0].id);
      }
      
      // Carregar pratos do restaurante
      const dishesResponse = await api.get(`/restaurants/${restaurantId}/dishes`);
      setDishes(dishesResponse.data);
      
    } catch (err) {
      console.error('Erro ao carregar dados do restaurante:', err);
      setError('Não foi possível carregar os dados do restaurante. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    
    // Scroll para a categoria selecionada
    const categoryDishes = dishes.filter(dish => dish.categoryId === categoryId);
    if (categoryDishes.length > 0) {
      const firstDishId = categoryDishes[0].id;
      const element = document.getElementById(`dish-${firstDishId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const handleDishPress = (dish) => {
    setSelectedDish(dish);
    setQuantity(1);
    setNotes('');
    setModalVisible(true);
  };
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login necessário',
        'Você precisa estar logado para adicionar itens ao carrinho.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    
    if (!selectedDish) return;
    
    const item = {
      id: selectedDish.id,
      name: selectedDish.name,
      price: selectedDish.price,
      imageUrl: selectedDish.imageUrl,
      quantity,
      notes
    };
    
    addToCart(item, restaurantId, {
      id: restaurant.id,
      name: restaurant.name,
      imageUrl: restaurant.imageUrl,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee
    });
    
    setModalVisible(false);
    Alert.alert('Adicionado', `${selectedDish.name} foi adicionado ao seu carrinho!`);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        activeCategory === item.id && styles.activeCategoryTab
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text
        style={[
          styles.categoryTabText,
          activeCategory === item.id && styles.activeCategoryTabText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  const renderDishItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dishCard}
      onPress={() => handleDishPress(item)}
      id={`dish-${item.id}`}
    >
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.dishPrice}>{formatCurrency(item.price)}</Text>
      </View>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.dishImage}
        />
      )}
    </TouchableOpacity>
  );
  
  const renderDishCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const categoryDishes = dishes.filter(dish => dish.categoryId === categoryId);
    
    if (!category || categoryDishes.length === 0) return null;
    
    return (
      <View key={categoryId} style={styles.dishCategory}>
        <Text style={styles.dishCategoryTitle}>{category.name}</Text>
        {categoryDishes.map(dish => renderDishItem({ item: dish }))}
      </View>
    );
  };
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Carregando restaurante...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadRestaurantData}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurante não encontrado</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: restaurant.imageUrl || 'https://via.placeholder.com/500x300' }}
          style={[styles.headerImage, { opacity: headerOpacity }]}
        />
        <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {restaurant.name}
          </Text>
        </Animated.View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.restaurantInfoContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <StarRating rating={restaurant.rating} size={16} />
            <Text style={styles.ratingText}>
              {restaurant.rating.toFixed(1)} ({restaurant.ratingCount})
            </Text>
          </View>
          
          <Text style={styles.categoryText}>
            {restaurant.categories?.map(cat => cat.name).join(', ')}
          </Text>
        </View>
        
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.deliveryText}>{restaurant.deliveryTime} min</Text>
          </View>
          
          <View style={styles.deliveryItem}>
            <Ionicons name="bicycle-outline" size={16} color="#666" />
            <Text style={styles.deliveryText}>
              {restaurant.deliveryFee > 0 ? formatCurrency(restaurant.deliveryFee) : 'Grátis'}
            </Text>
          </View>
          
          {restaurant.minOrderValue > 0 && (
            <View style={styles.deliveryItem}>
              <Ionicons name="cart-outline" size={16} color="#666" />
              <Text style={styles.deliveryText}>
                Min. {formatCurrency(restaurant.minOrderValue)}
              </Text>
            </View>
          )}
        </View>
        
        {restaurant.description && (
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
        )}
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <Animated.ScrollView
        style={styles.menuContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {activeCategory ? (
          categories.map(category => renderDishCategory(category.id))
        ) : (
          <Text style={styles.noCategoriesText}>
            Este restaurante ainda não possui categorias ou pratos cadastrados.
          </Text>
        )}
        
        <View style={styles.bottomSpace} />
      </Animated.ScrollView>
      
      {/* Modal para adicionar item ao carrinho */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedDish && (
              <>
                {selectedDish.imageUrl && (
                  <Image
                    source={{ uri: selectedDish.imageUrl }}
                    style={styles.modalImage}
                  />
                )}
                
                <View style={styles.modalBody}>
                  <Text style={styles.modalDishName}>{selectedDish.name}</Text>
                  <Text style={styles.modalDishDescription}>{selectedDish.description}</Text>
                  <Text style={styles.modalDishPrice}>{formatCurrency(selectedDish.price)}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantidade:</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Ionicons name="remove" size={20} color="#FF4500" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(quantity + 1)}
                      >
                        <Ionicons name="add" size={20} color="#FF4500" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.notesLabel}>Observações:</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Ex: Sem cebola, molho à parte, etc."
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    maxLength={100}
                  />
                </View>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                  >
                    <Text style={styles.addToCartButtonText}>
                      Adicionar • {formatCurrency(selectedDish.price * quantity)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF4500',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  restaurantInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: HEADER_MAX_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  deliveryInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  deliveryText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  categoryTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryTab: {
    backgroundColor: '#FF4500',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
  },
  dishCategory: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  dishCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  dishCard: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dishInfo: {
    flex: 1,
    marginRight: 10,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  noCategoriesText: {
    padding: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 100,
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
    maxHeight: '90%',
  },
  modalHeader: {
    padding: 15,
    alignItems: 'flex-end',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalBody: {
    padding: 15,
  },
  modalDishName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDishDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  modalDishPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantScreen;
