import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Dropdown, Avatar, Menu, Button, Space } from 'antd';
import {
  DownOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { CgProfile } from 'react-icons/cg';
import styled from 'styled-components';
import { useFirestore, useSigninCheck, useFirestoreDocData } from 'reactfire';
import { doc } from 'firebase/firestore';

import { SignOutButton } from '~/features/auth';

const { Header: AntHeader } = Layout;

const AntHeaderStyled = styled(AntHeader)`
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const NewRoomButtonStyled = styled(Button)`
  border: 1px solid var(--ant-primary-color);
  &:hover {
    border: 1px solid var(--ant-primary-color);
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const SignUpButtonStyled = styled(Button)`
  border-color: var(--ant-primary-color);
  &:hover {
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const AvatarStyled = styled(Avatar)`
  margin-left: 2px;
  background-color: ${(props) => props.backgroundColor || 'auto'};
`;

const userMenu = (
  <Menu
    items={[
      {
        icon: <CgProfile />,
        label: <Link to="/profile">Your profile</Link>,
        key: '0',
      },
      {
        icon: <AppstoreOutlined />,
        label: <Link to="/your-rooms">Your rooms</Link>,
        key: '1',
      },
      {
        type: 'divider',
      },
      {
        icon: <LogoutOutlined />,
        label: <SignOutButton>Log Out</SignOutButton>,
        key: '2',
      },
    ]}
  />
);

function Header() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { status: signedInCheckStatus, data: signedInCheckData } =
    useSigninCheck();
  const firestore = useFirestore();

  const userDocRef = doc(firestore, `users/${signedInCheckData?.user?.uid}`);
  const { status: userStatus, data: userData } =
    useFirestoreDocData(userDocRef);

  return (
    <AntHeaderStyled>
      <Link to="/your-rooms/create-room">
        <NewRoomButtonStyled
          icon={<AppstoreAddOutlined />}
          type="link"
          shape="round"
        >
          New room
        </NewRoomButtonStyled>
      </Link>
      {signedInCheckData?.signedIn && userStatus === 'success' && userData ? (
        <div style={{ cursor: 'pointer' }}>
          <Dropdown
            overlay={userMenu}
            trigger={['click']}
            placement="bottomRight"
            open={userDropdownOpen}
            onOpenChange={(open) => setUserDropdownOpen(open)}
          >
            <div>
              <DownOutlined />
              {userData.photoURL ? (
                <AvatarStyled src={userData.photoURL} />
              ) : (
                <AvatarStyled
                  backgroundColor={userData.avatarColor}
                  icon={
                    (!userData.photoURL &&
                      (userData.displayName[0]?.toUpperCase() ||
                        userData.email[0]?.toUpperCase())) ||
                    'U'
                  }
                />
              )}
            </div>
          </Dropdown>
        </div>
      ) : (
        <Space>
          <Link to="signup">
            <SignUpButtonStyled>Sign Up</SignUpButtonStyled>
          </Link>
          <Link to="login">
            <Button type="primary">Login</Button>
          </Link>
        </Space>
      )}
    </AntHeaderStyled>
  );
}

export default Header;
