import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutStyled = styled.section`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  aligh-items: center;
`;

const ContentStyled = styled.main``;

function AuthLayout() {
  return (
    <LayoutStyled>
      <ContentStyled>
        <Outlet />
      </ContentStyled>
    </LayoutStyled>
  );
}

export default AuthLayout;
