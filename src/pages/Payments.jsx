import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEye, FaSearch, FaFilter, FaFileExport, FaMoneyBill, FaChartBar } from 'react-icons/fa';
import api from '../services/api';

const PaymentsContainer = styled.div`
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background-color: ${props => props.bgColor || '#e0f2fe'};
  color: ${props => props.color || '#0284c7'};
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
      case 'COMPLETED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      case 'REFUNDED': return '#6366f1';
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

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  
  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, [currentPage, statusFilter, dateFilter]);
  
  const fetchPaymentStats = async () => {
    try {
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get('/payments/stats/overview');
      // setStats(response.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        setStats({
          completedPayments: 156,
          pendingPayments: 23,
          failedPayments: 8,
          totalRevenue: 12589.90
        });
      }, 300);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de pagamentos:', error);
    }
  };
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get('/payments', {
      //   params: {
      //     page: currentPage,
      //     status: statusFilter,
      //     date: dateFilter,
      //     search: searchTerm
      //   }
      // });
      // setPayments(response.data.payments);
      // setTotalPages(response.data.totalPages);
      // setTotalPayments(response.data.totalPayments);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockPayments = [
          {
            id: 'PAY-001234',
            orderId: 'ORD-001234',
            customer: {
              id: 1,
              name: 'João Silva'
            },
            restaurant: {
              id: 1,
              name: 'Restaurante Bom Sabor'
            },
            amount: 89.90,
            method: 'CREDIT_CARD',
            status: 'COMPLETED',
            createdAt: '2023-05-15T14:35:00Z',
            updatedAt: '2023-05-15T14:37:00Z'
          },
          {
            id: 'PAY-001235',
            orderId: 'ORD-001235',
            customer: {
              id: 2,
              name: 'Maria Oliveira'
            },
            restaurant: {
              id: 2,
              name: 'Sabor Caseiro'
            },
            amount: 45.50,
            method: 'PIX',
            status: 'COMPLETED',
            createdAt: '2023-05-15T15:50:00Z',
            updatedAt: '2023-05-15T15:52:00Z'
          },
          {
            id: 'PAY-001236',
            orderId: 'ORD-001236',
            customer: {
              id: 3,
              name: 'Pedro Santos'
            },
            restaurant: {
              id: 3,
              name: 'Cantina Italiana'
            },
            amount: 120.00,
            method: 'CREDIT_CARD',
            status: 'PENDING',
            createdAt: '2023-05-15T16:25:00Z',
            updatedAt: '2023-05-15T16:25:00Z'
          },
          {
            id: 'PAY-001237',
            orderId: 'ORD-001237',
            customer: {
              id: 4,
              name: 'Ana Souza'
            },
            restaurant: {
              id: 4,
              name: 'Sushi Express'
            },
            amount: 75.80,
            method: 'CASH',
            status: 'COMPLETED',
            createdAt: '2023-05-15T17:15:00Z',
            updatedAt: '2023-05-15T17:30:00Z'
          },
          {
            id: 'PAY-001238',
            orderId: 'ORD-001238',
            customer: {
              id: 5,
              name: 'Carlos Ferreira'
            },
            restaurant: {
              id: 5,
              name: 'Burger King'
            },
            amount: 35.90,
            method: 'PIX',
            status: 'FAILED',
            createdAt: '2023-05-15T18:10:00Z',
            updatedAt: '2023-05-15T18:15:00Z'
          },
          {
            id: 'PAY-001239',
            orderId: 'ORD-001239',
            customer: {
              id: 6,
              name: 'Fernanda Lima'
            },
            restaurant: {
              id: 6,
              name: 'Pizzaria Napolitana'
            },
            amount: 95.00,
            method: 'CREDIT_CARD',
            status: 'REFUNDED',
            createdAt: '2023-05-15T19:35:00Z',
            updatedAt: '2023-05-15T20:10:00Z'
          },
        ];
        
        // Filtrar por status se necessário
        let filteredPayments = mockPayments;
        if (statusFilter) {
          filteredPayments = filteredPayments.filter(payment => payment.status === statusFilter);
        }
        
        // Filtrar por termo de busca se necessário
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredPayments = filteredPayments.filter(payment => 
            payment.id.toLowerCase().includes(term) || 
            payment.orderId.toLowerCase().includes(term) ||
            payment.customer.name.toLowerCase().includes(term) ||
            payment.restaurant.name.toLowerCase().includes(term)
          );
        }
        
        setPayments(filteredPayments);
        setTotalPages(2);
        setTotalPayments(filteredPayments.length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPayments();
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
      case 'COMPLETED': return 'Concluído';
      case 'PENDING': return 'Pendente';
      case 'FAILED': return 'Falhou';
      case 'REFUNDED': return 'Reembolsado';
      default: return status;
    }
  };
  
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'CREDIT_CARD': return 'Cartão de Crédito';
      case 'DEBIT_CARD': return 'Cartão de Débito';
      case 'PIX': return 'PIX';
      case 'CASH': return 'Dinheiro';
      default: return method;
    }
  };
  
  return (
    <PaymentsContainer>
      <Header>
        <Title>Pagamentos</Title>
        <ActionButtons>
          <Button onClick={handleExportData}>
            <FaFileExport /> Exportar
          </Button>
        </ActionButtons>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <StatIcon bgColor="#dcfce7" color="#16a34a">
            <FaMoneyBill />
          </StatIcon>
          <StatTitle>Receita Total</StatTitle>
          <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="#e0f2fe" color="#0284c7">
            <FaChartBar />
          </StatIcon>
          <StatTitle>Pagamentos Concluídos</StatTitle>
          <StatValue>{stats.completedPayments}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706">
            <FaChartBar />
          </StatIcon>
          <StatTitle>Pagamentos Pendentes</StatTitle>
          <StatValue>{stats.pendingPayments}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="#fee2e2" color="#dc2626">
            <FaChartBar />
          </StatIcon>
          <StatTitle>Pagamentos Falhos</StatTitle>
          <StatValue>{stats.failedPayments}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <FiltersContainer>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Buscar por ID, pedido, cliente ou restaurante..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterSelect 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
          >
            <option value="">Todos os status</option>
            <option value="COMPLETED">Concluído</option>
            <option value="PENDING">Pendente</option>
            <option value="FAILED">Falhou</option>
            <option value="REFUNDED">Reembolsado</option>
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
      ) : payments.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>ID do Pagamento</Th>
                <Th>ID do Pedido</Th>
                <Th>Cliente</Th>
                <Th>Restaurante</Th>
                <Th>Valor</Th>
                <Th>Método</Th>
                <Th>Data</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <Td>{payment.id}</Td>
                  <Td>{payment.orderId}</Td>
                  <Td>{payment.customer.name}</Td>
                  <Td>{payment.restaurant.name}</Td>
                  <Td>{formatCurrency(payment.amount)}</Td>
                  <Td>{getPaymentMethodLabel(payment.method)}</Td>
                  <Td>{formatDate(payment.createdAt)}</Td>
                  <Td>
                    <StatusBadge status={payment.status}>
                      {getStatusLabel(payment.status)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <Link to={`/payments/${payment.id}`}>
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
              Mostrando {payments.length} de {totalPayments} pagamentos
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
          Nenhum pagamento encontrado com os filtros selecionados.
        </NoResults>
      )}
    </PaymentsContainer>
  );
};

export default Payments;
