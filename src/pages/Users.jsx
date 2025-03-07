import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import api from '../services/api';
import { Link } from 'react-router-dom';

const UsersContainer = styled.div`
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
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #059669;
  }
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.role) {
      case 'ADMIN':
        return '#3b82f6';
      case 'RESTAURANT':
        return '#10b981';
      case 'CUSTOMER':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  }};
  color: white;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/admin/users?page=${currentPage}&search=${searchTerm}`);
      // setUsers(response.data.users);
      // setTotalPages(response.data.totalPages);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockUsers = [
          { id: 1, name: 'João Silva', email: 'joao@example.com', role: 'ADMIN', createdAt: '2023-01-15' },
          { id: 2, name: 'Maria Oliveira', email: 'maria@example.com', role: 'CUSTOMER', createdAt: '2023-02-20' },
          { id: 3, name: 'Restaurante Bom Sabor', email: 'bomsabor@example.com', role: 'RESTAURANT', createdAt: '2023-01-10' },
          { id: 4, name: 'Pedro Santos', email: 'pedro@example.com', role: 'CUSTOMER', createdAt: '2023-03-05' },
          { id: 5, name: 'Ana Costa', email: 'ana@example.com', role: 'CUSTOMER', createdAt: '2023-02-28' },
          { id: 6, name: 'Restaurante Sabor Caseiro', email: 'saborcaseiro@example.com', role: 'RESTAURANT', createdAt: '2023-01-25' },
          { id: 7, name: 'Carlos Mendes', email: 'carlos@example.com', role: 'ADMIN', createdAt: '2023-03-10' },
          { id: 8, name: 'Lucia Ferreira', email: 'lucia@example.com', role: 'CUSTOMER', createdAt: '2023-03-15' },
        ];
        
        setUsers(mockUsers);
        setTotalPages(3);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };
  
  const handleDeleteUser = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        // Em um cenário real, você enviaria a requisição para a API
        // await api.delete(`/admin/users/${id}`);
        
        // Simulação
        setUsers(users.filter(user => user.id !== id));
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Tente novamente.');
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getRoleName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'RESTAURANT':
        return 'Restaurante';
      case 'CUSTOMER':
        return 'Cliente';
      default:
        return role;
    }
  };
  
  return (
    <UsersContainer>
      <Header>
        <Title>Usuários</Title>
        <Link to="/users/new">
          <ActionButton>
            <FaPlus /> Novo Usuário
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
            placeholder="Buscar usuários..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </form>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Tipo</Th>
                <Th>Data de Cadastro</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge role={user.role}>{getRoleName(user.role)}</Badge>
                  </Td>
                  <Td>{formatDate(user.createdAt)}</Td>
                  <Td>
                    <ActionButtons>
                      <Link to={`/users/edit/${user.id}`}>
                        <EditButton>
                          <FaEdit />
                        </EditButton>
                      </Link>
                      <DeleteButton onClick={() => handleDeleteUser(user.id)}>
                        <FaTrash />
                      </DeleteButton>
                    </ActionButtons>
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
    </UsersContainer>
  );
};

export default Users;
