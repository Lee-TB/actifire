import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Select } from 'antd';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from 'reactfire';

import { TableContainerStyled } from './RoomActivities.style';
import { AddActivityModal } from '~/features/room';
import { formatDateTime } from '~/utils/format/date';

const { Option } = Select;

function RoomActivities() {
  const [activityScoreData, setActivityScoreData] = useState('');
  const { status: userStatus, data: userData } = useUser();
  const { roomId } = useParams();
  const firestore = useFirestore();
  const roomDocRef = doc(firestore, 'rooms', roomId);
  const { status: roomStatus, data: roomData } =
    useFirestoreDocData(roomDocRef);
  let dataSource = [];
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Activity name',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: 'Create at',
      dataIndex: 'createAt',
      key: 'createAt',
    },
    {
      title: 'Activity score',
      dataIndex: 'activityScore',
      key: 'activityScore',
    },
    {
      title: 'Choose your role',
      dataIndex: 'activityChooseRole',
      key: 'activityChooseRole',
      onCell: (record, rowIndex) => {
        return {
          onClick: () => {
            setActivityScoreData({
              activityId: record.key,
              activityScore: record.activityScore,
            });
          },
        };
      },
    },
    {
      title: 'Total score',
      dataIndex: 'activityTotalScore',
      key: 'activityTotalScore',
    },
  ];

  // handle function
  // roleValues {[roleName]: roleCoef}
  const roleKeyValuePairs = roomData?.roles.reduce((prev, cur) => {
    const { roleName, roleCoef } = cur;
    return {
      ...prev,
      [roleName]: roleCoef,
    };
  }, {});

  const handleSelectRole = (roleName) => {
    const { activityId, activityScore } = activityScoreData;
    const roleCoef = Number(roleKeyValuePairs[roleName]);
    const activityTotalScore = roleName ? roleCoef * activityScore : 0;

    const activityDocRef = doc(
      firestore,
      `rooms/${roomId}/activities/${activityId}`
    );
    updateDoc(activityDocRef, {
      activityTotalScore,
      activityRole: roleName,
    })
      .then(() => {
        console.log('update total score success');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // listen and get all activity data
  const activitesCollection = collection(
    firestore,
    `rooms/${roomId}/activities`
  );

  const activitesQuery = query(
    activitesCollection,
    where('uid', '==', userData?.uid || 'ifNotMatch')
  );

  const { status: activitiesStatus, data: activitiesData } =
    useFirestoreCollectionData(activitesQuery, {
      idField: 'activityId',
    });

  // asign to data source
  if (activitiesData) {
    dataSource = activitiesData.map((activity, index) => {
      const {
        activityId,
        activityName,
        activityScore,
        createAt,
        activityTotalScore,
        activityRole,
      } = activity;
      return {
        key: activityId,
        stt: index + 1,
        activityName,
        createAt: (
          <time>
            {createAt
              ? formatDateTime(new Date(createAt?.seconds * 1000))
              : 'error'}
          </time>
        ),
        activityScore,
        activityTotalScore,
        activityChooseRole: (
          <Select
            value={activityRole || ''}
            style={{
              minWidth: 130,
            }}
            onChange={handleSelectRole}
          >
            <Option key="" value="">
              {'select role'}
            </Option>
            {roomData?.roles.map((role) => {
              const { roleName, roleCoef } = role;
              return (
                <Option key={roleName} value={roleName}>
                  {`${roleName} (${roleCoef})`}
                </Option>
              );
            })}
          </Select>
        ),
      };
    });
  }

  return (
    <>
      <AddActivityModal />
      <TableContainerStyled>
        <Table columns={columns} dataSource={dataSource} />
      </TableContainerStyled>
    </>
  );
}

export default RoomActivities;
