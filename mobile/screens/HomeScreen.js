import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import api from '../services/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { currentLocation, address } = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  
  useEffect(() => {
    loadInitialData();
  }, [currentLocation]);
  
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar categorias
      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data);
      
      // Carregar restaurantes em destaque
      const featuredResponse = await api.get('/restaurants/featured');
      setFeaturedRestaurants(featuredResponse.data);
      
      // Carregar restaurantes próximos (se tiver localização)
      if (currentLocation) {
        const nearbyResponse = await api.get('/restaurants/nearby', {
          params: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            radius: 5 // 5km
          }
        });
        setNearbyRestaurants(nearbyResponse.data);
      }
      
      // Carregar restaurantes populares
      const popularResponse = await api.get('/restaurants/popular');
      setPopularRestaurants(popularResponse.data);
      
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };
  
  const handleCategoryPress = (categoryId, categoryName) => {
    navigation.navigate('Restaurants', { categoryId, categoryName });
  };
  
  const handleRestaurantPress = (restaurantId) => {
    navigation.navigate('Restaurant', { restaurantId });
  };
  
  const handleSearchPress = () => {
    navigation.navigate('Search');
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item.id, item.name)}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
          style={styles.categoryImage}
        />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item.id)}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x150' }}
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.categoryText}>
            {item.categories?.map(cat => cat.name).join(', ')}
          </Text>
        </View>
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTime}>{item.deliveryTime} min</Text>
          <Text style={styles.deliveryFee}>
            {item.deliveryFee > 0 ? formatCurrency(item.deliveryFee) : 'Grátis'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Carregando restaurantes...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#FF4500']}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#FF4500" />
          <Text style={styles.locationText} numberOfLines={1}>
            {address ? `${address.street}, ${address.number}` : 'Definir localização'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LocationSelect')}>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {currentUser && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {currentUser.profileImage ? (
              <Image
                source={{ uri: currentUser.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.searchBar}
        onPress={handleSearchPress}
      >
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Restaurantes, pratos, culinária...</Text>
      </TouchableOpacity>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadInitialData}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Categorias */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
          
          {/* Restaurantes em Destaque */}
          {featuredRestaurants.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Destaques</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Restaurants', { featured: true })}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={featuredRestaurants}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantsList}
              />
            </View>
          )}
          
          {/* Restaurantes Próximos */}
          {nearbyRestaurants.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próximos a você</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Restaurants', { nearby: true })}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={nearbyRestaurants}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantsList}
              />
            </View>
          )}
          
          {/* Restaurantes Populares */}
          {popularRestaurants.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mais populares</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Restaurants', { popular: true })}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={popularRestaurants}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantsList}
              />
            </View>
          )}
        </>
      )}
      
      <View style={styles.bottomSpace} />
    </ScrollView>
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
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  profileButton: {
    marginLeft: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
    marginLeft: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
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
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    width: 80,
  },
  categoryImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF4500',
  },
  restaurantsList: {
    paddingHorizontal: 10,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 250,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingText: {
    marginLeft: 2,
    fontSize: 14,
    color: '#666',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  deliveryFee: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpace: {
    height: 80,
  },
});

export default HomeScreen;
