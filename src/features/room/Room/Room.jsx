import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'antd';
import styled from 'styled-components';

const NavbarStyled = styled.div`
  margin-bottom: 16px;
`;

function Room() {
  return (
    <>
      <NavbarStyled>
        <Menu mode="horizontal" defaultActiveFirst>
          <Menu.Item>
            <NavLink to="">Activities</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="members">Members</NavLink>
          </Menu.Item>
        </Menu>
      </NavbarStyled>

      <Outlet />
    </>
  );
}

export default Room;
