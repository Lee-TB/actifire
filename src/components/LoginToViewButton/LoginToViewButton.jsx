import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

function LoginToViewButton({ children, ...props }) {
  return (
    <Link to="/login">
      <Button shape="round" type="primary" size="large" {...props}>
        {children}
      </Button>
    </Link>
  );
}

export default LoginToViewButton;
