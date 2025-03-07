import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaStar, FaEye } from 'react-icons/fa';
import api from '../services/api';
import { Link } from 'react-router-dom';

const RestaurantsContainer = styled.div`
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

const ActionButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 8px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  border: none;
  flex: 1;
  padding: 8px;
  font-size: 14px;
  outline: none;
`;

const SearchIcon = styled.div`
  color: #64748b;
  margin-right: 8px;
`;

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const RestaurantCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const RestaurantImage = styled.div`
  height: 160px;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x160?text=Restaurante'});
  background-size: cover;
  background-position: center;
`;

const RestaurantInfo = styled.div`
  padding: 16px;
`;

const RestaurantName = styled.h3`
  margin: 0 0 8px 0;
  color: #1e293b;
`;

const RestaurantDescription = styled.p`
  margin: 0 0 16px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RestaurantMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const RestaurantRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f59e0b;
  font-weight: 500;
`;

const RestaurantStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.active ? '#10b981' : '#ef4444'};
  color: white;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
`;

const CardButton = styled.button`
  background-color: transparent;
  color: ${props => {
    if (props.view) return '#3b82f6';
    if (props.edit) return '#10b981';
    if (props.delete) return '#ef4444';
    return '#64748b';
  }};
  border: none;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background-color: #f8fafc;
    border-radius: 4px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#1e293b'};
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#f8fafc'};
  }
  
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchRestaurants();
  }, [currentPage]);
  
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/admin/restaurants?page=${currentPage}&search=${searchTerm}`);
      // setRestaurants(response.data.restaurants);
      // setTotalPages(response.data.totalPages);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockRestaurants = [
          { 
            id: 1, 
            name: 'Restaurante Bom Sabor', 
            description: 'Especializado em comida caseira com ingredientes frescos e de qualidade.',
            address: 'Rua das Flores, 123',
            phone: '(11) 98765-4321',
            rating: 4.7,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
            createdAt: '2023-01-10'
          },
          { 
            id: 2, 
            name: 'Sabor Caseiro', 
            description: 'Comida caseira com tempero especial que lembra a comida da vovó.',
            address: 'Av. Paulista, 1000',
            phone: '(11) 91234-5678',
            rating: 4.5,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
            createdAt: '2023-01-25'
          },
          { 
            id: 3, 
            name: 'Cantina Italiana', 
            description: 'Autêntica culinária italiana com massas frescas feitas na hora.',
            address: 'Rua Itália, 45',
            phone: '(11) 97777-8888',
            rating: 4.8,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
            createdAt: '2023-02-05'
          },
          { 
            id: 4, 
            name: 'Sushi Express', 
            description: 'O melhor da culinária japonesa com entrega rápida.',
            address: 'Av. Liberdade, 200',
            phone: '(11) 95555-6666',
            rating: 4.6,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
            createdAt: '2023-02-15'
          },
          { 
            id: 5, 
            name: 'Burger King', 
            description: 'Hambúrgueres suculentos e batatas fritas crocantes.',
            address: 'Shopping Center, Loja 45',
            phone: '(11) 94444-3333',
            rating: 4.2,
            isActive: false,
            imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
            createdAt: '2023-03-01'
          },
          { 
            id: 6, 
            name: 'Pizzaria Napolitana', 
            description: 'Pizzas artesanais com massa fina e ingredientes importados da Itália.',
            address: 'Rua Roma, 78',
            phone: '(11) 93333-2222',
            rating: 4.9,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
            createdAt: '2023-03-10'
          },
        ];
        
        setRestaurants(mockRestaurants);
        setTotalPages(2);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRestaurants();
  };
  
  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este restaurante?')) {
      try {
        // Em um cenário real, você enviaria a requisição para a API
        // await api.delete(`/admin/restaurants/${id}`);
        
        // Simulação
        setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
        alert('Restaurante excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir restaurante:', error);
        alert('Erro ao excluir restaurante. Tente novamente.');
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <RestaurantsContainer>
      <Header>
        <Title>Restaurantes</Title>
        <Link to="/restaurants/new">
          <ActionButton>
            <FaPlus /> Novo Restaurante
          </ActionButton>
        </Link>
      </Header>
      
      <form onSubmit={handleSearch}>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar restaurantes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </form>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <RestaurantGrid>
            {restaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id}>
                <RestaurantImage src={restaurant.imageUrl} />
                <RestaurantInfo>
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <RestaurantDescription>{restaurant.description}</RestaurantDescription>
                  
                  <RestaurantMeta>
                    <RestaurantRating>
                      <FaStar /> {restaurant.rating.toFixed(1)}
                    </RestaurantRating>
                    <RestaurantStatus active={restaurant.isActive}>
                      {restaurant.isActive ? 'Ativo' : 'Inativo'}
                    </RestaurantStatus>
                  </RestaurantMeta>
                  
                  <CardActions>
                    <Link to={`/restaurants/${restaurant.id}`}>
                      <CardButton view>
                        <FaEye /> Ver
                      </CardButton>
                    </Link>
                    <Link to={`/restaurants/edit/${restaurant.id}`}>
                      <CardButton edit>
                        <FaEdit /> Editar
                      </CardButton>
                    </Link>
                    <CardButton delete onClick={() => handleDeleteRestaurant(restaurant.id)}>
                      <FaTrash /> Excluir
                    </CardButton>
                  </CardActions>
                </RestaurantInfo>
              </RestaurantCard>
            ))}
          </RestaurantGrid>
          
          <Pagination>
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>
            
            {[...Array(totalPages).keys()].map(page => (
              <PageButton 
                key={page + 1}
                active={currentPage === page + 1}
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </PageButton>
            ))}
            
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próximo
            </PageButton>
          </Pagination>
        </>
      )}
    </RestaurantsContainer>
  );
};

export default Restaurants;
