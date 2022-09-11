import React from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from 'reactfire';
import { collection, query, where } from 'firebase/firestore';
import { Button } from 'antd';
import { RoomList } from '~/features/room';
import { Spin } from '~/components';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ButtonContainerStyled = styled.div`
  display: flex;
  justify-content: center;
`;

function YourRoomsPage() {
  const firestore = useFirestore();
  const { data: userData } = useSigninCheck();

  const roomsCollection = collection(firestore, 'rooms');
  const roomsQuery = query(
    roomsCollection,
    where('members', 'array-contains', { uid: userData?.user?.uid || '' })
  );
  const { status, data: rooms } = useFirestoreCollectionData(roomsQuery);

  if (!userData?.signedIn) {
    return (
      <ButtonContainerStyled>
        <Link to="/login">
          <Button type="primary" size="large">
            Login to view rooms
          </Button>
        </Link>
      </ButtonContainerStyled>
    );
  }

  return (
    <Spin spinning={status === 'loading'}>
      <RoomList title="Your rooms" rooms={rooms} />
    </Spin>
  );
}

export default YourRoomsPage;
