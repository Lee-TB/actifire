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

const FomContainer = styled.div`
  max-width: 500px;
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
  const { data } = useSigninCheck();

  const firestore = useFirestore();
  const navigate = useNavigate();

  if (!data?.signedIn) {
    navigate('/login');
  }

  const handleFinish = (values) => {
    setIsLoading(true);
    const roomsColRef = collection(firestore, 'rooms');
    const roomDocRef = doc(roomsColRef); // a new document with generated ID
    const userDocRef = doc(firestore, `users/${data?.user?.uid}`);
    const roomData = {
      roomName: values.roomName || '',
      roles: values.roles || defaultRoles,
      roomDescription: values.roomDescription || '',
      owner: {
        uid: data?.user?.uid,
        email: data?.user?.email,
        displayName: data?.user?.displayName,
        photoURL: data?.user?.photoURL,
        phoneNumber: data?.user?.phoneNumber,
      },
      members: [{ uid: data?.user?.uid }],
      id: roomDocRef.id,
      createAt: serverTimestamp(),
    };

    const batch = writeBatch(firestore);

    batch.set(roomDocRef, roomData);

    batch.update(userDocRef, {
      rooms: arrayUnion({ roomId: roomDocRef.id }),
    });

    batch
      .commit()
      .then(() => {
        message.success('Create room successful');
        console.log('Update user data success.');
        setIsLoading(false);
        navigate(`/your-rooms/${roomDocRef.id}`);
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
        <FormTitle>create a new room</FormTitle>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Room name"
            name="roomName"
            rules={[{ required: true, message: 'Please fill your room name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="roomDescription">
            <Input />
          </Form.Item>

          <Form.Item label="Define roles">
            <RoleDescriptionStyled>
              If you don't define them. Default roles will be added.
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
                              message: "Please fill role's name.",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="Role name" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'roleCoef']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message: "Please fill role's coefficient.",
                            },
                          ]}
                          noStyle
                        >
                          <InputNumber placeholder="Coef" min={1} max={10} />
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
                      Add role
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Create room
            </Button>
          </Form.Item>
        </Form>
      </FomContainer>
    </Spin>
  );
}

export default CreateRoomForm;
