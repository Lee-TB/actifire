import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const { Content: AntContent } = Layout;

const ContentInnerStyled = styled.div`
  background: #fff;
  min-height: 280px;
  padding: 24px;
`;

function Content() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = pathSnippets.map((pathSnippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const text = pathSnippet.replaceAll('-', ' ');

    return (
      <Breadcrumb.Item key={pathSnippet}>
        <Link to={url}>{text}</Link>
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
        <Breadcrumb.Item key={'home'}>
          <Link to="/">
            <HomeFilled />
          </Link>
        </Breadcrumb.Item>
        {breadcrumbItems}
      </Breadcrumb>

      <ContentInnerStyled>
        <Outlet />
      </ContentInnerStyled>
    </AntContent>
  );
}

export default Content;
