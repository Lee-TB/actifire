import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import styled from 'styled-components';

const NavbarStyled = styled.div`
  margin-bottom: 8px;
`;

const menuItems = [
  { key: 'activities', label: <NavLink to="activities">Activities</NavLink> },
  { key: 'members', label: <NavLink to="members">Members</NavLink> },
];

function Room() {
  const location = useLocation();
  return (
    <>
      <NavbarStyled>
        <Menu
          mode="horizontal"
          items={menuItems}
          selectedKeys={[
            location.pathname.slice(location.pathname.lastIndexOf('/') + 1),
          ]}
        ></Menu>
      </NavbarStyled>

      <Outlet />
    </>
  );
}

export default Room;
