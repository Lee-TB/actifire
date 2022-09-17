import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      <p>Actifire ©2022 Created by Duc Tran</p>
    </AntFooter>
  );
}

export default Footer;
