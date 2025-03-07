import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUtensils, FaClipboardList, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #1e293b;
  color: white;
  padding: 20px 0;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #334155;
  margin-bottom: 20px;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 5px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: #334155;
    color: white;
  }
  
  &.active {
    background-color: #334155;
    color: white;
    border-left-color: #3b82f6;
  }
  
  svg {
    margin-right: 10px;
  }
`;

const Content = styled.div`
  flex: 1;
  background-color: #f1f5f9;
  overflow-y: auto;
`;

const Header = styled.header`
  background-color: white;
  padding: 15px 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-right: 15px;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ef4444;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const Main = styled.main`
  padding: 30px;
`;

const RestaurantLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };
  
  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>Meu Restaurante</Logo>
        <NavMenu>
          <NavItem>
            <NavLink to="/restaurant" className={location.pathname === '/restaurant' ? 'active' : ''}>
              <FaHome /> Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/restaurant/menu" className={location.pathname === '/restaurant/menu' ? 'active' : ''}>
              <FaUtensils /> Cardápio
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/restaurant/orders" className={location.pathname.includes('/restaurant/orders') ? 'active' : ''}>
              <FaClipboardList /> Pedidos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/restaurant/profile" className={location.pathname === '/restaurant/profile' ? 'active' : ''}>
              <FaUser /> Perfil
            </NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      <Content>
        <Header>
          <h2>Painel do Restaurante</h2>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Sair
            </LogoutButton>
          </UserInfo>
        </Header>
        <Main>
          <Outlet />
        </Main>
      </Content>
    </LayoutContainer>
  );
};

export default RestaurantLayout;
