import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Table, Button, Form, Input, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  collection,
  doc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from 'reactfire';

import { ModalGroupStyled, TableContainerStyled } from './RoomActivities.style';

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
    title: 'Activity score',
    dataIndex: 'activityScore',
    key: 'activityScore',
  },
  {
    title: 'Choose your role',
    dataIndex: 'yourRole',
    children: [],
  },
  {
    title: 'Total score',
    dataIndex: 'totalScore',
    key: 'totalScore',
  },
];

let dataSource = [];

function RoomActivities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { roomId } = useParams();
  const firestore = useFirestore();
  const roomDocRef = doc(firestore, 'rooms', roomId);
  const { status: roomStatus, data: roomData } =
    useFirestoreDocData(roomDocRef);
  const { status: userStatus, data: userData } = useUser();

  // generate roles columns
  columns[3].children = roomData?.roles.map((role) => {
    return {
      title: `${role.roleName} (${role.roleCoef})`,
      dataIndex: role.roleName,
      key: role.roleName,
    };
  });

  // generate activities data
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

  if (activitiesData) {
    dataSource = activitiesData.map((activity, index) => {
      const { activityId, activityName, activityScore } = activity;
      return {
        key: activityId,
        stt: index + 1,
        activityName,
        activityScore,
      };
    });
  }

  // const dataSource = activitiesData.map(activity, (index) => {
  //   const { activityId, activityName, activityScore } = activity;
  //   return {
  //     key: activityId,
  //     stt: index,
  //     activityName,
  //     activityScore,
  //   };
  // });

  // console.log(dataSource);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(userData);
        if (userData) {
          // handle add activity
          form.resetFields();
          console.log(roomId);
          // add activities subcollection of a room
          const activityDocRef = doc(
            collection(firestore, `rooms/${roomId}/activities`)
          );

          const activityData = {
            ...values,
            roomId,
            uid: userData.uid,
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
            <Button onClick={handleOk} type="primary">
              Add
            </Button>,
            <Button onClick={handleCancel}>Cancel</Button>,
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
