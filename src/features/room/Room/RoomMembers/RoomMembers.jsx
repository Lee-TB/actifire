import React from 'react';
import { Avatar, Table, Typography, Tag, Space } from 'antd';
import { collection, doc, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useSigninCheck,
} from 'reactfire';
import styled from 'styled-components';
import { useColumnSearchProps } from '../hooks/useColumnSearchProps';

const { Title } = Typography;

const AvatarStyled = styled(Avatar)`
  background-color: ${(props) => props.backgroundColor || 'auto'};
`;

function RoomMembers() {
  let dataSource = [];
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...useColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
  ];
  const { status: signinCheckStatus, data: signinCheckData } = useSigninCheck();
  const firestore = useFirestore();
  const { roomId } = useParams();
  const { status: roomStatus, data: roomData } = useFirestoreDocData(
    doc(firestore, `rooms/${roomId}`)
  );
  const membersId = roomData?.members?.map((member) => member.uid);

  //** get members in users collection
  const usersColQuery = query(
    collection(firestore, 'users'),
    where('uid', 'in', membersId || [null])
  ); // where member in room

  const { status: membersInUsersStatus, data: membersInUsersData } =
    useFirestoreCollectionData(usersColQuery, {
      idField: 'memberId',
    });

  //** get members in room document */
  const { status: membersInRoomStatus, data: membersInRoomData } =
    useFirestoreCollectionData(
      collection(firestore, `rooms/${roomId}/members`),
      {
        idField: 'memberId',
      }
    );

  if (
    signinCheckStatus === 'success' &&
    signinCheckData.signedIn &&
    membersInUsersData
  ) {
    dataSource = membersInUsersData.map((membersInUsersData, index) => {
      const { uid, photoURL, displayName, email, avatarColor } =
        membersInUsersData;
      const memberInRoom = membersInRoomData?.find(
        (memberInRoom) => memberInRoom.uid === membersInUsersData.uid
      );

      return {
        key: uid,
        stt: index + 1,
        photo: (
          <>
            <Space size="small">
              {photoURL ? (
                <AvatarStyled size="small" src={photoURL} />
              ) : (
                <AvatarStyled
                  size="small"
                  backgroundColor={avatarColor}
                  icon={
                    (!photoURL &&
                      (displayName[0]?.toUpperCase() ||
                        email[0]?.toUpperCase())) ||
                    'U'
                  }
                />
              )}
              {uid === roomData?.owner?.uid && <Tag color="green">owner</Tag>}
              {uid === signinCheckData?.user?.uid && (
                <Tag color="purple">me</Tag>
              )}
            </Space>
          </>
        ),
        name: displayName,
        email,
        score: memberInRoom?.allTotalScore || 0,
      };
    });
  } else {
    dataSource = [];
  }

  return (
    <>
      <Title level={2} style={{ textAlign: 'center' }}>
        Members
      </Title>
      <div>
        <Table bordered={true} columns={columns} dataSource={dataSource} />
      </div>
    </>
  );
}

export default RoomMembers;
