import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  Typography,
  Avatar,
  Row,
  Col,
  Button,
  message,
  Upload,
  Space,
} from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';
import {
  useAuth,
  useFirestore,
  useStorage,
  useFirestoreDocData,
  useSigninCheck,
} from 'reactfire';
import { doc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';

import { Spin } from '~/components';
import { LoginToViewButton } from '../components';
import randomColor, { ranInt } from '~/utils/randomColor';

const { Title } = Typography;

const ContainerStyled = styled.div`
  width: 800px;
  margin: 0 auto;
`;

const AvatarStyled = styled(Avatar)`
  cursor: default;
  background-color: ${(props) =>
    props.backgroundColor || randomColor(() => ranInt(50, 150))};
`;

const DisplayNameStyled = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const EmailStyled = styled.div`
  margin-top: 4px;
  font-style: italic;
  color: rgba(0, 0, 0, 0.7);
`;

const PhoneNumberStyled = styled.div``;

const EditOutlinedStyled = styled(EditOutlined)`
  cursor: pointer;
  &:hover {
    color: var(--ant-primary-color);
  }
`;

const InputStyled = styled.input`
  outline: none;
  border: 1px solid #ccc;
  border-radius: 6px;
  line-height: 2rem;
  width: fit-content;
  block-size: fit-content;
  font-size: inherit;
  font-weight: inherit;
  margin-right: 4px;
  padding: 0;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
`;

function ProfilePage() {
  const [displayNameState, setdisplayNameState] = useState('Unknow');
  const [isEditDisplayName, setIsEditDisplayName] = useState(false);
  const inputRef = useRef(null);
  const firestore = useFirestore();
  // const storage = useStorage();
  // const auth = useAuth();
  const { status: signinCheckStatus, data: signinCheckData } = useSigninCheck();
  const userDocRef = doc(firestore, `users/${signinCheckData?.user?.uid}`);
  const { status: userStatus, data: userData } =
    useFirestoreDocData(userDocRef);

  useEffect(() => {
    setdisplayNameState(userData?.displayName || 'Unknow');
  }, [userStatus]);

  if (signinCheckStatus === 'success' && !signinCheckData.signedIn) {
    return (
      <div style={{ textAlign: 'center' }}>
        <LoginToViewButton>Login to view Profile</LoginToViewButton>;
      </div>
    );
  }

  // useEffect(() => {
  // const avatarsRef = ref(storage, `avatars/`);
  // listAll(avatarsRef).then((res) => {
  //   console.log(res);
  // });
  // }, []);

  // const handleUploadAvatar = (info) => {
  //   const avatarRef = ref(storage, `avatars/${info.file.name}`);

  //   uploadBytes(avatarRef, info.file, {
  //     contentType: 'image/jpeg',
  //   }).then((snapshot) => {
  //     console.log(getDownloadURL(snapshot.ref));
  //   });
  // };

  const handleInputChange = (value) => {
    setdisplayNameState(value.target.value);
  };

  const editDisplayName = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
    setIsEditDisplayName(true);
  };

  const saveEditDisplayName = () => {
    const displayName = displayNameState.trim();
    if (
      displayName &&
      displayName !== 'Unknow' &&
      displayName !== userData?.displayName // not current display name
    ) {
      updateDoc(userDocRef, {
        displayName,
      })
        .then(() => {
          message.success('Display name is updated');
          setIsEditDisplayName(false);
        })
        .catch((error) => {
          console.log('Update display name fail');
          setIsEditDisplayName(false);
        });
    } else {
      setIsEditDisplayName(false);
    }
  };

  return (
    <Spin spinning={signinCheckStatus === 'loading'}>
      <ContainerStyled>
        <Title>Profile</Title>
        {userStatus === 'success' && (
          <>
            <Row gutter={[8, 8]}>
              <Col span={24} lg={6}>
                <Space direction="vertical">
                  <AvatarStyled
                    size={128}
                    backgroundColor={userData?.avatarColor}
                    icon={(!userData?.photoURL && displayNameState[0]) || 'U'}
                  >
                    {userData?.photoURL && <Image src={userData?.photoURL} />}
                  </AvatarStyled>
                  {/* <Upload
                    showUploadList={false}
                    name="file"
                    onChange={handleUploadAvatar}
                  >
                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                  </Upload> */}
                </Space>
              </Col>
              <Col span={24} lg={18}>
                <DisplayNameStyled>
                  {isEditDisplayName ? (
                    <InputGroup>
                      <InputStyled
                        value={displayNameState}
                        onChange={handleInputChange}
                        size={displayNameState.length || 1}
                        ref={inputRef}
                      />
                      <Button
                        type="primary"
                        size="small"
                        shape="round"
                        onClick={saveEditDisplayName}
                      >
                        Save
                      </Button>
                    </InputGroup>
                  ) : (
                    <>
                      {displayNameState}
                      <EditOutlinedStyled
                        style={{ marginLeft: '8px' }}
                        onClick={editDisplayName}
                      />
                    </>
                  )}
                </DisplayNameStyled>
                <EmailStyled>
                  <span>Email: </span>
                  {userData.email}
                </EmailStyled>
                <PhoneNumberStyled>
                  <span>Phone: </span>
                  {userData.phoneNumber || '+84 000 000 000'}
                </PhoneNumberStyled>
              </Col>
            </Row>
          </>
        )}
      </ContainerStyled>
    </Spin>
  );
}

export default ProfilePage;
