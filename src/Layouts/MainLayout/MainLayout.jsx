import React from 'react';
import { Layout } from 'antd';

import Sider from './Sider';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { Spin } from '~/components';

import { useSigninCheck } from 'reactfire';
import { useNavigate } from 'react-router-dom';

function MainLayout() {
  const { status: signedInStatus, data: signedInData } = useSigninCheck();
  const navigate = useNavigate();
  
  if(!signedInData?.signedIn) {
    navigate("/login")
  }

  return (
    <Spin spinning={signedInStatus === 'loading'}>
      <Layout>
        <Sider />
        <Layout>
          <Header />
          <Content />
          <Footer />
        </Layout>
      </Layout>
    </Spin>
  );
}

export default MainLayout;
