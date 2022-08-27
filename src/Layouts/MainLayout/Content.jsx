import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content: AntContent } = Layout;

function Content() {
  return (
    <AntContent style={{ minHeight: '100vh', padding: '0 50px' }}>
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ minHeight: '280px', padding: '24px', background: '#fff' }}>
        Content
        <Outlet />
      </div>
    </AntContent>
  );
}

export default Content;
