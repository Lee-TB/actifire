import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

function MainLayout() {
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible>Sider</Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ minHeight: '100vh' }}>
            Content
            <Outlet />
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default MainLayout;
