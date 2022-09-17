import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import styled from 'styled-components';

const StartPageStyled = styled.div``;

const WelcomeStyled = styled.section`
  text-align: center;
  margin-top: 100px;
`;

const TitleStyled = styled.h1`
  color: var(--ant-primary-color);
  font-size: 5rem;
  font-weight: 700;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

function StartPage() {
  return (
    <StartPageStyled>
      <WelcomeStyled>
        <Subtitle>Welcome to</Subtitle>
        <TitleStyled>Actifire</TitleStyled>
        <Link to="/signup">
          <Button type="primary" shape="round" size="large">
            Get started
          </Button>
        </Link>
      </WelcomeStyled>
    </StartPageStyled>
  );
}

export default StartPage;
