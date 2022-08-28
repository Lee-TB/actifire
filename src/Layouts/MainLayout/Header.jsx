import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Menu, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { SignOut } from '~/features/auth';
import { useSigninCheck } from 'reactfire';

const { Header: AntHeader } = Layout;

const AntHeaderStyled = styled(AntHeader)`
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
`;

const SignUpButton = styled(Button)`
  border-color: var(--ant-primary-color);
  &:hover {
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const UserMenu = (
  <Menu
    items={[
      {
        label: <Link to="/profile">Your profile</Link>,
        key: '0',
      },
      {
        label: <Link to="/server">Your server</Link>,
        key: '1',
      },
      {
        type: 'divider',
      },
      {
        label: <SignOut>Log Out</SignOut>,
        key: '3',
      },
    ]}
  />
);

function Header() {
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const { status, data: userData } = useSigninCheck();
  return (
    <AntHeaderStyled>
      {userData && userData.signedIn ? (
        <div style={{ cursor: 'pointer' }}>
          <Dropdown
            overlay={UserMenu}
            trigger={['click']}
            placement="bottomRight"
            visible={userDropdownVisible}
            onVisibleChange={(visible) => setUserDropdownVisible(visible)}
          >
            <div>
              <DownOutlined />
              <Avatar src="https://lh3.googleusercontent.com/a-/AFdZucoLa3eakzI7Sg3zBjSEp6zpEyMRwozjZpqqr2oUqg=s360-p-rw-no" />
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
