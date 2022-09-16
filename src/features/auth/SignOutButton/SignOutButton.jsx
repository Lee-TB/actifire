import React from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useAuth } from 'reactfire';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ButtonStyled = styled.button`
  cursor: pointer;
  border: none;
  ontline: none;
  background-color: unset;
`;

function SignOutButton({ children, ...props }) {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        message.success('Sign Out successful');
      })
      .catch((error) => {
        console.log('sign out error', error);
        message.error(error);
      });
  };

  return (
    <ButtonStyled onClick={handleSignOut} {...props}>
      {children}
    </ButtonStyled>
  );
}

export default SignOutButton;
