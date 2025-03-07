import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaSave, FaCamera } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #2196F3;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin-right: 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoPreview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://via.placeholder.com/150?text=Logo'});
  background-size: cover;
  background-position: center;
  margin-bottom: 15px;
  border: 1px solid #ddd;
`;

const LogoUploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  input {
    display: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const RestaurantProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    logo: ''
  });

  useEffect(() => {
    if (currentUser && currentUser.role === 'RESTAURANT') {
      fetchRestaurantData();
    } else {
      navigate('/login');
    }
  }, [currentUser]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Get restaurant data
      const restaurantResponse = await api.get(`/restaurant/user/${currentUser.id}`);
      const restaurantData = restaurantResponse.data;
      setRestaurant(restaurantData);
      
      // Initialize form with restaurant data
      setForm({
        name: restaurantData.name || '',
        description: restaurantData.description || '',
        address: restaurantData.address || '',
        phone: restaurantData.phone || '',
        logo: restaurantData.logo || ''
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Erro ao carregar dados do restaurante');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server or cloud storage
      // For this demo, we'll just use a fake URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      await api.put(`/restaurant/${restaurant.id}`, form);
      
      toast.success('Perfil atualizado com sucesso');
      setSaving(false);
    } catch (error) {
      console.error('Error updating restaurant profile:', error);
      toast.error('Erro ao atualizar perfil');
      setSaving(false);
    }
  };

  if (loading) {
    return <Container>Carregando dados do restaurante...</Container>;
  }

  if (!restaurant) {
    return <Container>Restaurante não encontrado</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/restaurant')}>
          <FaArrowLeft /> Voltar ao Painel
        </BackButton>
        <Title>Configurações do Restaurante</Title>
      </Header>
      
      <ProfileForm onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Informações Básicas</SectionTitle>
          
          <LogoContainer>
            <LogoPreview src={form.logo} />
            <LogoUploadButton>
              <FaCamera /> Alterar Logo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
              />
            </LogoUploadButton>
          </LogoContainer>
          
          <FormGroup>
            <Label htmlFor="name">Nome do Restaurante *</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Descrição</Label>
            <TextArea 
              id="description" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Descreva seu restaurante, especialidades, horários de funcionamento, etc."
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Informações de Contato</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="address">Endereço *</Label>
            <Input 
              type="text" 
              id="address" 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phone">Telefone *</Label>
            <Input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={currentUser.email} 
              disabled 
            />
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Para alterar o email, entre em contato com o suporte.
            </small>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={saving}>
            <FaSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </SubmitButton>
        </FormSection>
      </ProfileForm>
    </Container>
  );
};

export default RestaurantProfile;
