import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  collection,
  doc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { useFirestore, useSigninCheck } from 'reactfire';
import { useNavigate } from 'react-router-dom';

import { Spin } from '~/components';
import { useTranslation } from 'react-i18next';

const FomContainer = styled.div`
  width: 500px;
`;

const FormTitle = styled.h1`
  text-transform: capitalize;
`;

const DeleteRoleButton = styled.div`
  display: inline-block;
  text-align: center;
  width: 5%;
`;

const RoleDescriptionStyled = styled.span`
  font-size: 12px;
  font-style: italic;
  display: inline-block;
  margin-bottom: 4px;
`;

const defaultRoles = [
  { roleName: 'participant', roleCoef: '1' },
  { roleName: 'supporter', roleCoef: '2' },
  { roleName: 'reporter', roleCoef: '3' },
  { roleName: 'organizer', roleCoef: '4' },
];

function CreateRoomForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSigninCheck();
  const { t } = useTranslation();

  const firestore = useFirestore();
  const navigate = useNavigate();

  if (!data?.signedIn && status === "success") {
    navigate('/login');
  }

  const handleFinish = (values) => {
    setIsLoading(true);
    const roomsColRef = collection(firestore, 'rooms');
    const roomDocRef = doc(roomsColRef); // rooms/:roomId (roomId is generated)
    const memberDocRef = doc(
      firestore,
      `rooms/${roomDocRef.id}/members/${data?.user?.uid}`
    ); // rooms/:roomId/members/:memberId
    const userDocRef = doc(firestore, `users/${data?.user?.uid}`); // users/:userId (specify userId)

    const owner = {
      uid: data?.user?.uid,
      email: data?.user?.email,
      displayName: data?.user?.displayName,
      photoURL: data?.user?.photoURL,
      phoneNumber: data?.user?.phoneNumber,
    };

    const roomData = {
      roomName: values.roomName || '',
      roles: values.roles || defaultRoles,
      roomDescription: values.roomDescription || '',
      owner,
      members: [{ uid: data?.user?.uid }],
      id: roomDocRef.id,
      createAt: serverTimestamp(),
    };

    const batch = writeBatch(firestore);

    batch.set(roomDocRef, roomData);

    batch.set(memberDocRef, {
      uid: owner?.uid,
      allTotalScore: 0,
      createAt: serverTimestamp(),
      updateAt: serverTimestamp(),
    });

    batch.update(userDocRef, {
      rooms: arrayUnion({ roomId: roomDocRef.id }),
    });

    batch
      .commit()
      .then(() => {
        message.success('Create room successful');
        console.log('Update user data success.');
        setIsLoading(false);
        navigate(`/your-rooms/${roomDocRef.id}/activities`);
      })
      .catch((error) => {
        message.error(error);
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <Spin spinning={isLoading}>
      <FomContainer>
        <FormTitle>{t('create a new room')}</FormTitle>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label={t('Room name')}
            name="roomName"
            rules={[{ required: true, message: t('Please fill your room name') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t('Description')} name="roomDescription">
            <Input />
          </Form.Item>

          <Form.Item label={t("Define roles")}>
            <RoleDescriptionStyled>
              {t("If you don't define them. Default roles will be added.")}
            </RoleDescriptionStyled>
            <Form.List name="roles">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, restField }) => (
                    <Form.Item key={key} required={true} {...restField}>
                      <Space>
                        <Form.Item
                          {...restField}
                          name={[name, 'roleName']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message: t("Please fill role's name."),
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder={t("Role name")} />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'roleCoef']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message: t("Please fill role's coefficient."),
                            },
                          ]}
                          noStyle
                        >
                          <InputNumber placeholder={t("Coef")} min={1} max={10} />
                        </Form.Item>

                        <DeleteRoleButton>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </DeleteRoleButton>
                      </Space>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusCircleOutlined />}
                    >
                      {t("Add role")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              {t("Create room")}
            </Button>
          </Form.Item>
        </Form>
      </FomContainer>
    </Spin>
  );
}

export default CreateRoomForm;
