import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
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
  margin-right: 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px 12px;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  margin-left: 8px;
  flex: 1;
  font-size: 14px;
  &:focus {
    outline: none;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? '#4CAF50' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#e0e0e0'};
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-top: 1px solid #eee;
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
  margin-right: 5px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'PENDING': return '#FFC107';
      case 'ACCEPTED': return '#2196F3';
      case 'PREPARING': return '#9C27B0';
      case 'READY_FOR_PICKUP': return '#00BCD4';
      case 'OUT_FOR_DELIVERY': return '#FF9800';
      case 'DELIVERED': return '#4CAF50';
      case 'CANCELLED': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
  color: white;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#2196F3' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.active ? '#2196F3' : '#e0e0e0'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const RestaurantOrders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

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
      
      // Get restaurant orders
      const ordersResponse = await api.get(`/orders/restaurant/${restaurantData.id}`);
      const ordersData = ordersResponse.data;
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Erro ao carregar dados do restaurante');
      setLoading(false);
    }
  };

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const filterOrders = () => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.user.name.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status do pedido atualizado para ${getStatusLabel(newStatus)}`);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'ACCEPTED': return 'Aceito';
      case 'PREPARING': return 'Preparando';
      case 'READY_FOR_PICKUP': return 'Pronto para Retirada';
      case 'OUT_FOR_DELIVERY': return 'Em Entrega';
      case 'DELIVERED': return 'Entregue';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING': return 'ACCEPTED';
      case 'ACCEPTED': return 'PREPARING';
      case 'PREPARING': return 'READY_FOR_PICKUP';
      case 'READY_FOR_PICKUP': return 'OUT_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY': return 'DELIVERED';
      default: return null;
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Container>Carregando pedidos...</Container>;
  }

  if (!restaurant) {
    return <Container>Restaurante não encontrado</Container>;
  }

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BackButton onClick={() => navigate('/restaurant')}>
            <FaArrowLeft /> Voltar ao Painel
          </BackButton>
          <Title>Gerenciar Pedidos</Title>
        </div>
        <SearchContainer>
          <FaSearch color="#999" />
          <SearchInput 
            type="text" 
            placeholder="Buscar pedidos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>
      
      <FiltersContainer>
        <FilterButton 
          active={statusFilter === ''} 
          onClick={() => setStatusFilter('')}
        >
          <FaFilter /> Todos
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'PENDING'} 
          onClick={() => setStatusFilter('PENDING')}
        >
          Pendentes
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'ACCEPTED'} 
          onClick={() => setStatusFilter('ACCEPTED')}
        >
          Aceitos
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'PREPARING'} 
          onClick={() => setStatusFilter('PREPARING')}
        >
          Preparando
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'READY_FOR_PICKUP'} 
          onClick={() => setStatusFilter('READY_FOR_PICKUP')}
        >
          Prontos
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'OUT_FOR_DELIVERY'} 
          onClick={() => setStatusFilter('OUT_FOR_DELIVERY')}
        >
          Em Entrega
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'DELIVERED'} 
          onClick={() => setStatusFilter('DELIVERED')}
        >
          Entregues
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'CANCELLED'} 
          onClick={() => setStatusFilter('CANCELLED')}
        >
          Cancelados
        </FilterButton>
      </FiltersContainer>
      
      <OrdersTable>
        <TableHead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Data</TableHeader>
            <TableHeader>Cliente</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.customer.user.name}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status}>
                    {getStatusLabel(order.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtonsContainer>
                    <ActionButton 
                      onClick={() => navigate(`/restaurant/orders/${order.id}`)}
                    >
                      <FaEye /> Ver Detalhes
                    </ActionButton>
                    
                    {getNextStatus(order.status) && (
                      <ActionButton 
                        color="#4CAF50"
                        onClick={() => handleUpdateOrderStatus(order.id, getNextStatus(order.status))}
                      >
                        {order.status === 'PENDING' ? 'Aceitar' : 'Avançar Status'}
                      </ActionButton>
                    )}
                    
                    {order.status === 'PENDING' && (
                      <ActionButton 
                        color="#F44336"
                        onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                      >
                        Recusar
                      </ActionButton>
                    )}
                  </ActionButtonsContainer>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" style={{ textAlign: 'center' }}>
                Nenhum pedido encontrado
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </OrdersTable>
      
      {totalPages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => paginate(1)} 
            disabled={currentPage === 1}
          >
            Primeira
          </PageButton>
          
          <PageButton 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Anterior
          </PageButton>
          
          {[...Array(totalPages).keys()].map(number => (
            Math.abs(currentPage - (number + 1)) < 3 && (
              <PageButton 
                key={number + 1} 
                active={currentPage === number + 1} 
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </PageButton>
            )
          ))}
          
          <PageButton 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Próxima
          </PageButton>
          
          <PageButton 
            onClick={() => paginate(totalPages)} 
            disabled={currentPage === totalPages}
          >
            Última
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default RestaurantOrders;
