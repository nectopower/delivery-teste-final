import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';
import api from '../services/api';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#1e293b'};
  border: ${props => props.primary ? 'none' : '1px solid #e2e8f0'};
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2563eb' : '#f8fafc'};
  }
`;

const FormCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e293b;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input {
    width: 16px;
    height: 16px;
  }
  
  label {
    margin: 0;
    font-weight: normal;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    imageUrl: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchRestaurant();
    }
  }, [id]);
  
  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/admin/restaurants/${id}`);
      // setFormData({
      //   name: response.data.name,
      //   description: response.data.description,
      //   address: response.data.address,
      //   phone: response.data.phone,
      //   imageUrl: response.data.imageUrl,
      //   isActive: response.data.isActive
      // });
      // setImagePreview(response.data.imageUrl);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockRestaurant = {
          id: parseInt(id),
          name: 'Restaurante Bom Sabor',
          description: 'Especializado em comida caseira com ingredientes frescos e de qualidade.',
          address: 'Rua das Flores, 123',
          phone: '(11) 98765-4321',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          isActive: true
        };
        
        setFormData({
          name: mockRestaurant.name,
          description: mockRestaurant.description,
          address: mockRestaurant.address,
          phone: mockRestaurant.phone,
          imageUrl: mockRestaurant.imageUrl,
          isActive: mockRestaurant.isActive
        });
        
        setImagePreview(mockRestaurant.imageUrl);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar restaurante:', error);
      setLoading(false);
      navigate('/restaurants');
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      imageUrl: value
    }));
    
    setImagePreview(value);
    
    if (errors.imageUrl) {
      setErrors(prev => ({
        ...prev,
        imageUrl: null
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Em um cenário real, você enviaria os dados para a API
      if (isEditMode) {
        // await api.put(`/admin/restaurants/${id}`, formData);
        console.log('Atualizando restaurante:', formData);
      } else {
        // await api.post('/admin/restaurants', formData);
        console.log('Criando restaurante:', formData);
      }
      
      // Simulação
      setTimeout(() => {
        setLoading(false);
        alert(`Restaurante ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        navigate('/restaurants');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar restaurante:', error);
      setLoading(false);
      alert('Erro ao salvar restaurante. Tente novamente.');
    }
  };
  
  return (
    <FormContainer>
      <Header>
        <Title>{isEditMode ? 'Editar Restaurante' : 'Novo Restaurante'}</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/restaurants')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Button primary onClick={handleSubmit} disabled={loading}>
            <FaSave /> {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </ButtonsContainer>
      </Header>
      
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nome do Restaurante</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite o nome do restaurante"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Digite uma descrição para o restaurante"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="address">Endereço</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Digite o endereço completo"
              />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Digite o telefone de contato"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleImageChange}
              placeholder="Cole a URL da imagem do restaurante"
            />
            {imagePreview && (
              <ImagePreview>
                <img src={imagePreview} alt="Preview" />
              </ImagePreview>
            )}
          </FormGroup>
          
          <FormGroup>
            <Checkbox>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <Label htmlFor="isActive">Restaurante ativo</Label>
            </Checkbox>
          </FormGroup>
        </form>
      </FormCard>
    </FormContainer>
  );
};

export default RestaurantForm;
