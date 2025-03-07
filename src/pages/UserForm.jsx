import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
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

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
`;

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/admin/users/${id}`);
      // setFormData({
      //   name: response.data.name,
      //   email: response.data.email,
      //   password: '',
      //   role: response.data.role
      // });
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockUser = {
          id: parseInt(id),
          name: id === '1' ? 'João Silva' : 'Maria Oliveira',
          email: id === '1' ? 'joao@example.com' : 'maria@example.com',
          role: id === '1' ? 'ADMIN' : 'CUSTOMER'
        };
        
        setFormData({
          name: mockUser.name,
          email: mockUser.email,
          password: '',
          role: mockUser.role
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setLoading(false);
      navigate('/users');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
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
        // await api.put(`/admin/users/${id}`, formData);
        console.log('Atualizando usuário:', formData);
      } else {
        // await api.post('/admin/users', formData);
        console.log('Criando usuário:', formData);
      }
      
      // Simulação
      setTimeout(() => {
        setLoading(false);
        alert(`Usuário ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        navigate('/users');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setLoading(false);
      alert('Erro ao salvar usuário. Tente novamente.');
    }
  };
  
  return (
    <FormContainer>
      <Header>
        <Title>{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/users')}>
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
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite o nome completo"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o email"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Senha {isEditMode && '(deixe em branco para manter a atual)'}</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditMode ? 'Digite a nova senha (opcional)' : 'Digite a senha'}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CUSTOMER">Cliente</option>
              <option value="RESTAURANT">Restaurante</option>
              <option value="ADMIN">Administrador</option>
            </Select>
          </FormGroup>
        </form>
      </FormCard>
    </FormContainer>
  );
};

export default UserForm;
