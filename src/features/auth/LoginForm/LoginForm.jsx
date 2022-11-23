import React, { useState } from 'react';
import { Form, Input, Button, Typography, Spin, message } from 'antd';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from 'reactfire';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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

function LoginForm() {
  const auth = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { t } = useTranslation();

  const handleOnFinish = (values) => {
    setSubmitLoading(true);
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        message.success(t("Login successful"));
        console.log('Login successful');
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.log('Login error: ', error);
        if (error.code === 'auth/user-not-found') {
          message.error('User not found');
        } else if (error.code === 'auth/wrong-password') {
          message.error('Wrong password');
        }
        setSubmitLoading(false);
      });
  };

  return (
    <Spin indicator={<></>} spinning={submitLoading}>
      <Form
        name="login"
        size="large"
        validateMessages={validateMessages}
        onFinish={handleOnFinish}
      >
        <TitleStyled>{t('login')}</TitleStyled>
        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<AiOutlineMail />} placeholder="email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true },
            { min: 6, message: t("Password too short!") },
          ]}
        >
          <Input.Password
            prefix={<RiLockPasswordLine />}
            placeholder={t("password")}
          />
        </Form.Item>
        <Form.Item>
          <ButtonStyled
            type="primary"
            htmlType="submit"
            loading={submitLoading}
          >
            {t("login now")}
          </ButtonStyled>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default LoginForm;
