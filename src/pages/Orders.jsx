import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEye, FaSearch, FaFilter, FaFileExport } from 'react-icons/fa';
import api from '../services/api';

const OrdersContainer = styled.div`
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

const ActionButtons = styled.div`
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

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border-radius: 4px;
  padding: 8px 16px;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  flex: 1;
  padding: 4px 8px;
  font-size: 14px;
  outline: none;
`;

const SearchIcon = styled.div`
  color: #64748b;
  margin-right: 8px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const DateInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  
  &:last-child {
    text-align: right;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#8b5cf6';
      case 'delivering': return '#6366f1';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  }};
  color: white;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #3b82f6;
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
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PageInfo = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const PageButtons = styled.div`
  display: flex;
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

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-style: italic;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, dateFilter]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get('/admin/orders', {
      //   params: {
      //     page: currentPage,
      //     status: statusFilter,
      //     date: dateFilter,
      //     search: searchTerm
      //   }
      // });
      // setOrders(response.data.orders);
      // setTotalPages(response.data.totalPages);
      // setTotalOrders(response.data.totalOrders);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockOrders = [
          {
            id: 'ORD-001234',
            customer: {
              id: 1,
              name: 'João Silva'
            },
            restaurant: {
              id: 1,
              name: 'Restaurante Bom Sabor'
            },
            status: 'completed',
            total: 89.90,
            items: 3,
            createdAt: '2023-05-15T14:30:00Z',
            paymentMethod: 'credit_card'
          },
          {
            id: 'ORD-001235',
            customer: {
              id: 2,
              name: 'Maria Oliveira'
            },
            restaurant: {
              id: 2,
              name: 'Sabor Caseiro'
            },
            status: 'delivering',
            total: 45.50,
            items: 2,
            createdAt: '2023-05-15T15:45:00Z',
            paymentMethod: 'pix'
          },
          {
            id: 'ORD-001236',
            customer: {
              id: 3,
              name: 'Pedro Santos'
            },
            restaurant: {
              id: 3,
              name: 'Cantina Italiana'
            },
            status: 'preparing',
            total: 120.00,
            items: 4,
            createdAt: '2023-05-15T16:20:00Z',
            paymentMethod: 'credit_card'
          },
          {
            id: 'ORD-001237',
            customer: {
              id: 4,
              name: 'Ana Souza'
            },
            restaurant: {
              id: 4,
              name: 'Sushi Express'
            },
            status: 'pending',
            total: 75.80,
            items: 2,
            createdAt: '2023-05-15T17:10:00Z',
            paymentMethod: 'cash'
          },
          {
            id: 'ORD-001238',
            customer: {
              id: 5,
              name: 'Carlos Ferreira'
            },
            restaurant: {
              id: 5,
              name: 'Burger King'
            },
            status: 'cancelled',
            total: 35.90,
            items: 1,
            createdAt: '2023-05-15T18:05:00Z',
            paymentMethod: 'pix'
          },
          {
            id: 'ORD-001239',
            customer: {
              id: 6,
              name: 'Fernanda Lima'
            },
            restaurant: {
              id: 6,
              name: 'Pizzaria Napolitana'
            },
            status: 'ready',
            total: 95.00,
            items: 3,
            createdAt: '2023-05-15T19:30:00Z',
            paymentMethod: 'credit_card'
          },
        ];
        
        // Filtrar por status se necessário
        let filteredOrders = mockOrders;
        if (statusFilter) {
          filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }
        
        // Filtrar por termo de busca se necessário
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(term) || 
            order.customer.name.toLowerCase().includes(term) ||
            order.restaurant.name.toLowerCase().includes(term)
          );
        }
        
        setOrders(filteredOrders);
        setTotalPages(2);
        setTotalOrders(filteredOrders.length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleExportData = () => {
    alert('Funcionalidade de exportação de dados seria implementada aqui.');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivering': return 'Em entrega';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };
  
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'debit_card': return 'Cartão de Débito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  };
  
  return (
    <OrdersContainer>
      <Header>
        <Title>Pedidos</Title>
        <ActionButtons>
          <Button onClick={handleExportData}>
            <FaFileExport /> Exportar
          </Button>
        </ActionButtons>
      </Header>
      
      <FiltersContainer>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Buscar por ID, cliente ou restaurante..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterSelect 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Pronto</option>
            <option value="delivering">Em entrega</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </FilterSelect>
          
          <DateInput 
            type="date" 
            value={dateFilter}
            onChange={handleDateFilterChange}
          />
          
          <Button type="submit" primary>
            <FaFilter /> Filtrar
          </Button>
        </form>
      </FiltersContainer>
      
      {loading ? (
        <p>Carregando...</p>
      ) : orders.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>ID do Pedido</Th>
                <Th>Cliente</Th>
                <Th>Restaurante</Th>
                <Th>Data</Th>
                <Th>Valor</Th>
                <Th>Pagamento</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.customer.name}</Td>
                  <Td>{order.restaurant.name}</Td>
                  <Td>{formatDate(order.createdAt)}</Td>
                  <Td>{formatCurrency(order.total)}</Td>
                  <Td>{getPaymentMethodLabel(order.paymentMethod)}</Td>
                  <Td>
                    <StatusBadge status={order.status}>
                      {getStatusLabel(order.status)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <Link to={`/orders/${order.id}`}>
                      <ActionButton>
                        <FaEye /> Ver detalhes
                      </ActionButton>
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            <PageInfo>
              Mostrando {orders.length} de {totalOrders} pedidos
            </PageInfo>
            <PageButtons>
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
            </PageButtons>
          </Pagination>
        </>
      ) : (
        <NoResults>
          Nenhum pedido encontrado com os filtros selecionados.
        </NoResults>
      )}
    </OrdersContainer>
  );
};

export default Orders;
