import React, { useState } from 'react';
import { Form, Input, Button, Typography, Spin, message } from 'antd';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GrContactInfo } from 'react-icons/gr';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore } from 'reactfire';
import { collection, doc, setDoc } from 'firebase/firestore';

import randomColor, { ranInt } from '~/utils/randomColor';

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
  const firestore = useFirestore();
  const { t } = useTranslation();

  const handleOnFinish = (values) => {
    setSubmitLoading(true);
    const { email, password, displayName } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        message.success('Sign up successful');
        setSubmitLoading(false);
        // also write user data to firestore
        const { user } = userCredential;
        const usersCol = collection(firestore, 'users');
        const userDoc = doc(usersCol, user.uid);
        const userData = {
          uid: user.uid,
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          displayName: displayName || '',
          photoURL: user.photoURL || '',
          rooms: [],
          avatarColor: randomColor(() => ranInt(50, 150)),
        };
        setDoc(userDoc, userData)
          .then(() => {
            console.log('add user firestore success');
          })
          .catch((error) => {
            console.log('add user firestore error: ', error);
          });
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
        <TitleStyled>{t('Sign Up')}</TitleStyled>

        <Form.Item name="displayName">
          <Input prefix={<GrContactInfo />} placeholder={t("display name")} />
        </Form.Item>

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
            placeholder={t("password")}
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true },
            { min: 6, message: t("Password too short!") },
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
            placeholder={t("confirm password")}
          />
        </Form.Item>

        <Form.Item>
          <ButtonStyled
            type="primary"
            htmlType="submit"
            loading={submitLoading}
          >
            {t("signup now")}
          </ButtonStyled>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default SignUpForm;
