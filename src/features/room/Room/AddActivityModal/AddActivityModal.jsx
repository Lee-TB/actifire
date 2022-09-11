import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form, Input, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { serverTimestamp, setDoc, doc, collection } from 'firebase/firestore';
import { useUser, useFirestore } from 'reactfire';
import styled from 'styled-components';

const ModalGroupStyled = styled.div`
  margin-bottom: 8px;
`;

function AddActivityModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { status: userStatus, data: userData } = useUser();
  const firestore = useFirestore();
  const { roomId } = useParams();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (userStatus === 'success' && userData) {
          // handle add activity
          form.resetFields();
          // add activities subcollection of a room
          const activityDocRef = doc(
            collection(firestore, `rooms/${roomId}/activities`)
          );

          const { activityName, activityScore } = values;
          const activityData = {
            activityId: activityDocRef.id,
            roomId,
            activityName,
            activityScore: Number(activityScore),
            creator: userData.uid,
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
    <ModalGroupStyled>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
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
            rules={[{ required: true, message: 'please fill activity score' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </ModalGroupStyled>
  );
}

export default AddActivityModal;
