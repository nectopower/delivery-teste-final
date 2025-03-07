import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrdersContainer = styled.div`
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
  background-color: #2196F3;
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
    background-color: #0b7dda;
  }
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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
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
        order.restaurant.name.toLowerCase().includes(term) ||
        (order.customer.user.name && order.customer.user.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredOrders(result);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
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

  return (
    <OrdersContainer>
      <Header>
        <Title>Gerenciamento de Pedidos</Title>
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
          Pronto para Retirada
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
      
      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <OrdersTable>
          <TableHead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Data</TableHeader>
              <TableHeader>Restaurante</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Ações</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.restaurant.name}</TableCell>
                  <TableCell>{order.customer.user.name}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status}>
                      {getStatusLabel(order.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleViewOrder(order.id)}>
                      <FaEye /> Ver Detalhes
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7" style={{ textAlign: 'center' }}>
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </OrdersTable>
      )}
    </OrdersContainer>
  );
};

export default Orders;
