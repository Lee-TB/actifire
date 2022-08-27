import React from 'react';
import { Layout } from 'antd';

import Sider from './Sider';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

function MainLayout() {
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider />
        <Layout>
          <Header />
          <Content />
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}

export default MainLayout;
