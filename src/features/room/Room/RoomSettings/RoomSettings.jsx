import React from 'react';
import { Typography } from 'antd';
import { doc } from 'firebase/firestore';
import { useFirestoreDocData, useUser, useFirestore } from 'reactfire';

import { DeleteRoomButton } from '~/features/room';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

function RoomSettings() {
  const { roomId } = useParams();
  const firestore = useFirestore();
  const { status: roomStatus, data: roomData } = useFirestoreDocData(
    doc(firestore, `rooms/${roomId}`)
  );
  const { status: userStatus, data: userData } = useUser();

  if (
    roomStatus === 'success' &&
    userStatus === 'success' &&
    roomData?.owner?.uid === userData?.uid // is owner
  ) {
    return (
      <div>
        <Title>Settings</Title>
        <DeleteRoomButton type="primary">Delete this room</DeleteRoomButton>
      </div>
    );
  }

  return (
    <div>
      <Title>Settings</Title>
    </div>
  );
}

export default RoomSettings;
