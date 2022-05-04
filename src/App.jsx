import EditProfileModal from 'components/EditProfileModal';
import PostModal from "components/PostModal";
import { Toast } from 'components/Toast';
import useAuth from 'hooks/useAuth';
import { Route, Routes, useLocation } from 'react-router';
import Home from './pages';
import Login from './pages/accounts/login';
import Logout from './pages/accounts/logout';
import Signup from './pages/accounts/signup';
import Posts from './pages/posts';
import Profile from './pages/profile';

function App() {
  const location = useLocation();
  let finalLocation = location.state?.modalLocation;
  if (!finalLocation) {
    if (location.pathname === '/accounts/edit') 
      finalLocation = '/';
    else finalLocation = location;
  }


  return (
    <>
      <Routes location={finalLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/posts/:id" element={<Posts />} />

        <Route path="/accounts">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/accounts/edit" element={<EditProfileModal />} />
        <Route path="/posts/:id" element={<PostModal />} />
      </Routes>
      <Toast />
    </>
  );
}

export default App;
