import React, { useState } from 'react';
import { Button, message, Input, Modal } from 'antd';
import { doc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const ModalStyled = styled(Modal)`
  & .ant-modal-footer {
    text-align: center;
  }
`;

function DeleteRoomButton({ children, ...props }) {
  const [confirmDelete, setConfirmDelete] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const firestore = useFirestore();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const handleDeleteRoom = () => {
    deleteDoc(doc(firestore, `rooms/${roomId}`))
      .then(() => {
        message.success('Your room was successfully deleted!');
        setIsModalOpen(false);
        navigate('/your-rooms');
      })
      .catch((e) => {
        message.error('error: ', e);
        setIsModalOpen(false);
      });
  };

  return (
    <>
      <Button danger onClick={() => setIsModalOpen(true)} {...props}>
        {children}
      </Button>
      <ModalStyled
        title="Are you sure?"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="deleteRoomButton"
            onClick={handleDeleteRoom}
            type="primary"
            danger
            disabled={confirmDelete !== 'DELETE'}
          >
            I understand the consequences, delete this room
          </Button>,
        ]}
      >
        <p>
          Please type{' '}
          <span style={{ color: 'var(--ant-error-color)' }}>DELETE</span> to
          confirm.
        </p>
        <Input onChange={(e) => setConfirmDelete(e.target.value)} />
      </ModalStyled>
    </>
  );
}

export default DeleteRoomButton;
