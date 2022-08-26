import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import styled from 'styled-components';
import { useAuth, useSigninCheck } from 'reactfire';
import { signInWithEmailAndPassword } from 'firebase/auth';

const { Title } = Typography;

const ButtonStyled = styled(Button)`
  width: 100%;
  text-transform: capitalize;
`;

const TitleStyled = styled(Title)`
  text-align: center;
  text-transform: capitalize;
`;

const validateMessages = {
  required: 'Please fill your ${label}!',
  types: {
    email: 'The input is not valid email!',
  },
};

function Login() {
  const auth = useAuth();

  const handleOnFinish = (values) => {
    console.log('Values before login: ', values);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('create user success: ', user);
      })
      .catch((error) => {
        console.log('create user error: ', error);
      });
  };

  const handleFinishFailed = (error) => {
    console.log('Failed:', error);
  };

  return (
    <Form
      name="login"
      size="large"
      validateMessages={validateMessages}
      onFinish={handleOnFinish}
      onFinishFailed={handleFinishFailed}
    >
      <TitleStyled>login</TitleStyled>
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input prefix={<AiOutlineMail />} placeholder="email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true }, { min: 6, message: 'Password too short!' }]}
      >
        <Input.Password
          prefix={<RiLockPasswordLine />}
          placeholder="password"
        />
      </Form.Item>
      <Form.Item>
        <ButtonStyled type="primary" htmlType="submit">
          login now
        </ButtonStyled>
      </Form.Item>
    </Form>
  );
}

export default Login;
