import React from 'react';
import { Link } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';
import styled from 'styled-components';
import { List, Card, Typography, Button } from 'antd';

const { Title } = Typography;

const HomePageStyled = styled.div`
  min-height: 80vh;
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

const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const CardShadowStyled = styled.div`
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
`;

const data = [
  {
    title: 'Explore',
    content: 'View all available rooms now',
    link: '/explore',
  },
  {
    title: 'Your rooms',
    content: 'The rooms you joined or created',
    link: '/your-rooms',
  },
  {
    title: 'Profile',
    content: 'View your profile information',
    link: '/profile',
  },
];

function HomePage() {
  const { status: signedInStatus, data: signedInData } = useSigninCheck();

  if (signedInStatus === 'success' && signedInData.signedIn) {
    return (
      <HomePageStyled>
        <Title>Home</Title>
        <List
          grid={{
            gutter: 16,
            column: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Link to={item.link}>
                <CardShadowStyled>
                  <Card title={item.title}>{item.content}</Card>
                </CardShadowStyled>
              </Link>
            </List.Item>
          )}
        />
      </HomePageStyled>
    );
  }

  return (
    <HomePageStyled>
      <WelcomeStyled>
        <Subtitle>Welcome to</Subtitle>
        <TitleStyled>Actifire</TitleStyled>
        <Link to="/signup">
          <Button type="primary" shape="round" size="large">
            Get started
          </Button>
        </Link>
      </WelcomeStyled>
    </HomePageStyled>
  );
}

export default HomePage;
