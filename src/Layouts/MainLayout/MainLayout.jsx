import React from 'react';
import { Layout } from 'antd';

import Sider from './Sider';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { Spin } from '~/components';

import { useSigninCheck } from 'reactfire';
import { StartPage } from '~/pages';

function MainLayout() {
  const { status: signedInStatus, data: signedInData } = useSigninCheck();

  if (signedInStatus === 'success' && !signedInData.signedIn) {
    return <StartPage />;
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
