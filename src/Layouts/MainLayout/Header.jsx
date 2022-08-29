import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Dropdown, Avatar, Menu, Button, Space } from 'antd';
import {
  DownOutlined,
  GroupOutlined,
  LogoutOutlined,
  UserOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { CgProfile } from 'react-icons/cg';
import styled from 'styled-components';

import { SignOut } from '~/features/auth';
import { useSigninCheck } from 'reactfire';

const { Header: AntHeader } = Layout;

const AntHeaderStyled = styled(AntHeader)`
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const NewRoomButton = styled(Button)`
  border: 1px solid var(--ant-primary-color);
  &:hover {
    border: 1px solid var(--ant-primary-color);
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const SignUpButton = styled(Button)`
  border-color: var(--ant-primary-color);
  &:hover {
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const AvatarStyled = styled(Avatar)`
  border: 2px solid var(--ant-primary-color);
  margin-left: 2px;
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
        icon: <GroupOutlined />,
        label: <Link to="/room">Your room</Link>,
        key: '1',
      },
      {
        type: 'divider',
      },
      {
        icon: <LogoutOutlined />,
        label: <SignOut>Log Out</SignOut>,
        key: '2',
      },
    ]}
  />
);

function Header() {
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const { status, data: userData } = useSigninCheck();
  return (
    <AntHeaderStyled>
      <Link to="/create-room">
        <NewRoomButton icon={<AppstoreAddOutlined />} type="link" shape="round">
          New room
        </NewRoomButton>
      </Link>
      {userData && userData.signedIn ? (
        <div style={{ cursor: 'pointer' }}>
          <Dropdown
            overlay={userMenu}
            trigger={['click']}
            placement="bottomRight"
            visible={userDropdownVisible}
            onVisibleChange={(visible) => setUserDropdownVisible(visible)}
          >
            <div>
              <DownOutlined />
              <AvatarStyled
                src={userData.user.photoURL}
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </div>
      ) : (
        <Space>
          <Link to="signup">
            <SignUpButton>Sign Up</SignUpButton>
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
