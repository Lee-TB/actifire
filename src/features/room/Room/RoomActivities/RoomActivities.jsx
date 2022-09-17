import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Select, Typography, Button, Popconfirm } from 'antd';
import {
  collection,
  doc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from 'reactfire';

import { TableContainerStyled, ControllerStyled } from './RoomActivities.style';
import { AddActivityModal } from '~/features/room';
import { formatDateTime } from '~/utils/format/date';
import { useColumnSearchProps } from '../hooks/useColumnSearchProps';

const { Title } = Typography;
const { Option } = Select;

function RoomActivities() {
  const [activityRow, setActivityRow] = useState('');
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
      ...useColumnSearchProps('activityName', 'activity name'),
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
      onCell: (record) => {
        return {
          onClick: () => {
            setActivityRow({
              activityStt: record.stt,
              activityId: record.key,
              activityName: record.activityName,
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

  if (roomData?.owner?.uid === userData?.uid) {
    columns.push({
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      onCell: (record) => {
        return {
          onClick: () => {
            setActivityRow({
              activityStt: record.stt,
              activityId: record.key,
              activityName: record.activityName,
              activityScore: record.activityScore,
            });
          },
        };
      },
    });
  }

  const handleDelete = (e) => {
    const { activityId } = activityRow;
    /** Delete activity Doc */
    const activityDocRef = doc(
      firestore,
      `rooms/${roomId}/activities/${activityId}`
    );
    deleteDoc(activityDocRef)
      .then(() => {
        console.log(`Delete activity ${activityId} success`);
      })
      .catch((e) => {
        console.log(`Delete activity ${activityId} fail: ${e}`);
      });

    /** Update members activities and allTotalScore */
    roomData?.members.forEach((member) => {
      const memberDocRef = doc(
        firestore,
        `rooms/${roomId}/members/${member.uid}`
      );
      runTransaction(firestore, async (transaction) => {
        const memberDoc = await transaction.get(memberDocRef);
        // update activities
        const newActivities = memberDoc.data().activities;
        if (activityId in newActivities) {
          delete newActivities[activityId]; // delete
        }
        transaction.update(memberDocRef, { activities: newActivities });

        // update allTotalScore
        let newAllTotalScore = 0;
        Object.values(newActivities).forEach((activity) => {
          newAllTotalScore += activity.activityTotalScore;
        });
        transaction.update(memberDocRef, { allTotalScore: newAllTotalScore });
      })
        .then(() => {
          console.log(
            `update member ${member.uid} activities & allTotalScore success`
          );
        })
        .catch((e) => {
          console.log(
            `update member ${member.uid} activities & allTotalScore failed: `,
            e
          );
        });
    });
  };

  const handleSelectRole = (roleName) => {
    const roleKeyValuePairs = roomData?.roles.reduce((prev, cur) => {
      const { roleName, roleCoef } = cur;
      return {
        ...prev,
        [roleName]: roleCoef,
      };
    }, {});
    const { activityId, activityScore } = activityRow;
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
        action: (
          <Popconfirm
            title="Are you sure to delete this activity?"
            okText="Yes"
            cancelText="No"
            placement="topRight"
            onConfirm={handleDelete}
          >
            <Button type="text" danger>
              Delete
            </Button>
          </Popconfirm>
        ),
      };
    });
  } else {
    dataSource = [];
  }

  return (
    <>
      <Title>Activities</Title>
      <ControllerStyled>
        <div>
          {
            /* owner feature */
            roomData?.owner?.uid === userData?.uid && <AddActivityModal />
          }
        </div>
        <div>
          <strong>All score: {memberData?.allTotalScore}</strong>
        </div>
      </ControllerStyled>
      <TableContainerStyled>
        <Table columns={columns} dataSource={dataSource} />
      </TableContainerStyled>
    </>
  );
}

export default RoomActivities;
