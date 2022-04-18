import { Route, Routes } from 'react-router';
import Home from './pages';
import Edit from './pages/accounts/edit';
import Login from './pages/accounts/login';
import Logout from './pages/accounts/logout';
import Signup from './pages/accounts/signup';
import Posts from './pages/posts';
import Profile from './pages/profile';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/posts/:id" element={<Posts />} />

        <Route path="/accounts">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="logout" element={<Logout />} />
          <Route path="edit" element={<Edit />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
