import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import NavComponents from './NavComponents';
import LogoutButton from './LogoutButton';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 260px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 0 24px 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #0284c7;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #f8fafc;
  padding: 24px;
  overflow-y: auto;
`;

const Layout = () => {
  const { user } = useAuth();
  
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'RESTAURANT':
        return 'Restaurante';
      case 'CUSTOMER':
        return 'Cliente';
      case 'DELIVERY':
        return 'Entregador';
      default:
        return role;
    }
  };
  
  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>FoodDelivery</Logo>
        </SidebarHeader>
        
        <NavComponents />
        
        <SidebarFooter>
          <UserInfo>
            <UserAvatar>{getInitials(user?.name)}</UserAvatar>
            <UserDetails>
              <UserName>{user?.name}</UserName>
              <UserRole>{getRoleLabel(user?.role)}</UserRole>
            </UserDetails>
          </UserInfo>
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
