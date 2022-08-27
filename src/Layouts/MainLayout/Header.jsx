import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Menu, Space } from 'antd';
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
  console.log(userData);

  return (
    <AntHeaderStyled>
      <div style={{ cursor: 'pointer' }}>
        <Dropdown
          overlay={UserMenu}
          trigger={['click']}
          placement="bottomRight"
          visible={userDropdownVisible}
          onVisibleChange={(visible) => setUserDropdownVisible(visible)}
        >
          <Space>
            <DownOutlined />
            <Avatar src="https://lh3.googleusercontent.com/a-/AFdZucoLa3eakzI7Sg3zBjSEp6zpEyMRwozjZpqqr2oUqg=s360-p-rw-no" />
          </Space>
        </Dropdown>
      </div>
    </AntHeaderStyled>
  );
}

export default Header;
