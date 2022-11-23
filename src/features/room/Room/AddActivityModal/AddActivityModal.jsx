import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form, Input, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { serverTimestamp, setDoc, doc, collection } from 'firebase/firestore';
import { useUser, useFirestore } from 'reactfire';
import { useTranslation } from 'react-i18next';

function AddActivityModal() {
  const { t } = useTranslation();
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
    <>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        {t('Add activity')}
      </Button>

      <Modal
        title={t("Add activity you want to room")}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="addButton" onClick={handleOk} type="primary">
            {t("Add")}
          </Button>,
          <Button key="cancelButton" onClick={handleCancel}>
            {t("Cancel")}
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={t("Activity name")}
            name="activityName"
            rules={[{ required: true, message: 'please fill activity name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("Activity score")}
            name="activityScore"
            rules={[{ required: true, message: 'please fill activity score' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddActivityModal;
