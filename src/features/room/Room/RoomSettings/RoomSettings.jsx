import React from 'react';
import { Typography } from 'antd';
import { doc } from 'firebase/firestore';
import { useFirestoreDocData, useUser, useFirestore } from 'reactfire';

import { DeleteRoomButton } from '~/features/room';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

function RoomSettings() {
  const { t } = useTranslation();
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
        <Title style={{ textAlign: 'center', textTransform: 'capitalize' }}>
          {t('settings')}
        </Title>
        <DeleteRoomButton type="primary">{t("Delete this room")}</DeleteRoomButton>
      </div>
    );
  }

  return (
    <div>
      <Title>{t('settings')}</Title>
    </div>
  );
}

export default RoomSettings;
