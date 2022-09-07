import React from 'react';
import { List, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatDateTime } from '~/utils/format/date';
import styled from 'styled-components';
const { Title } = Typography;

const CreateAtStyled = styled.div`
  font-size: 12px;
  font-style: italic;
`;

const DescriptionStyled = styled.p``;

const OwnerStyled = styled.div``;

function RoomList({ title, rooms }) {
  return (
    <>
      <Title>{title}</Title>
      <List
        grid={{
          gutter: 16,
          column: 4,
        }}
        dataSource={rooms}
        renderItem={(room) => (
          <List.Item>
            <Link to={`${room?.id}`}>
              <Card
                title={
                  <>
                    {room?.roomName}
                    <CreateAtStyled>
                      Create at:{' '}
                      <time>
                        {formatDateTime(
                          new Date(room?.createAt?.seconds * 1000)
                        )}
                      </time>
                    </CreateAtStyled>
                  </>
                }
              >
                <DescriptionStyled>{room?.roomDescription}</DescriptionStyled>
                <OwnerStyled>
                  {(room?.owner?.displayName || room?.owner?.email) &&
                    'Createtor: '}
                  {room?.owner?.displayName || room?.owner?.email}
                </OwnerStyled>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </>
  );
}

export default RoomList;
