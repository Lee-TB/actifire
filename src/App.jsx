import { Routes, Route } from 'react-router-dom';
import { AuthLayout, MainLayout } from './Layouts';
import { HomePage, YourRoomsPage, PageNotFound, ProfilePage } from './pages';
import { LoginForm, SignUpForm } from './features/auth';
import { CreateRoomForm, RoomList } from './features/room';

function App() {
  return (
    <>
      <Routes>
        {/* For all page have main layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Explore existing room */}
          <Route index element={<HomePage />} />
          {/* display and setting your profile */}
          <Route path="profile" element={<ProfilePage />} />

          <Route path="your-rooms">
            {/* display your room list */}
            <Route index element={<YourRoomsPage />} />
            {/* display your invidual room */}
            <Route path=":roomId">
              <Route index />
              <Route path="members" element="members" />
            </Route>
            {/* create room */}
            <Route path="create-room" element={<CreateRoomForm />} />
          </Route>
        </Route>

        {/* For authentication */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>

        {/* For another path will be page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
