import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Content: AntContent } = Layout;

function Content() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item>
        <Link to={url}>{_}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <AntContent style={{ minHeight: '100vh', padding: '0 50px' }}>
      <Breadcrumb
        separator=">"
        style={{
          margin: '16px 0',
        }}
      >
        {breadcrumbItems}
      </Breadcrumb>
      <div style={{ minHeight: '280px', padding: '24px', background: '#fff' }}>
        <Outlet />
      </div>
    </AntContent>
  );
}

export default Content;
