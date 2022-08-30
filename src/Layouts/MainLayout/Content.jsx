import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content: AntContent } = Layout;

function Content() {
  return (
    <AntContent style={{ minHeight: '100vh', padding: '0 50px' }}>
      <Breadcrumb
        separator=">"
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Your rooms</Breadcrumb.Item>
        <Breadcrumb.Item>Hoat dong cong dong 2020</Breadcrumb.Item>
        <Breadcrumb.Item>activites</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ minHeight: '280px', padding: '24px', background: '#fff' }}>
        <Outlet />
      </div>
    </AntContent>
  );
}

export default Content;
