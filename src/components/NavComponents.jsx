import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaUsers, 
  FaUtensils, 
  FaShoppingCart, 
  FaCreditCard, 
  FaChartBar,
  FaMotorcycle,
  FaRoute
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  &.active {
    background-color: #e0f2fe;
    color: #0284c7;
    font-weight: 500;
  }
  
  svg {
    font-size: 18px;
  }
`;

const NavSection = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 16px 16px 8px;
  letter-spacing: 0.05em;
`;

const NavComponents = () => {
  const { user } = useAuth();
  
  // Verificar se o usuário é admin
  const isAdmin = user && user.role === 'ADMIN';
  
  return (
    <NavContainer>
      <NavSection>
        <NavItem to="/" end>
          <FaHome /> Dashboard
        </NavItem>
      </NavSection>
      
      {isAdmin && (
        <>
          <NavSection>
            <SectionTitle>Gerenciamento</SectionTitle>
            <NavItem to="/users">
              <FaUsers /> Usuários
            </NavItem>
            <NavItem to="/restaurants">
              <FaUtensils /> Restaurantes
            </NavItem>
            <NavItem to="/delivery-persons">
              <FaMotorcycle /> Entregadores
            </NavItem>
            <NavItem to="/delivery-fee-config">
              <FaRoute /> Taxas de Entrega
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>Operações</SectionTitle>
            <NavItem to="/orders">
              <FaShoppingCart /> Pedidos
            </NavItem>
            <NavItem to="/payments">
              <FaCreditCard /> Pagamentos
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>Relatórios</SectionTitle>
            <NavItem to="/statistics">
              <FaChartBar /> Estatísticas
            </NavItem>
          </NavSection>
        </>
      )}
    </NavContainer>
  );
};

export default NavComponents;
