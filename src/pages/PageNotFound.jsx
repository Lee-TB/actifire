import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Content = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function PageNotFound() {
  return (
    <Content>
      <section>
        <h2>404 page not found!</h2>
        <Link to="/">Back to Home</Link>
      </section>
    </Content>
  );
}

export default PageNotFound;
