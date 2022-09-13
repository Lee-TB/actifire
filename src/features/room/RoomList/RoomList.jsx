import React from 'react';
import { List, Card, Typography, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { formatDateTime } from '~/utils/format/date';
import styled from 'styled-components';
const { Title } = Typography;

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
            column: 4,
          }}
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              {signedIn && room?.isEnroled ? (
                <Link to={`/your-rooms/${room?.id}/activities`}>
                  <Badge.Ribbon text="You are in this room" color="purple">
                    <Card
                      title={
                        <>
                          <CardTitleStyled title={room?.roomName}>
                            {room?.roomName}
                          </CardTitleStyled>

                          <CreateAtStyled>
                            <span>Create at: </span>
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
                        {(room?.owner?.displayName || room?.owner?.email) &&
                          'Createtor: '}
                        {room?.owner?.displayName || room?.owner?.email}
                      </OwnerStyled>
                    </Card>
                  </Badge.Ribbon>
                </Link>
              ) : (
                <Link to={`${room?.id}/activities`}>
                  <Card
                    title={
                      <>
                        <CardTitleStyled title={room?.roomName}>
                          {room?.roomName}
                        </CardTitleStyled>

                        <CreateAtStyled>
                          <span>Create at: </span>
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
                      {(room?.owner?.displayName || room?.owner?.email) &&
                        'Createtor: '}
                      {room?.owner?.displayName || room?.owner?.email}
                    </OwnerStyled>
                  </Card>
                </Link>
              )}
            </List.Item>
          )}
        />
      ) : mode === 'explore' /**This is list for explore page */ ? (
        <List
          grid={{
            gutter: 16,
            column: 4,
          }}
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              {signedIn && room?.isEnroled ? (
                <Link to={`/your-rooms/${room?.id}/activities`}>
                  <Badge.Ribbon text="Joined" color="purple">
                    <Card
                      title={
                        <>
                          <CardTitleStyled title={room?.roomName}>
                            {room?.roomName}
                          </CardTitleStyled>

                          <CreateAtStyled>
                            <span>Create at: </span>
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
                        {(room?.owner?.displayName || room?.owner?.email) &&
                          'Createtor: '}
                        {room?.owner?.displayName || room?.owner?.email}
                      </OwnerStyled>
                    </Card>
                  </Badge.Ribbon>
                </Link>
              ) : (
                <Link to={`${room?.id}/enrol`}>
                  <Card
                    title={
                      <>
                        <CardTitleStyled title={room?.roomName}>
                          {room?.roomName}
                        </CardTitleStyled>

                        <CreateAtStyled>
                          <span>Create at: </span>
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
                      {(room?.owner?.displayName || room?.owner?.email) &&
                        'Createtor: '}
                      {room?.owner?.displayName || room?.owner?.email}
                    </OwnerStyled>
                  </Card>
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
