import React from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useNavigate } from 'react-router-dom';

const FomContainer = styled.div`
  width: 50%;
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
  const navigate = useNavigate();

  const handleFinish = (roomData) => {
    const roomsColRef = collection(firestore, 'rooms');
    const roomDocRef = doc(roomsColRef); // a new document with generated Id
    setDoc(roomDocRef, roomData).then(() => {
      console.log('create room successful');
      console.log(roomDocRef.id);
      navigate(`/your-rooms/${roomDocRef.id}`);
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
