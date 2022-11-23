import React from 'react';
import { Link } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';
import styled from 'styled-components';
import { List, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { StartPage } from '~/pages';

const { Title } = Typography;

const HomePageStyled = styled.div`
  min-height: 80vh;
`;

const CardShadowStyled = styled.div`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translate(0, -4px);
  }
`;

const CardContentStyled = styled.div`
  min-height: 88px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;



function HomePage() {
  const { t } = useTranslation();
  const { status: signedInStatus, data: signedInData } = useSigninCheck();

  if (signedInStatus === 'success' && !signedInData.signedIn) {
    return <StartPage />;
  }

  const data = [
    {
      title: t("Explore"),
      content: t("View all available rooms now"),
      link: "/explore",
    },
    {
      title: t("Your rooms"),
      content: t("The rooms you joined or created"),
      link: "/your-rooms",
    },
    {
      title: t("Profile"),
      content: t("View your profile information"),
      link: "/profile",
    },
  ];

  if (signedInStatus === 'success') {
    return (
      <HomePageStyled>
        <Title>{t('Home')}</Title>
        <List
          grid={{
            gutter: 16,
            xxl: 3,
            xl: 3,
            lg: 3,
            md: 2,
            sm: 2,
            xs: 1,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Link to={item.link}>
                <CardShadowStyled>
                  <Card title={<Title level={2}>{item.title}</Title>}>
                    <CardContentStyled>{item.content}</CardContentStyled>
                  </Card>
                </CardShadowStyled>
              </Link>
            </List.Item>
          )}
        />
      </HomePageStyled>
    );
  }
}

export default HomePage;
