import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout, MainLayout } from './Layouts';
import { ExplorePage, YourRoomsPage, PageNotFound, ProfilePage } from './pages';
import { LoginForm, SignUpForm } from './features/auth';
import { CreateRoomForm } from './features/room';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ExplorePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="your-rooms">
            <Route index element={<YourRoomsPage />} />
            <Route path=":roomId" element={<></>} />
            <Route path="create-room" element={<CreateRoomForm />} />
          </Route>
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
