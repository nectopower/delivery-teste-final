import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { savedAddresses, addAddress, updateAddress, removeAddress, selectAddress } = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await api.get('/users/profile');
      setProfileData(response.data);
      
      // Carregar preferências do usuário
      setNotifications(response.data.preferences?.notifications ?? true);
      setDarkMode(response.data.preferences?.darkMode ?? false);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar seu perfil');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout }
      ]
    );
  };
  
  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profileData });
  };
  
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };
  
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setLoading(true);
        
        // Criar um FormData para enviar a imagem
        const formData = new FormData();
        formData.append('profileImage', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile-image.jpg',
        });
        
        try {
          const response = await api.post('/users/profile-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          // Atualizar o perfil com a nova imagem
          await updateUserProfile({ profileImage: response.data.imageUrl });
          fetchUserProfile();
        } catch (error) {
          console.error('Erro ao atualizar imagem:', error);
          Alert.alert('Erro', 'Não foi possível atualizar sua foto de perfil');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };
  
  const handleToggleNotifications = async (value) => {
    setNotifications(value);
    
    try {
      await api.put('/users/preferences', {
        notifications: value
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      // Reverter em caso de erro
      setNotifications(!value);
      Alert.alert('Erro', 'Não foi possível atualizar suas preferências');
    }
  };
  
  const handleToggleDarkMode = async (value) => {
    setDarkMode(value);
    
    try {
      await api.put('/users/preferences', {
        darkMode: value
      });
      
      // Aqui você implementaria a lógica para mudar o tema do app
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      // Reverter em caso de erro
      setDarkMode(!value);
      Alert.alert('Erro', 'Não foi possível atualizar suas preferências');
    }
  };
  
  const handleAddAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    });
    setAddressModalVisible(true);
  };
  
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
    setAddressModalVisible(true);
  };
  
  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Remover endereço',
      'Tem certeza que deseja remover este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          onPress: async () => {
            const result = await removeAddress(addressId);
            
            if (result.success) {
              Alert.alert('Sucesso', 'Endereço removido com sucesso');
            } else {
              Alert.alert('Erro', result.message);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleSaveAddress = async () => {
    // Validar campos obrigatórios
    if (!newAddress.street || !newAddress.number || !newAddress.neighborhood || 
        !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setLoading(true);
    
    try {
      if (editingAddress) {
        // Atualizar endereço existente
        const result = await updateAddress(editingAddress.id, newAddress);
        
        if (result.success) {
          Alert.alert('Sucesso', 'Endereço atualizado com sucesso');
          setAddressModalVisible(false);
        } else {
          Alert.alert('Erro', result.message);
        }
      } else {
        // Adicionar novo endereço
        const result = await addAddress(newAddress);
        
        if (result.success) {
          Alert.alert('Sucesso', 'Endereço adicionado com sucesso');
          setAddressModalVisible(false);
        } else {
          Alert.alert('Erro', result.message);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      Alert.alert('Erro', 'Não foi possível salvar o endereço');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAddress = (addressId) => {
    selectAddress(addressId);
  };
  
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#ccc" />
          <Text style={styles.notLoggedInText}>
            Faça login para acessar seu perfil
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
  
  if (loading && !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={handlePickImage}>
          {profileData?.profileImage ? (
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
          )}
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.userName}>{profileData?.name || currentUser.name}</Text>
        <Text style={styles.userEmail}>{profileData?.email || currentUser.email}</Text>
        
        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meus Endereços</Text>
        
        {savedAddresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <TouchableOpacity
              style={styles.addressContent}
              onPress={() => handleSelectAddress(address.id)}
            >
              <View style={styles.addressIconContainer}>
                <Ionicons name="location" size={20} color="#FF4500" />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>
                  {address.isDefault ? 'Principal' : 'Endereço'}
                </Text>
                <Text style={styles.addressText}>
                  {address.street}, {address.number}
                  {address.complement ? `, ${address.complement}` : ''}
                </Text>
                <Text style={styles.addressDetails}>
                  {address.neighborhood}, {address.city} - {address.state}
                </Text>
                <Text style={styles.addressZipCode}>{address.zipCode}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.addressActions}>
              <TouchableOpacity
                style={styles.addressActionButton}
                onPress={() => handleEditAddress(address)}
              >
                <Ionicons name="create-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addressActionButton}
                onPress={() => handleDeleteAddress(address.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={handleAddAddress}
        >
          <Ionicons name="add-circle-outline" size={20} color="#FF4500" />
          <Text style={styles.addAddressButtonText}>Adicionar novo endereço</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Notificações</Text>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#ccc', true: '#FF4500' }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Modo escuro</Text>
          <Switch
            value={darkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: '#ccc', true: '#FF4500' }}
            thumbColor="#fff"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.menuIcon} />
          <Text style={styles.menuText}>Alterar senha</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PaymentMethods')}>
          <Ionicons name="card-outline" size={24} color="#666" style={styles.menuIcon} />
          <Text style={styles.menuText}>Métodos de pagamento</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrderHistory')}>
          <Ionicons name="receipt-outline" size={24} color="#666" style={styles.menuIcon} />
          <Text style={styles.menuText}>Histórico de pedidos</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Help')}>
          <Ionicons name="help-circle-outline" size={24} color="#666" style={styles.menuIcon} />
          <Text style={styles.menuText}>Ajuda</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle-outline" size={24} color="#666" style={styles.menuIcon} />
          <Text style={styles.menuText}>Sobre o aplicativo</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF4500" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </View>
      
      {/* Modal para adicionar/editar endereço */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setAddressModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Rua *</Text>
              <TextInput
                style={styles.input}
                value={newAddress.street}
                onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
                placeholder="Nome da rua"
              />
              
              <Text style={styles.inputLabel}>Número *</Text>
              <TextInput
                style={styles.input}
                value={newAddress.number}
                onChangeText={(text) => setNewAddress({ ...newAddress, number: text })}
                placeholder="Número"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Complemento</Text>
              <TextInput
                style={styles.input}
                value={newAddress.complement}
                onChangeText={(text) => setNewAddress({ ...newAddress, complement: text })}
                placeholder="Apartamento, bloco, etc."
              />
              
              <Text style={styles.inputLabel}>Bairro *</Text>
              <TextInput
                style={styles.input}
                value={newAddress.neighborhood}
                onChangeText={(text) => setNewAddress({ ...newAddress, neighborhood: text })}
                placeholder="Bairro"
              />
              
              <Text style={styles.inputLabel}>Cidade *</Text>
              <TextInput
                style={styles.input}
                value={newAddress.city}
                onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                placeholder="Cidade"
              />
              
              <Text style={styles.inputLabel}>Estado *</Text>
              <TextInput
                style={styles.input}
                value={newAddress.state}
                onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
                placeholder="Estado"
                maxLength={2}
              />
              
              <Text style={styles.inputLabel}>CEP *</Text>
              <TextInput
                style={styles.input}
                value={newAddress.zipCode}
                onChangeText={(text) => setNewAddress({ ...newAddress, zipCode: text })}
                placeholder="00000-000"
                keyboardType="numeric"
              />
              
              <View style={styles.defaultAddressContainer}>
                <Text style={styles.defaultAddressText}>Definir como endereço principal</Text>
                <Switch
                  value={newAddress.isDefault}
                  onValueChange={(value) => setNewAddress({ ...newAddress, isDefault: value })}
                  trackColor={{ false: '#ccc', true: '#FF4500' }}
                  thumbColor="#fff"
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4500',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  addressContent: {
    flex: 1,
    flexDirection: 'row',
  },
  addressIconContainer: {
    marginRight: 10,
    paddingTop: 2,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4500',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
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
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressActionButton: {
    padding: 5,
    marginLeft: 10,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  addAddressButtonText: {
    marginLeft: 10,
    color: '#FF4500',
    fontWeight: '500',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceText: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 15,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4500',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
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
    maxHeight: '90%',
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
  modalForm: {
    padding: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  defaultAddressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  defaultAddressText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF4500',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
