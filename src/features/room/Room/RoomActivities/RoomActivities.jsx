import React, { useRef, useState } from 'react';
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
import { Spin } from '~/components';
import { InputTimes } from './components';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Option } = Select;

function RoomActivities() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
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
      title: t('STT'),
      dataIndex: 'stt',
      key: 'stt',
      ...useColumnSearchProps('stt', 'STT'),
    },
    {
      title: t('Activity name'),
      dataIndex: 'activityName',
      key: 'activityName',
      ...useColumnSearchProps('activityName', 'activity name'),
    },
    {
      title: t('Create at'),
      dataIndex: 'createAt',
      key: 'createAt',
    },
    {
      title: t('Activity score'),
      dataIndex: 'activityScore',
      key: 'activityScore',
    },
    {
      title: t('Choose your role'),
      dataIndex: 'activityChooseRole',
      key: 'activityChooseRole',
    },
    {
      title: t('Number of times'),
      dataIndex: 'times',
      key: 'times',
    },
    {
      title: t('Total score'),
      dataIndex: 'activityTotalScore',
      key: 'activityTotalScore',
    },
  ];

  if (roomData?.owner?.uid === userData?.uid) {
    columns.push({
      title: t('Action'),
      dataIndex: 'action',
      key: 'action',
    });
  }

  const handleDelete = (e) => {
    setIsLoading(true);
    const { activityId } = activityRow;
    /** Delete activity Doc */
    const activityDocRef = doc(
      firestore,
      `rooms/${roomId}/activities/${activityId}`
    );
    deleteDoc(activityDocRef)
      .then(() => {
        console.log(`Delete activity ${activityId} success`);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`Delete activity ${activityId} fail: ${e}`);
        setIsLoading(false);
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

  const roleKeyValuePairs = roomData?.roles.reduce((prev, cur) => {
    const { roleName, roleCoef } = cur;
    return {
      ...prev,
      [roleName]: roleCoef,
    };
  }, {});

  const handleChangeTimes = (activityTimes) => {
    setIsLoading(true);

    const memberDocRef = doc(
      firestore,
      `rooms/${roomId}/members/${userData.uid}`
    );

    runTransaction(firestore, async (transaction) => {
      const memberDoc = await transaction.get(memberDocRef);
      if (!memberDoc.exists()) {
        throw 'memberDoc does not exist!';
      }

      const { activityId, activityScore } = activityRow;
      const allTotalScore = memberDoc.data().allTotalScore || 0;
      const activities = memberDoc.data().activities;
      let prevActivity = {
        activityId,
        activityRole: '',
        activityTimes: 0,
        activityTotalScore: 0,
      };

      if (activities?.[activityId]) {
        prevActivity = activities?.[activityId];
      }

      const roleCoef = Number(roleKeyValuePairs[prevActivity.activityRole]);
      const activityTotalScore = prevActivity.activityRole
        ? roleCoef * activityScore * activityTimes
        : 0;

      const prevActivityTotalScore = prevActivity?.activityTotalScore || 0;

      // recompute allTotalScore (-) prev (+) current activityTotalScore which has just selected
      const newAllTotalScore =
        allTotalScore - prevActivityTotalScore + activityTotalScore;

      transaction.update(memberDocRef, {
        allTotalScore: newAllTotalScore,
        activities: {
          ...activities,
          [activityId]: {
            ...prevActivity,
            activityTotalScore,
            activityTimes: activityTimes || 0,
          },
        },
        updateAt: serverTimestamp(),
      });
    })
      .then(() => {
        console.log(
          'Transaction update number of times successfully committed!'
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('Transaction update number of times failed: ', error);
        setIsLoading(false);
      });
  };

  const handleSelectRole = (roleName) => {
    setIsLoading(true);
    runTransaction(firestore, async (transaction) => {
      const memberDocRef = doc(
        firestore,
        `rooms/${roomId}/members/${userData.uid}`
      );
      const memberDoc = await transaction.get(memberDocRef);
      if (!memberDoc.exists()) {
        throw 'memberDoc does not exist!';
      }
      const { activityId, activityScore } = activityRow;
      const activities = memberDoc.data().activities;
      const allTotalScore = memberDoc.data().allTotalScore || 0;
      const roleCoef = Number(roleKeyValuePairs[roleName]);

      let prevActivity = {
        activityId,
        activityRole: '',
        activityTimes: 0,
        activityTotalScore: 0,
      };

      if (activities?.[activityId]) {
        prevActivity = activities?.[activityId];
      }

      const activityTotalScore = roleName
        ? roleCoef * activityScore * (prevActivity.activityTimes || 0)
        : 0;

      const prevActivityTotalScore = prevActivity?.activityTotalScore || 0;

      // recompute allTotalScore (-) prev (+) current activityTotalScore which has just selected
      const newAllTotalScore =
        allTotalScore - prevActivityTotalScore + activityTotalScore;

      transaction.update(memberDocRef, {
        allTotalScore: newAllTotalScore,
        activities: {
          ...activities,
          [activityId]: {
            ...prevActivity,
            activityTotalScore,
            activityRole: roleName,
            activityTimes: prevActivity.activityTimes || 0,
          },
        },
        updateAt: serverTimestamp(),
      });
    })
      .then(() => {
        console.log('Transaction update total score successfully committed!');
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('Transaction update total score failed: ', error);
        setIsLoading(false);
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
      let activityTimes = 0;
      if (memberData?.hasOwnProperty('activities')) {
        activityRole = memberData?.activities?.[activityId]?.activityRole;
        activityTotalScore =
          memberData?.activities?.[activityId]?.activityTotalScore;
        activityTimes = memberData?.activities?.[activityId]?.activityTimes;
      }

      return {
        ...activity,
        activityRole,
        activityTotalScore,
        activityTimes,
      };
    });

    dataSource = activitiesMergeMemberData.map((activity, index) => {
      const {
        activityId,
        activityName,
        createAt,
        activityScore,
        activityRole,
        activityTimes,
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
            <Option key="select role" value={''}>
              {t('select role')}
            </Option>
            {roomData?.roles.map((role) => {
              const { roleName, roleCoef } = role;
              return (
                <Option key={roleName} value={roleName}>
                  {`${t(roleName)} (${roleCoef})`}
                </Option>
              );
            })}
          </Select>
        ),
        times: (
          <InputTimes
            onChangeDebounce={handleChangeTimes}
            value={activityTimes}
            min="0"
          />
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
              {t('Delete')}
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
      <Title
        level={2}
        style={{ textAlign: 'center', textTransform: 'capitalize' }}
      >
        {t('activities')}
      </Title>
      <ControllerStyled>
        <div>
          {
            /* owner feature */
            roomData?.owner?.uid === userData?.uid && <AddActivityModal />
          }
        </div>
        <div>
          <strong style={{ textTransform: 'capitalize' }}>
            {t('current score')}: {memberData?.allTotalScore}
          </strong>
        </div>
      </ControllerStyled>
      <TableContainerStyled>
        <Spin spinning={isLoading}>
          <Table
            bordered={true}
            columns={columns}
            dataSource={dataSource}
            onRow={(record) => ({
              onClick: () => {
                setActivityRow({
                  activityStt: record.stt,
                  activityId: record.key,
                  activityName: record.activityName,
                  activityScore: record.activityScore,
                  activityTotalScore: record.activityTotalScore,
                  activityTimes: record.times.props.value,
                  activityRoleName: record.activityChooseRole.props.value,
                });
              },
            })}
          />
        </Spin>
      </TableContainerStyled>
    </>
  );
}

export default RoomActivities;
