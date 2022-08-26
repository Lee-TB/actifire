import 'normalize.css';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.css';

ConfigProvider.config({
  theme: {
    primaryColor: '#1DA57A',
  },
});

function AntdConfigProvider({ children }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}

export default AntdConfigProvider;
