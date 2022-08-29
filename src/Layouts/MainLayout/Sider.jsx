import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { SiFirebase } from 'react-icons/si';
import { GroupOutlined } from '@ant-design/icons';
import { CgProfile } from 'react-icons/cg';
import styled from 'styled-components';
import { useSigninCheck } from 'reactfire';

const { Sider: AntSider } = Layout;

const SiderStyled = styled(AntSider)`
  background-color: #f5f5f5;
  border-right: 1px solid #ccc;
  & .ant-layout-sider-trigger {
    background-color: var(--ant-primary-9);
  }
`;

const LogoContainerStyled = styled.div`
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid #ccc;
  text-transform: capitalize;
  text-align: center;
  font-size: 1rem;
  font-weight: 900;
  font-style: italic;
  overflow: hidden;
`;

const LogoTextStyled = styled.span`
  margin-left: 4px;
  display: ${(props) => (props.collapsed && 'none') || 'ineline'};
`;

const siderMenuItems = [
  {
    key: 'server',
    icon: <GroupOutlined />,
    label: <Link to="/room">Room</Link>,
  },
  {
    key: 'profile',
    icon: <CgProfile />,
    label: <Link to="/profile">Profile</Link>,
  },
];

function Sider() {
  const [collapsed, setCollapsed] = useState(false);
  const { data: userData } = useSigninCheck();

  return (
    <>
      <SiderStyled
        collapsed={collapsed}
        collapsible
        onCollapse={(value) => setCollapsed(value)}
      >
        <Link to="/">
          <LogoContainerStyled>
            <SiFirebase />
            <LogoTextStyled collapsed={collapsed}>actifire</LogoTextStyled>
          </LogoContainerStyled>
        </Link>
        <Menu items={siderMenuItems} mode="inline" />
      </SiderStyled>
    </>
  );
}

export default Sider;
