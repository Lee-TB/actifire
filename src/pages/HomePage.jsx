import React from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from 'reactfire';
import { collection, query, where } from 'firebase/firestore';
import { RoomList } from '~/features/room';
import { Spin } from '~/components';

function HomePage() {
  const firestore = useFirestore();
  const roomsCollection = collection(firestore, 'rooms');
  const roomsQuery = query(roomsCollection);
  const { status: signinCheckStatus, data: signinCheckData } = useSigninCheck();
  const { status: roomsStatus, data: roomsData } = useFirestoreCollectionData(
    roomsQuery,
    {
      idField: 'id',
    }
  );
  // check user has signed in
  const isUserSignedIn =
    signinCheckStatus === 'success' && signinCheckData?.user?.uid;

  const roomsEnroledData =
    isUserSignedIn && roomsStatus === 'success'
      ? roomsData.map((room) => {
          const isEnroled = room.members.some(
            (member) => member.uid === signinCheckData?.user?.uid
          );

          return {
            ...room,
            isEnroled,
          };
        })
      : roomsData;

  return (
    <Spin spinning={roomsStatus === 'loading'}>
      <RoomList
        title="Explore"
        mode="explore"
        rooms={roomsEnroledData}
        signedIn={isUserSignedIn}
      />
    </Spin>
  );
}

export default HomePage;
