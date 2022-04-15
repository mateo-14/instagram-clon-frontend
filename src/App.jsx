import { Route, Routes } from 'react-router';
import Home from './pages';
import Login from "./pages/accounts/login";
import Logout from "./pages/accounts/logout";
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

        <Route path="/accounts/login" element={<Login />} />
        <Route path="/accounts/signup" element={<Signup />} />
        <Route path="/accounts/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
