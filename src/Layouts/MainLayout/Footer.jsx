import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </AntFooter>
  );
}

export default Footer;
