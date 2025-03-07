import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaSearch, FaMotorcycle, FaBicycle, FaCar, FaTruck, FaCircle, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
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
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0 12px;
  flex: 1;
  max-width: 400px;
  
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const SearchIcon = styled.div`
  color: #94a3b8;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 0;
  border: none;
  outline: none;
  font-size: 14px;
  
  &::placeholder {
    color: #cbd5e1;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #1e293b;
  outline: none;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
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
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#dcfce7';
      case 'BUSY': return '#fef3c7';
      case 'OFFLINE': return '#f1f5f9';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#16a34a';
      case 'BUSY': return '#d97706';
      case 'OFFLINE': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#16a34a';
      case 'BUSY': return '#d97706';
      case 'OFFLINE': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.delete ? '#ef4444' : '#3b82f6'};
  border: none;
  padding: 4px;
  margin-right: 8px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: ${props => props.delete ? '#dc2626' : '#2563eb'};
  }
`;

const VehicleIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  margin-right: 8px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#1e293b'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
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

const DeliveryPersons = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchDeliveryPersons();
  }, [currentPage, statusFilter, activeFilter, vehicleFilter]);
  
  const fetchDeliveryPersons = async () => {
    try {
      setLoading(true);
      
      let queryParams = `?skip=${(currentPage - 1) * 10}&take=10`;
      
      if (statusFilter) {
        queryParams += `&status=${statusFilter}`;
      }
      
      if (activeFilter) {
        queryParams += `&isActive=${activeFilter}`;
      }
      
      if (search) {
        queryParams += `&search=${search}`;
      }
      
      const response = await api.get(`/delivery-persons${queryParams}`);
      
      setDeliveryPersons(response.data.items);
      setTotalPages(Math.ceil(response.data.total / 10));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar entregadores:', error);
      setLoading(false);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockDeliveryPersons = [
          {
            id: '1',
            user: {
              id: '101',
              name: 'João Silva',
              email: 'joao.silva@example.com'
            },
            cpf: '123.456.789-00',
            phone: '(11) 98765-4321',
            vehicleType: 'MOTORCYCLE',
            vehiclePlate: 'ABC1234',
            status: 'AVAILABLE',
            isActive: true,
            rating: 4.8,
            createdAt: '2023-01-15T10:30:00Z'
          },
          {
            id: '2',
            user: {
              id: '102',
              name: 'Maria Oliveira',
              email: 'maria.oliveira@example.com'
            },
            cpf: '987.654.321-00',
            phone: '(11) 91234-5678',
            vehicleType: 'BICYCLE',
            vehiclePlate: null,
            status: 'BUSY',
            isActive: true,
            rating: 4.5,
            createdAt: '2023-02-20T14:45:00Z'
          },
          {
            id: '3',
            user: {
              id: '103',
              name: 'Pedro Santos',
              email: 'pedro.santos@example.com'
            },
            cpf: '456.789.123-00',
            phone: '(11) 95678-1234',
            vehicleType: 'CAR',
            vehiclePlate: 'XYZ5678',
            status: 'OFFLINE',
            isActive: false,
            rating: 3.9,
            createdAt: '2023-03-10T09:15:00Z'
          },
          {
            id: '4',
            user: {
              id: '104',
              name: 'Ana Costa',
              email: 'ana.costa@example.com'
            },
            cpf: '789.123.456-00',
            phone: '(11) 94321-8765',
            vehicleType: 'MOTORCYCLE',
            vehiclePlate: 'DEF5678',
            status: 'AVAILABLE',
            isActive: true,
            rating: 4.9,
            createdAt: '2023-04-05T16:20:00Z'
          },
          {
            id: '5',
            user: {
              id: '105',
              name: 'Carlos Ferreira',
              email: 'carlos.ferreira@example.com'
            },
            cpf: '321.654.987-00',
            phone: '(11) 98765-1234',
            vehicleType: 'CAR',
            vehiclePlate: 'GHI9012',
            status: 'BUSY',
            isActive: true,
            rating: 4.2,
            createdAt: '2023-05-12T11:10:00Z'
          }
        ];
        
        setDeliveryPersons(mockDeliveryPersons);
        setTotalPages(3);
        setLoading(false);
      }, 500);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDeliveryPersons();
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este entregador?')) {
      try {
        await api.delete(`/delivery-persons/${id}`);
        fetchDeliveryPersons();
      } catch (error) {
        console.error('Erro ao excluir entregador:', error);
        alert('Erro ao excluir entregador. Tente novamente.');
      }
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponível';
      case 'BUSY': return 'Ocupado';
      case 'OFFLINE': return 'Offline';
      default: return status;
    }
  };
  
  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 'BICYCLE': return 'Bicicleta';
      case 'MOTORCYCLE': return 'Moto';
      case 'CAR': return 'Carro';
      case 'VAN': return 'Van';
      default: return type;
    }
  };
  
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'BICYCLE':
        return <FaBicycle />;
      case 'MOTORCYCLE':
        return <FaMotorcycle />;
      case 'CAR':
        return <FaCar />;
      case 'VAN':
        return <FaTruck />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <Container>
      <Header>
        <Title>Entregadores</Title>
        <Link to="/delivery-persons/new">
          <Button primary>
            <FaPlus /> Novo Entregador
          </Button>
        </Link>
      </Header>
      
      <FiltersContainer>
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px' }}>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar por nome, email ou telefone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchContainer>
        </form>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Status: Todos</option>
          <option value="AVAILABLE">Disponível</option>
          <option value="BUSY">Ocupado</option>
          <option value="OFFLINE">Offline</option>
        </FilterSelect>
        
        <FilterSelect
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Situação: Todos</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </FilterSelect>
        
        <FilterSelect
          value={vehicleFilter}
          onChange={(e) => {
            setVehicleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Veículo: Todos</option>
          <option value="BICYCLE">Bicicleta</option>
          <option value="MOTORCYCLE">Moto</option>
          <option value="CAR">Carro</option>
          <option value="VAN">Van</option>
        </FilterSelect>
      </FiltersContainer>
      
      {loading ? (
        <p>Carregando entregadores...</p>
      ) : deliveryPersons.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Contato</Th>
                <Th>Veículo</Th>
                <Th>Status</Th>
                <Th>Avaliação</Th>
                <Th>Cadastro</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {deliveryPersons.map(deliveryPerson => (
                <tr key={deliveryPerson.id}>
                  <Td>
                    <Link to={`/delivery-persons/${deliveryPerson.id}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {deliveryPerson.user.name}
                    </Link>
                    {!deliveryPerson.isActive && (
                      <span style={{ 
                        marginLeft: '8px', 
                        padding: '2px 6px', 
                        backgroundColor: '#fee2e2', 
                        color: '#dc2626', 
                        borderRadius: '9999px', 
                        fontSize: '10px' 
                      }}>
                        Inativo
                      </span>
                    )}
                  </Td>
                  <Td>
                    <div>{deliveryPerson.user.email}</div>
                    <div style={{ color: '#64748b' }}>{deliveryPerson.phone}</div>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <VehicleIcon>
                        {getVehicleIcon(deliveryPerson.vehicleType)}
                      </VehicleIcon>
                      {getVehicleTypeLabel(deliveryPerson.vehicleType)}
                    </div>
                    {deliveryPerson.vehiclePlate && (
                      <div style={{ color: '#64748b', marginLeft: '32px' }}>
                        Placa: {deliveryPerson.vehiclePlate}
                      </div>
                    )}
                  </Td>
                  <Td>
                    <StatusBadge status={deliveryPerson.status}>
                      <StatusDot status={deliveryPerson.status} />
                      {getStatusLabel(deliveryPerson.status)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
                      <FaStar style={{ marginRight: '4px' }} />
                      {deliveryPerson.rating.toFixed(1)}
                    </div>
                  </Td>
                  <Td>{formatDate(deliveryPerson.createdAt)}</Td>
                  <Td>
                    <Link to={`/delivery-persons/edit/${deliveryPerson.id}`}>
                      <ActionButton>
                        <FaEdit />
                      </ActionButton>
                    </Link>
                    <ActionButton delete onClick={() => handleDelete(deliveryPerson.id)}>
                      <FaTrash />
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PageButton
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}
            
            <PageButton
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </PageButton>
          </Pagination>
        </>
      ) : (
        <NoResults>
          Nenhum entregador encontrado com os filtros selecionados.
        </NoResults>
      )}
    </Container>
  );
};

export default DeliveryPersons;
