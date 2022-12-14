import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Typography, Menu, message } from 'antd';
import styled from 'styled-components';

import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

function Room() {
  const { t } = useTranslation();
  const location = useLocation();
  const { roomId } = useParams();
  const firestore = useFirestore();
  const { status: roomStatus, data: roomData } = useFirestoreDocData(
    doc(firestore, `rooms/${roomId}`)
  );
  const [roomName, setRoomName] = useState('Unknow room name');
  const { status: userStatus, data: userData } = useUser();

  useEffect(() => {
    setRoomName(roomData?.roomName);
  }, [roomData?.roomName]);

  const saveRoomName = (value) => {
    if (value !== roomName) {
      updateDoc(doc(firestore, `rooms/${roomId}`), {
        roomName: value,
      })
        .then(() => {
          message.success('update room name success');
          setRoomName(value);
        })
        .catch((e) => {
          message.error('update room name error');
        });
    }
  };

  const menuItems = [
    { key: 'activities', label: <NavLinkStyled to="activities">{t("activities")}</NavLinkStyled> },
    { key: 'members', label: <NavLinkStyled to="members">{t("members")}</NavLinkStyled> },
    { key: 'settings', label: <NavLinkStyled to="settings">{t("settings")}</NavLinkStyled> },
  ];

  return (
    <>
      {userStatus === 'success' && userData?.uid === roomData?.owner?.uid ? (
        <Title editable={{ onChange: saveRoomName }}>{roomName}</Title>
      ) : (
        <Title>{roomName}</Title>
      )}
      <NavbarStyled>
        <Menu
          mode="horizontal"
          items={menuItems}
          selectedKeys={[
            location.pathname.slice(location.pathname.lastIndexOf('/') + 1),
          ]}
        />
      </NavbarStyled>

      <Outlet />
    </>
  );
}

const NavbarStyled = styled.div`
  margin-bottom: 8px;
`;

const NavLinkStyled = styled(NavLink)`
  text-transform: capitalize;
`

export default Room;
