import React from 'react';
import { List, Card, Typography, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { formatDateTime } from '~/utils/format/date';
import styled from 'styled-components';
import { t } from 'i18next';
const { Title } = Typography;

const CardShadowStyled = styled.div`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translate(0, -4px);
  }
`;

const CardTitleStyled = styled.h4`
  margin-top: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CreateAtStyled = styled.div`
  font-size: 12px;
  font-style: italic;
  color: rgba(0, 0, 0, 0.7);
`;

const DescriptionStyled = styled.p`
  min-height: 88px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const OwnerStyled = styled.div``;

function RoomList({ title, rooms, mode, signedIn }) {
  return (
    <>
      <Title>{title}</Title>
      {mode === 'your-rooms' /**This is list for your rooms page */ ? (
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
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              {signedIn && room?.isEnroled ? (
                <Link to={`/your-rooms/${room?.id}/activities`}>
                  <CardShadowStyled>
                    <Badge.Ribbon text="You are in this room" color="purple">
                      <Card
                        title={
                          <>
                            <CardTitleStyled title={room?.roomName}>
                              {room?.roomName}
                            </CardTitleStyled>

                            <CreateAtStyled>
                              <time>
                                {formatDateTime(
                                  new Date(room?.createAt?.seconds * 1000)
                                )}
                              </time>
                            </CreateAtStyled>
                          </>
                        }
                      >
                        <DescriptionStyled>
                          {room?.roomDescription}
                        </DescriptionStyled>
                        <OwnerStyled>
                          {room?.owner?.displayName || room?.owner?.email}
                        </OwnerStyled>
                      </Card>
                    </Badge.Ribbon>
                  </CardShadowStyled>
                </Link>
              ) : (
                <Link to={`${room?.id}/activities`}>
                  <CardShadowStyled>
                    <Card
                      title={
                        <>
                          <CardTitleStyled title={room?.roomName}>
                            {room?.roomName}
                          </CardTitleStyled>

                          <CreateAtStyled>
                            <time>
                              {formatDateTime(
                                new Date(room?.createAt?.seconds * 1000)
                              )}
                            </time>
                          </CreateAtStyled>
                        </>
                      }
                    >
                      <DescriptionStyled>
                        {room?.roomDescription}
                      </DescriptionStyled>
                      <OwnerStyled>
                        {room?.owner?.displayName || room?.owner?.email}
                      </OwnerStyled>
                    </Card>
                  </CardShadowStyled>
                </Link>
              )}
            </List.Item>
          )}
        />
      ) : mode === 'explore' /**This is list for explore page */ ? (
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
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              {signedIn && room?.isEnroled ? (
                <Link to={`/your-rooms/${room?.id}/activities`}>
                  <CardShadowStyled>
                    <Badge.Ribbon text={t("Joined")} color="purple">
                      <Card
                        title={
                          <>
                            <CardTitleStyled title={room?.roomName}>
                              {room?.roomName}
                            </CardTitleStyled>

                            <CreateAtStyled>
                              <time>
                                {formatDateTime(
                                  new Date(room?.createAt?.seconds * 1000)
                                )}
                              </time>
                            </CreateAtStyled>
                          </>
                        }
                      >
                        <DescriptionStyled>
                          {room?.roomDescription}
                        </DescriptionStyled>
                        <OwnerStyled>
                          {room?.owner?.displayName || room?.owner?.email}
                        </OwnerStyled>
                      </Card>
                    </Badge.Ribbon>
                  </CardShadowStyled>
                </Link>
              ) : (
                <Link to={`${room?.id}/enrol`}>
                  <CardShadowStyled>
                    <Card
                      title={
                        <>
                          <CardTitleStyled title={room?.roomName}>
                            {room?.roomName}
                          </CardTitleStyled>

                          <CreateAtStyled>
                            <time>
                              {formatDateTime(
                                new Date(room?.createAt?.seconds * 1000)
                              )}
                            </time>
                          </CreateAtStyled>
                        </>
                      }
                    >
                      <DescriptionStyled>
                        {room?.roomDescription}
                      </DescriptionStyled>
                      <OwnerStyled>
                        {room?.owner?.displayName || room?.owner?.email}
                      </OwnerStyled>
                    </Card>
                  </CardShadowStyled>
                </Link>
              )}
            </List.Item>
          )}
        />
      ) : null}
    </>
  );
}

export default RoomList;
