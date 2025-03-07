import React from 'react';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  svg {
    font-size: 16px;
  }
`;

const LogoutButton = () => {
  const { signOut } = useAuth();
  
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      signOut();
    }
  };
  
  return (
    <Button onClick={handleLogout}>
      <FaSignOutAlt /> Sair
    </Button>
  );
};

export default LogoutButton;
