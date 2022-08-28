import { Spin as AntSpin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
  />
);

function Spin({ children, ...props }) {
  return (
    <AntSpin indicator={loadingIcon} {...props}>
      {children}
    </AntSpin>
  );
}

export default Spin;
