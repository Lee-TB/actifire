import React from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection, query } from 'firebase/firestore';
import { RoomList } from '~/features/room';
import { Spin } from '~/components';

function HomePage() {
  const firestore = useFirestore();
  const roomsCollection = collection(firestore, 'rooms');
  const roomsQuery = query(roomsCollection);
  const { status, data: rooms } = useFirestoreCollectionData(roomsQuery, {
    idField: 'id',
  });

  return (
    <Spin spinning={status === 'loading'}>
      <RoomList title="Explore" rooms={rooms} />
    </Spin>
  );
}

export default HomePage;
