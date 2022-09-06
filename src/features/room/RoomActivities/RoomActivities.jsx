import React, { useState } from 'react';
import { Modal, Table, Button, Form, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import { ModalGroupStyled, TableContainerStyled } from './RoomActivities.style';
import { useParams } from 'react-router-dom';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const defaultRoles = [
  { roleName: 'participant', roleCoef: '1' },
  { roleName: 'supporter', roleCoef: '2' },
  { roleName: 'reporter', roleCoef: '3' },
  { roleName: 'organizer', roleCoef: '4' },
];

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
    children: defaultRoles.map((role) => {
      return {
        title: `${role.roleName} (${role.roleCoef})`,
        dataIndex: role.roleName,
        key: role.roleName,
      };
    }),
  },
  {
    title: 'Total score',
    dataIndex: 'totalScore',
    key: 'totalScore',
  },
];

function RoomActivities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  console.log(params);
  // const firestore = useFirestore();
  // const {status, data:} = useFirestoreCollectionData();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log(values);
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
        <Table columns={columns} />
      </TableContainerStyled>
    </>
  );
}

export default RoomActivities;
