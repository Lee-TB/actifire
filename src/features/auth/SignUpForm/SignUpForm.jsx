import React, { useState } from 'react';
import { Form, Input, Button, Typography, Spin, message } from 'antd';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import styled from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from 'reactfire';

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

function SignUpForm() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const auth = useAuth();

  const handleOnFinish = (values) => {
    setSubmitLoading(true);
    const { email, password } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        message.success('Sign up successful');
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.log('create user error: ', error);
        if (error.code === 'auth/email-already-in-use') {
          message.error('email already in use');
        }
        setSubmitLoading(false);
      });
  };

  return (
    <Spin indicator={<></>} spinning={submitLoading}>
      <Form
        name="signup"
        size="large"
        validateMessages={validateMessages}
        onFinish={handleOnFinish}
      >
        <TitleStyled>sign up</TitleStyled>

        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<AiOutlineMail />} placeholder="email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true },
            { min: 6, message: 'Password too short!' },
          ]}
        >
          <Input.Password
            prefix={<RiLockPasswordLine />}
            placeholder="password"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          rules={[
            { required: true },
            { min: 6, message: 'Password too short!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<RiLockPasswordLine />}
            placeholder="confirm password"
          />
        </Form.Item>

        <Form.Item>
          <ButtonStyled
            type="primary"
            htmlType="submit"
            loading={submitLoading}
          >
            sign up now
          </ButtonStyled>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default SignUpForm;
