import React from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

const FomContainer = styled.div`
  width: 600px;
`;

const FormTitle = styled.h1`
  text-transform: capitalize;
`;

const DeleteRoleButton = styled.div`
  display: inline-block;
  text-align: center;
  width: 5%;
`;

function CreateRoomForm() {
  const firestore = useFirestore();

  const handleFinish = (roomData) => {
    const roomDocRef = doc(firestore, 'rooms', roomData.roomName);
    setDoc(roomDocRef, roomData).then(() => {
      console.log('create room successful');
    });
  };
  return (
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

        <label>Roles</label>
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
                          whitespace: true,
                          message: "Please input role's name.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="role name" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'score']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: "Please input role's score.",
                        },
                      ]}
                      noStyle
                    >
                      <InputNumber placeholder="score" min={1} max={10} />
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
                  style={{
                    width: '30%',
                  }}
                  icon={<PlusCircleOutlined />}
                >
                  Add role
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Create room
          </Button>
        </Form.Item>
      </Form>
    </FomContainer>
  );
}

export default CreateRoomForm;
