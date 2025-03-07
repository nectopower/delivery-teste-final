import React, { useState, useEffect } from 'react';
import { getPayments, updatePaymentStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PaymentsContainer = styled.div`
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

const PaymentsTable = styled.table`
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
      case 'COMPLETED': return '#4CAF50';
      case 'FAILED': return '#F44336';
      case 'REFUNDED': return '#9C27B0';
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

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getPayments();
      setPayments(response.data);
      setFilteredPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Erro ao carregar pagamentos');
      setLoading(false);
    }
  };

  useEffect(() => {
    filterPayments();
  }, [searchTerm, statusFilter, payments]);

  const filterPayments = () => {
    let result = [...payments];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(payment => 
        payment.id.toLowerCase().includes(term) ||
        payment.order.id.toLowerCase().includes(term) ||
        payment.order.restaurant.name.toLowerCase().includes(term) ||
        (payment.order.customer.user.name && payment.order.customer.user.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredPayments(result);
  };

  const handleViewPayment = (paymentId) => {
    navigate(`/payments/${paymentId}`);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updatePaymentStatus(id, status);
      toast.success(`Status do pagamento atualizado para ${getStatusLabel(status)}`);
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Erro ao atualizar status do pagamento');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'COMPLETED': return 'Concluído';
      case 'FAILED': return 'Falhou';
      case 'REFUNDED': return 'Reembolsado';
      default: return status;
    }
  };

  return (
    <PaymentsContainer>
      <Header>
        <Title>Gerenciamento de Pagamentos</Title>
        <SearchContainer>
          <FaSearch color="#999" />
          <SearchInput 
            type="text" 
            placeholder="Buscar pagamentos..." 
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
          active={statusFilter === 'COMPLETED'} 
          onClick={() => setStatusFilter('COMPLETED')}
        >
          Concluídos
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'FAILED'} 
          onClick={() => setStatusFilter('FAILED')}
        >
          Falhos
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'REFUNDED'} 
          onClick={() => setStatusFilter('REFUNDED')}
        >
          Reembolsados
        </FilterButton>
      </FiltersContainer>
      
      {loading ? (
        <p>Carregando pagamentos...</p>
      ) : (
        <PaymentsTable>
          <TableHead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Data</TableHeader>
              <TableHeader>Pedido</TableHeader>
              <TableHeader>Restaurante</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Valor</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Ações</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id.substring(0, 8)}...</TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewOrder(payment.order.id);
                      }}
                      style={{ color: '#2196F3', textDecoration: 'underline' }}
                    >
                      {payment.order.id.substring(0, 8)}...
                    </a>
                  </TableCell>
                  <TableCell>{payment.order.restaurant.name}</TableCell>
                  <TableCell>{payment.order.customer.user.name}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status}>
                      {getStatusLabel(payment.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButtonsContainer>
                      <ActionButton onClick={() => handleViewPayment(payment.id)}>
                        <FaEye /> Ver
                      </ActionButton>
                      
                      {payment.status === 'PENDING' && (
                        <>
                          <ActionButton 
                            color="#4CAF50" 
                            onClick={() => handleUpdateStatus(payment.id, 'COMPLETED')}
                          >
                            <FaCheck />
                          </ActionButton>
                          <ActionButton 
                            color="#F44336" 
                            onClick={() => handleUpdateStatus(payment.id, 'FAILED')}
                          >
                            <FaTimes />
                          </ActionButton>
                        </>
                      )}
                      
                      {payment.status === 'COMPLETED' && (
                        <ActionButton 
                          color="#9C27B0" 
                          onClick={() => handleUpdateStatus(payment.id, 'REFUNDED')}
                        >
                          Reembolsar
                        </ActionButton>
                      )}
                    </ActionButtonsContainer>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="8" style={{ textAlign: 'center' }}>
                  Nenhum pagamento encontrado
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </PaymentsTable>
      )}
    </PaymentsContainer>
  );
};

export default Payments;
