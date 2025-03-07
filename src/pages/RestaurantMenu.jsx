import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
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
  
  &:hover {
    text-decoration: underline;
  }
`;

const AddButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 30px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  padding: 10px 15px;
  border-radius: 4px;
`;

const CategoryTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color || '#2196F3'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const DishCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DishImage = styled.div`
  height: 180px;
  background-image: url(${props => props.image || 'https://via.placeholder.com/300x180?text=Sem+Imagem'});
  background-size: cover;
  background-position: center;
`;

const DishInfo = styled.div`
  padding: 15px;
`;

const DishName = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 5px;
`;

const DishDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const DishPrice = styled.div`
  font-weight: 600;
  color: #4CAF50;
  font-size: 16px;
  margin-bottom: 10px;
`;

const DishActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AvailabilityToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
  }
  
  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + span {
    background-color: #4CAF50;
  }
  
  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const DishButtonsContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
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

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const RestaurantMenu = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showDishModal, setShowDishModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // Form states
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    isAvailable: true,
    categoryId: ''
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: ''
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
      
      // Get categories
      const categoriesResponse = await api.get(`/categories/restaurant/${restaurantData.id}`);
      setCategories(categoriesResponse.data);
      
      // Get dishes
      const dishesResponse = await api.get(`/dishes/restaurant/${restaurantData.id}`);
      setDishes(dishesResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Erro ao carregar dados do restaurante');
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (dishId, currentStatus) => {
    try {
      await api.put(`/dishes/${dishId}`, { isAvailable: !currentStatus });
      
      // Update local state
      setDishes(dishes.map(dish => 
        dish.id === dishId ? { ...dish, isAvailable: !currentStatus } : dish
      ));
      
      toast.success('Disponibilidade atualizada com sucesso');
    } catch (error) {
      console.error('Error updating dish availability:', error);
      toast.error('Erro ao atualizar disponibilidade');
    }
  };

  const handleAddDish = () => {
    setCurrentDish(null);
    setDishForm({
      name: '',
      description: '',
      price: '',
      image: '',
      isAvailable: true,
      categoryId: categories.length > 0 ? categories[0].id : ''
    });
    setShowDishModal(true);
  };

  const handleEditDish = (dish) => {
    setCurrentDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description || '',
      price: dish.price.toString(),
      image: dish.image || '',
      isAvailable: dish.isAvailable,
      categoryId: dish.categoryId || ''
    });
    setShowDishModal(true);
  };

  const handleDeleteDish = async (dishId) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(`/dishes/${dishId}`);
        setDishes(dishes.filter(dish => dish.id !== dishId));
        toast.success('Item excluído com sucesso');
      } catch (error) {
        console.error('Error deleting dish:', error);
        toast.error('Erro ao excluir item');
      }
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setCategoryForm({ name: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategoryForm({ name: category.name });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Todos os itens associados serão movidos para "Sem categoria".')) {
      try {
        await api.delete(`/categories/${categoryId}`);
        setCategories(categories.filter(category => category.id !== categoryId));
        
        // Update dishes that were in this category
        setDishes(dishes.map(dish => 
          dish.categoryId === categoryId ? { ...dish, categoryId: null } : dish
        ));
        
        toast.success('Categoria excluída com sucesso');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Erro ao excluir categoria');
      }
    }
  };

  const handleDishFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishForm({
      ...dishForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryFormChange = (e) => {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = {
        ...dishForm,
        price: parseFloat(dishForm.price),
        restaurantId: restaurant.id
      };
      
      if (currentDish) {
        // Update existing dish
        await api.put(`/dishes/${currentDish.id}`, formData);
        
        // Update local state
        setDishes(dishes.map(dish => 
          dish.id === currentDish.id ? { ...dish, ...formData } : dish
        ));
        
        toast.success('Item atualizado com sucesso');
      } else {
        // Create new dish
        const response = await api.post('/dishes', formData);
        
        // Update local state
        setDishes([...dishes, response.data]);
        
        toast.success('Item adicionado com sucesso');
      }
      
      setShowDishModal(false);
    } catch (error) {
      console.error('Error saving dish:', error);
      toast.error('Erro ao salvar item');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = {
        ...categoryForm,
        restaurantId: restaurant.id
      };
      
      if (currentCategory) {
        // Update existing category
        await api.put(`/categories/${currentCategory.id}`, formData);
        
        // Update local state
        setCategories(categories.map(category => 
          category.id === currentCategory.id ? { ...category, ...formData } : category
        ));
        
        toast.success('Categoria atualizada com sucesso');
      } else {
        // Create new category
        const response = await api.post('/categories', formData);
        
        // Update local state
        setCategories([...categories, response.data]);
        
        toast.success('Categoria adicionada com sucesso');
      }
      
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Erro ao salvar categoria');
    }
  };

  if (loading) {
    return <Container>Carregando cardápio...</Container>;
  }

  if (!restaurant) {
    return <Container>Restaurante não encontrado</Container>;
  }

  // Group dishes by category
  const dishesByCategory = {};
  
  // Add all categories first
  categories.forEach(category => {
    dishesByCategory[category.id] = {
      category,
      dishes: []
    };
  });
  
  // Add "No Category" group
  dishesByCategory['no-category'] = {
    category: { id: 'no-category', name: 'Sem Categoria' },
    dishes: []
  };
  
  // Add dishes to their categories
  dishes.forEach(dish => {
    if (dish.categoryId && dishesByCategory[dish.categoryId]) {
      dishesByCategory[dish.categoryId].dishes.push(dish);
    } else {
      dishesByCategory['no-category'].dishes.push(dish);
    }
  });

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <BackButton onClick={() => navigate('/restaurant')}>
            <FaArrowLeft /> Voltar ao Painel
          </BackButton>
          <Title>Gerenciar Cardápio</Title>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <AddButton onClick={handleAddCategory}>
            <FaPlus /> Nova Categoria
          </AddButton>
          <AddButton onClick={handleAddDish}>
            <FaPlus /> Novo Item
          </AddButton>
        </div>
      </Header>
      
      {Object.values(dishesByCategory).map(({ category, dishes }) => (
        dishes.length > 0 && (
          <CategorySection key={category.id}>
            <CategoryHeader>
              <CategoryTitle>{category.name}</CategoryTitle>
              {category.id !== 'no-category' && (
                <CategoryActions>
                  <ActionButton onClick={() => handleEditCategory(category)}>
                    <FaEdit /> Editar
                  </ActionButton>
                  <ActionButton color="#F44336" onClick={() => handleDeleteCategory(category.id)}>
                    <FaTrash /> Excluir
                  </ActionButton>
                </CategoryActions>
              )}
            </CategoryHeader>
            
            <DishesGrid>
              {dishes.map(dish => (
                <DishCard key={dish.id}>
                  <DishImage image={dish.image} />
                  <DishInfo>
                    <DishName>{dish.name}</DishName>
                    <DishDescription>{dish.description || 'Sem descrição'}</DishDescription>
                    <DishPrice>{formatCurrency(dish.price)}</DishPrice>
                    <DishActions>
                      <AvailabilityToggle>
                        <ToggleLabel>Disponível</ToggleLabel>
                        <ToggleSwitch>
                          <input 
                            type="checkbox" 
                            checked={dish.isAvailable} 
                            onChange={() => handleToggleAvailability(dish.id, dish.isAvailable)}
                          />
                          <span></span>
                        </ToggleSwitch>
                      </AvailabilityToggle>
                      <DishButtonsContainer>
                        <ActionButton onClick={() => handleEditDish(dish)}>
                          <FaEdit />
                        </ActionButton>
                        <ActionButton color="#F44336" onClick={() => handleDeleteDish(dish.id)}>
                          <FaTrash />
                        </ActionButton>
                      </DishButtonsContainer>
                    </DishActions>
                  </DishInfo>
                </DishCard>
              ))}
            </DishesGrid>
          </CategorySection>
        )
      ))}
      
      {/* Dish Modal */}
      {showDishModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{currentDish ? 'Editar Item' : 'Novo Item'}</ModalTitle>
              <CloseButton onClick={() => setShowDishModal(false)}>×</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleDishSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nome *</Label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={dishForm.name} 
                  onChange={handleDishFormChange} 
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Descrição</Label>
                <TextArea 
                  id="description" 
                  name="description" 
                  value={dishForm.description} 
                  onChange={handleDishFormChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input 
                  type="number" 
                  id="price" 
                  name="price" 
                  value={dishForm.price} 
                  onChange={handleDishFormChange} 
                  step="0.01" 
                  min="0" 
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input 
                  type="text" 
                  id="image" 
                  name="image" 
                  value={dishForm.image} 
                  onChange={handleDishFormChange} 
                  placeholder="https://exemplo.com/imagem.jpg" 
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="categoryId">Categoria</Label>
                <Select 
                  id="categoryId" 
                  name="categoryId" 
                  value={dishForm.categoryId} 
                  onChange={handleDishFormChange}
                >
                  <option value="">Sem Categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Input 
                    type="checkbox" 
                    name="isAvailable" 
                    checked={dishForm.isAvailable} 
                    onChange={handleDishFormChange} 
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  Disponível para pedidos
                </Label>
              </FormGroup>
              
              <SubmitButton type="submit">
                {currentDish ? 'Atualizar Item' : 'Adicionar Item'}
              </SubmitButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
      
      {/* Category Modal */}
      {showCategoryModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{currentCategory ? 'Editar Categoria' : 'Nova Categoria'}</ModalTitle>
              <CloseButton onClick={() => setShowCategoryModal(false)}>×</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleCategorySubmit}>
              <FormGroup>
                <Label htmlFor="categoryName">Nome da Categoria *</Label>
                <Input 
                  type="text" 
                  id="categoryName" 
                  name="name" 
                  value={categoryForm.name} 
                  onChange={handleCategoryFormChange} 
                  required 
                />
              </FormGroup>
              
              <SubmitButton type="submit">
                {currentCategory ? 'Atualizar Categoria' : 'Adicionar Categoria'}
              </SubmitButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default RestaurantMenu;
