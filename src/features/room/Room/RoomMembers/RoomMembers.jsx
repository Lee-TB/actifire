import React from 'react';
import { Avatar, Table, Typography, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { collection, doc, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useSigninCheck,
} from 'reactfire';
import lodash from 'lodash';

const { Title } = Typography;

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

let dataSource = [];

const getScore = (members, memberId) => {
  console.log(members);
  const index = lodash.findIndex(members, { uid: memberId });
  // return allTotalScore;
};

function RoomMembers() {
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
      const { uid, photoURL, name, email } = membersInUsersData;
      const memberInRoom = membersInRoomData?.find(
        (memberInRoom) => memberInRoom.uid === membersInUsersData.uid
      );
      // console.log(memberInRoom);
      console.log(uid, roomData.owner.uid);

      return {
        key: uid,
        stt: index + 1,
        photo: (
          <>
            <Space size="small">
              <Avatar size="small" src={photoURL} icon={<UserOutlined />} />
              {uid === roomData?.owner?.uid && <Tag color="green">owner</Tag>}
              {uid === signinCheckData?.user?.uid && (
                <Tag color="purple">me</Tag>
              )}
            </Space>
          </>
        ),
        name,
        email,
        score: memberInRoom?.allTotalScore || 0,
      };
    });
  } else {
    dataSource = [];
  }

  return (
    <>
      <Title>Other members</Title>
      <div>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </>
  );
}

export default RoomMembers;
