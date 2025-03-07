import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const initialQuery = route.params?.query || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('restaurants'); // 'restaurants' ou 'dishes'
  
  useEffect(() => {
    loadRecentSearches();
    
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const loadRecentSearches = async () => {
    try {
      // Em uma implementação real, isso viria do AsyncStorage ou SecureStore
      // Por enquanto, usaremos dados fictícios
      setRecentSearches([
        'Pizza', 'Hambúrguer', 'Japonês', 'Vegetariano'
      ]);
    } catch (error) {
      console.error('Erro ao carregar buscas recentes:', error);
    }
  };
  
  const saveRecentSearch = async (query) => {
    try {
      // Evitar duplicatas
      if (!recentSearches.includes(query)) {
        const updatedSearches = [query, ...recentSearches].slice(0, 5);
        setRecentSearches(updatedSearches);
        
        // Em uma implementação real, salvaríamos no AsyncStorage ou SecureStore
      }
    } catch (error) {
      console.error('Erro ao salvar busca recente:', error);
    }
  };
  
  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = activeTab === 'restaurants' 
        ? '/restaurants/search' 
        : '/dishes/search';
      
      const response = await api.get(`${endpoint}?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      
      // Salvar a busca nas recentes
      saveRecentSearch(query);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Não foi possível realizar a busca. Tente novamente.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };
  
  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Restaurant', { restaurantId: item.id })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.resultImage}
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <View style={styles.resultMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.categoryText}>
            {item.categories?.map(cat => cat.name).join(', ')}
          </Text>
        </View>
        <Text style={styles.deliveryInfo}>
          {item.deliveryTime} min • {formatCurrency(item.deliveryFee)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderDishItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Restaurant', { 
        restaurantId: item.restaurantId,
        highlightDishId: item.id
      })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.resultImage}
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.dishMeta}>
          <Text style={styles.dishPrice}>{formatCurrency(item.price)}</Text>
          <Text style={styles.restaurantName}>{item.restaurant?.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Restaurantes, pratos, culinária..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus={!initialQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      
      {searchQuery ? (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'restaurants' && styles.activeTab
            ]}
            onPress={() => {
              setActiveTab('restaurants');
              handleSearch();
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'restaurants' && styles.activeTabText
              ]}
            >
              Restaurantes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'dishes' && styles.activeTab
            ]}
            onPress={() => {
              setActiveTab('dishes');
              handleSearch();
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'dishes' && styles.activeTabText
              ]}
            >
              Pratos
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4500" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => handleSearch()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : searchQuery ? (
        <FlatList
          data={searchResults}
          renderItem={activeTab === 'restaurants' ? renderRestaurantItem : renderDishItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                Nenhum resultado encontrado para "{searchQuery}"
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Buscas recentes</Text>
          
          {recentSearches.length > 0 ? (
            <FlatList
              data={recentSearches}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearchPress(item)}
                >
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.recentSearchText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          ) : (
            <Text style={styles.noRecentSearchesText}>
              Suas buscas recentes aparecerão aqui
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 10,
    padding: 5,
  },
  cancelButtonText: {
    color: '#FF4500',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4500',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF4500',
    fontWeight: 'bold',
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
  resultsList: {
    padding: 15,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultImage: {
    width: 100,
    height: 100,
  },
  resultInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultMeta: {
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
    fontSize: 14,
    color: '#666',
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  recentSearchesContainer: {
    padding: 15,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentSearchText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  noRecentSearchesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchScreen;
