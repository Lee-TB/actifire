import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'antd';
import styled from 'styled-components';

const NavbarStyled = styled.div`
  margin-bottom: 8px;
`;

const menuItems = [
  { key: 'activities', label: <NavLink to="">Activities</NavLink> },
  { key: 'members', label: <NavLink to="members">Members</NavLink> },
];

function Room() {
  return (
    <>
      <NavbarStyled>
        <Menu mode="horizontal" items={menuItems}></Menu>
      </NavbarStyled>

      <Outlet />
    </>
  );
}

export default Room;
