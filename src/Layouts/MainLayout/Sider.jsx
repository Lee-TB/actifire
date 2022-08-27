import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Divider } from 'antd';
import { SiFirebase } from 'react-icons/si';
import { BiGroup } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { SignOut } from '~/features/auth';
import styled from 'styled-components';

const { Sider } = Layout;

const SiderStyled = styled(Sider)`
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
`;

const siderMenuItems = [
  { key: 'profile', icon: <CgProfile />, label: 'profile' },
  { key: 'server', icon: <BiGroup />, label: 'server' },
];

function MySider() {
  const [collapsed, setCollapsed] = useState(false);

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
            <LogoTextStyled collapsed={collapsed}>actimanager</LogoTextStyled>
          </LogoContainerStyled>
        </Link>
        <Menu items={siderMenuItems} mode="inline" />
        <Divider />
        <SignOut />
      </SiderStyled>
    </>
  );
}

export default MySider;
