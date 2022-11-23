import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Dropdown, Avatar, Menu, Button, Space, Select } from 'antd';
import {
  DownOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { CgProfile } from 'react-icons/cg';
import styled from 'styled-components';
import { useFirestore, useSigninCheck, useFirestoreDocData } from 'reactfire';
import { doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import { SignOutButton } from '~/features/auth';
import { useEffect } from 'react';

const { Header: AntHeader } = Layout;
const { Option } = Select;

const AntHeaderStyled = styled(AntHeader)`
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const NewRoomButtonStyled = styled(Button)`
  border: 1px solid var(--ant-primary-color);
  &:hover {
    border: 1px solid var(--ant-primary-color);
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const SignUpButtonStyled = styled(Button)`
  border-color: var(--ant-primary-color);
  &:hover {
    background-color: var(--ant-primary-9);
    color: var(--ant-primary-1);
  }
`;

const AvatarStyled = styled(Avatar)`
  margin-left: 2px;
  background-color: ${(props) => props.backgroundColor || 'auto'};
`;

const languages = [
  { code: 'vi', native: 'Tiếng Việt' },
  { code: 'en', native: 'English' },
];

function Header() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage('vi'); // set default language
  }, []);

  const handleTrans = (code) => {
    i18n.changeLanguage(code);
  };

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { status: signedInCheckStatus, data: signedInCheckData } =
    useSigninCheck();
  const firestore = useFirestore();

  const userDocRef = doc(firestore, `users/${signedInCheckData?.user?.uid}`);
  const { status: userStatus, data: userData } =
    useFirestoreDocData(userDocRef);


    const userMenu = (
      <Menu
        items={[
          {
            icon: <CgProfile />,
            label: <Link to="/profile">{t("Your profile")}</Link>,
            key: '0',
          },
          {
            icon: <AppstoreOutlined />,
            label: <Link to="/your-rooms">{t("Your rooms")}</Link>,
            key: '1',
          },
          {
            type: 'divider',
          },
          {
            icon: <LogoutOutlined />,
            label: <SignOutButton>{t("Log Out")}</SignOutButton>,
            key: '2',
          },
        ]}
      />
    );

  return (
    <AntHeaderStyled>
      <div>
        <Link to="/your-rooms/create-room">
          <NewRoomButtonStyled
            icon={<AppstoreAddOutlined />}
            type="link"
            shape="round"
          >
            {t('New room')}
          </NewRoomButtonStyled>
        </Link>

        <Select
          style={{ width: 120, marginLeft: 10 }}
          onChange={(value) => handleTrans(value)}
          defaultValue={'vi'}
        >
          {languages.map((lang) => {
            return <Option value={lang.code}>{lang.native}</Option>;
          })}
        </Select>
      </div>

      {signedInCheckData?.signedIn && userStatus === 'success' && userData ? (
        <div style={{ cursor: 'pointer' }}>
          <Dropdown
            overlay={userMenu}
            trigger={['click']}
            placement="bottomRight"
            open={userDropdownOpen}
            onOpenChange={(open) => setUserDropdownOpen(open)}
          >
            <div>
              <DownOutlined />
              {userData.photoURL ? (
                <AvatarStyled src={userData.photoURL} />
              ) : (
                <AvatarStyled
                  backgroundColor={userData.avatarColor}
                  icon={
                    (!userData.photoURL &&
                      (userData.displayName[0]?.toUpperCase() ||
                        userData.email[0]?.toUpperCase())) ||
                    'U'
                  }
                />
              )}
            </div>
          </Dropdown>
        </div>
      ) : (
        <Space>
          <Link to="signup">
            <SignUpButtonStyled>{t('Sign Up')}</SignUpButtonStyled>
          </Link>
          <Link to="login">
            <Button type="primary">{t('Login')}</Button>
          </Link>
        </Space>
      )}
    </AntHeaderStyled>
  );
}

export default Header;
