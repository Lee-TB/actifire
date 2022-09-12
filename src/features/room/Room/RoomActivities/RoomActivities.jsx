import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Select } from 'antd';
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
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
  const memberDocRef = doc(
    firestore,
    `rooms/${roomId}/members/${userData?.uid}`
  );
  const { status: memberStatus, data: memberData } = useFirestoreDocData(
    memberDocRef,
    { idField: 'memberId' }
  );

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

  const handleSelectRole = (roleName) => {
    const roleKeyValuePairs = roomData?.roles.reduce((prev, cur) => {
      const { roleName, roleCoef } = cur;
      return {
        ...prev,
        [roleName]: roleCoef,
      };
    }, {});
    const { activityId, activityScore } = activityScoreData;
    const roleCoef = Number(roleKeyValuePairs[roleName]);
    const activityTotalScore = roleName ? roleCoef * activityScore : 0;

    const memberDocRef = doc(
      firestore,
      `rooms/${roomId}/members/${userData.uid}`
    );

    runTransaction(firestore, async (transaction) => {
      const memberDoc = await transaction.get(memberDocRef);
      if (!memberDoc.exists()) {
        throw 'memberDoc does not exist!';
      }
      const activities = memberDoc.data().activities;
      const allTotalScore = memberDoc.data().allTotalScore || 0;
      const prevActivityTotalScore =
        activities?.[activityId]?.activityTotalScore || 0;
      // recompute allTotalScore (-) prev (+) current activityTotalScore which has just selected
      const newAllTotalScore =
        allTotalScore - prevActivityTotalScore + activityTotalScore;

      transaction.update(memberDocRef, {
        allTotalScore: newAllTotalScore,
        activities: {
          ...activities,
          [activityId]: {
            activityId,
            activityTotalScore,
            activityRole: roleName,
          },
        },
        updateAt: serverTimestamp(),
      });
    })
      .then(() => {
        console.log('Transaction update total score successfully committed!');
      })
      .catch((error) => {
        console.log('Transaction update total score failed: ', error);
      });
  };

  //*** Realtime list all activities */
  const activitesCollection = collection(
    firestore,
    `rooms/${roomId}/activities`
  );
  const { status: activitiesStatus, data: activitiesData } =
    useFirestoreCollectionData(activitesCollection, {
      idField: 'activityId',
    });

  if (
    activitiesStatus === 'success' &&
    memberStatus === 'success' &&
    userData
  ) {
    const activitiesMergeMemberData = activitiesData.map((activity) => {
      const { activityId } = activity;
      let activityRole = '';
      let activityTotalScore = 0;
      if (memberData?.hasOwnProperty('activities')) {
        activityRole = memberData?.activities?.[activityId]?.activityRole;
        activityTotalScore =
          memberData?.activities?.[activityId]?.activityTotalScore;
      }

      return {
        ...activity,
        activityRole,
        activityTotalScore,
      };
    });

    dataSource = activitiesMergeMemberData.map((activity, index) => {
      const {
        activityId,
        activityName,
        createAt,
        activityScore,
        activityRole,
        activityTotalScore,
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
        activityTotalScore: activityTotalScore || 0,
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
  } else {
    dataSource = [];
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        {
          /* owner feature */
          roomData?.owner?.uid === userData?.uid && <AddActivityModal />
        }
        <div>
          <strong>All score: {memberData?.allTotalScore}</strong>
        </div>
      </div>
      <TableContainerStyled>
        <Table columns={columns} dataSource={dataSource} />
      </TableContainerStyled>
    </>
  );
}

export default RoomActivities;
