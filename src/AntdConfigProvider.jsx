import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.css';

ConfigProvider.config({
  theme: {},
});

function AntdConfigProvider({ children }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}

export default AntdConfigProvider;
