import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const FormContainer = styled.div`
  box-shadow: 0 0 8px #000;
`;

function Login() {
  const handleOnFinish = (values) => {
    console.log('Success:', values);
  };

  const handleFinishFailed = (error) => {
    console.log('Failed:', error);
  };

  return (
    <FormContainer>
      <Form
        name="login"
        onFinish={handleOnFinish}
        onFinishFailed={handleFinishFailed}
      >
        <Title level={2}>Login</Title>
        <Form.Item>
          <Input />
        </Form.Item>
        <Form.Item>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
}

export default Login;
