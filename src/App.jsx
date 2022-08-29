import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout, MainLayout } from './Layouts';
import { Home, Profile, Room, PageNotFound } from './pages';
import { Login, SignUp } from './features/auth';
import CreateRoomForm from './pages/CreateRoomForm';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="room" element={<Room />} />
          <Route path="create-room" element={<CreateRoomForm />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
