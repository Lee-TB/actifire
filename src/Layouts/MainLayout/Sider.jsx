import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Menu, Tooltip } from 'antd';
import { ImFire } from 'react-icons/im';
import { AppstoreOutlined, CompassOutlined } from '@ant-design/icons';
import { CgProfile } from 'react-icons/cg';
import styled from 'styled-components';

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

function Sider() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const siderMenuItems = [
    {
      key: 'explore',
      icon: <CompassOutlined />,
      label: <Link to="/explore">{t(`Explore`)}</Link>,
    },
    {
      key: 'your-rooms',
      icon: <AppstoreOutlined />,
      label: <Link to="/your-rooms">{t(`Your rooms`)}</Link>,
    },
    {
      key: 'profile',
      icon: <CgProfile />,
      label: <Link to="/profile">{t(`Profile`)}</Link>,
    },
  ];

  return (
    <>
      <SiderStyled
        collapsed={collapsed}
        collapsible
        onCollapse={(value) => setCollapsed(value)}
      >
        <Link to="/">
          <Tooltip title="Actifire" placement="right" color="purple">
            <LogoContainerStyled>
              <ImFire />
              <LogoTextStyled collapsed={collapsed}>actifire</LogoTextStyled>
            </LogoContainerStyled>
          </Tooltip>
        </Link>
        <Menu
          items={siderMenuItems}
          mode="inline"
          selectedKeys={location.pathname.slice(
            location.pathname.lastIndexOf('/') + 1
          )}
        />
      </SiderStyled>
    </>
  );
}

export default Sider;
