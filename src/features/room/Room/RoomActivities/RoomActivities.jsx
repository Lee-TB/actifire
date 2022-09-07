import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Table, Button, Form, Input, message, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  collection,
  doc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from 'reactfire';

import { ModalGroupStyled, TableContainerStyled } from './RoomActivities.style';
import { formatDateTime } from '~/utils/format/date';

const { Option } = Select;

function RoomActivities() {
  const [activityScoreData, setActivityScoreData] = useState('');
  const { status: userStatus, data: userData } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (userData) {
          // handle add activity
          form.resetFields();
          // add activities subcollection of a room
          const activityDocRef = doc(
            collection(firestore, `rooms/${roomId}/activities`)
          );
          const { activityName, activityScore } = values;
          const activityData = {
            roomId,
            uid: userData.uid,
            activityName,
            activityScore: Number(activityScore),
            activityTotalScore: 0,
            activityRole: '',
            createAt: serverTimestamp(),
          };

          setDoc(activityDocRef, activityData)
            .then(() => {
              message.success('add activity success');
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          message.error('unknown user');
        }

        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
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
      <ModalGroupStyled>
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusCircleOutlined />}
        >
          Add activity
        </Button>

        <Modal
          title="Add activity you want to room"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="addButton" onClick={handleOk} type="primary">
              Add
            </Button>,
            <Button key="cancelButton" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Activity name"
              name="activityName"
              rules={[{ required: true, message: 'please fill activity name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="score"
              name="activityScore"
              rules={[
                { required: true, message: 'please fill activity score' },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </ModalGroupStyled>

      <TableContainerStyled>
        <Table columns={columns} dataSource={dataSource} />
      </TableContainerStyled>
    </>
  );
}

export default RoomActivities;
