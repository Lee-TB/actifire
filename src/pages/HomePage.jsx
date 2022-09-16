import React from 'react';
import styled from 'styled-components';
import { LoginToViewButton } from '~/components';

const HomePageStyled = styled.div`
  min-height: 90vh;
`;

const WelcomeStyled = styled.section`
  text-align: center;
  margin: 50px 0;
`;

const TitleStyled = styled.h1`
  color: var(--ant-primary-color);
  font-size: 5rem;
  font-weight: 700;
`;

const Subtitle = styled.h2``;

function HomePage() {
  return (
    <HomePageStyled>
      <WelcomeStyled>
        <Subtitle>Welcome to</Subtitle>
        <TitleStyled>Actifire</TitleStyled>
        <LoginToViewButton shape="round">
          Login to get started
        </LoginToViewButton>
      </WelcomeStyled>
    </HomePageStyled>
  );
}

export default HomePage;
