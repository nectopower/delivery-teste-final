import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUsers, FaUtensils, FaClipboardList, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const SidebarContainer = styled.div`
  background-color: #2c3e50;
  color: white;
  width: 250px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
`;

const Logo = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  border-bottom: 1px solid #34495e;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
  padding: 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s;
  
  &:hover {
    background-color: #34495e;
  }
  
  &.active {
    background-color: #3498db;
    color: white;
  }
  
  svg {
    margin-right: 10px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  background: none;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  text-align: left;
  font-size: 16px;
  transition: all 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
  
  svg {
    margin-right: 10px;
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #34495e;
`;

const Sidebar = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <SidebarContainer>
      <Logo>Food Delivery</Logo>
      <NavMenu>
        <NavItem>
          <StyledNavLink to="/" end>
            <FaHome /> Dashboard
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/users">
            <FaUsers /> Usuários
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/restaurants">
            <FaUtensils /> Restaurantes
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/orders">
            <FaClipboardList /> Pedidos
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/payments">
            <FaCreditCard /> Pagamentos
          </StyledNavLink>
        </NavItem>
      </NavMenu>
      <Footer>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Sair
        </LogoutButton>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
