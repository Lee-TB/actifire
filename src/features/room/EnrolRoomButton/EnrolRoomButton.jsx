import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirestore, useSigninCheck } from 'reactfire';
import { doc, arrayUnion, writeBatch } from 'firebase/firestore';
function EnrolRoomButton({ children, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const firestore = useFirestore();
  const { data } = useSigninCheck();
  const handleEnrol = () => {
    setIsLoading(true);
    if (!data.signedIn) {
      navigate('/login');
    }
    const userId = data?.user?.uid;
    const roomId = params?.roomId;
    if (userId && roomId) {
      const roomDocRef = doc(firestore, `rooms/${roomId}`);
      const userDocRef = doc(firestore, `users/${userId}`);
      const memberDocRef = doc(firestore, `rooms/${roomId}/members/${userId}`);
      const batch = writeBatch(firestore);
      batch.update(roomDocRef, {
        members: arrayUnion({
          uid: userId,
        }),
      });

      batch.set(
        memberDocRef,
        {
          uid: data?.user?.uid,
          email: data?.user?.email,
          displayName: data?.user?.displayName,
          photoURL: data?.user?.photoURL,
          phoneNumber: data?.user?.phoneNumber,
        },
        { merge: true }
      );

      batch.update(userDocRef, {
        rooms: arrayUnion({
          roomId,
        }),
      });

      batch
        .commit()
        .then(() => {
          message.success('enrol success');
          setIsLoading(false);
          navigate(`/your-rooms/${roomId}/activities`);
        })
        .catch((error) => {
          message.error('enrol failure');
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return (
    <Button loading={isLoading} type="primary" onClick={handleEnrol} {...props}>
      {children}
    </Button>
  );
}

export default EnrolRoomButton;
