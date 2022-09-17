import React from 'react';
import { useParams } from 'react-router-dom';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Typography, Menu } from 'antd';
import styled from 'styled-components';

import { doc } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';

const { Title } = Typography;

const NavbarStyled = styled.div`
  margin-bottom: 8px;
`;

const menuItems = [
  { key: 'activities', label: <NavLink to="activities">Activities</NavLink> },
  { key: 'members', label: <NavLink to="members">Members</NavLink> },
];

function Room() {
  const location = useLocation();
  const { roomId } = useParams();
  const firestore = useFirestore();
  const { status: roomStatus, data: roomData } = useFirestoreDocData(
    doc(firestore, `rooms/${roomId}`)
  );

  return (
    <>
      <Title>
        {roomStatus === 'success' && roomData
          ? roomData?.roomName
          : 'Unknow room name'}
      </Title>
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
