import React from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from 'reactfire';
import { useTranslation } from 'react-i18next';
import { collection, query, where } from 'firebase/firestore';
import { RoomList } from '~/features/room';
import { Spin, LoginToViewButton } from '~/components';
import styled from 'styled-components';

const ButtonContainerStyled = styled.div`
  display: flex;
  justify-content: center;
`;

function YourRoomsPage() {
  const firestore = useFirestore();
  const { data: userData } = useSigninCheck();
  const { t } = useTranslation();

  const roomsCollection = collection(firestore, 'rooms');
  const roomsQuery = query(
    roomsCollection,
    where('members', 'array-contains', { uid: userData?.user?.uid || '' })
  );
  const { status, data: rooms } = useFirestoreCollectionData(roomsQuery);

  if (!userData?.signedIn) {
    return (
      <ButtonContainerStyled>
        <LoginToViewButton>Login to view Your rooms</LoginToViewButton>
      </ButtonContainerStyled>
    );
  }

  return (
    <Spin spinning={status === 'loading'}>
      <RoomList mode="your-rooms" title={t("Your rooms")} rooms={rooms} />
    </Spin>
  );
}

export default YourRoomsPage;
