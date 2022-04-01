import { Route, Routes } from 'react-router';
import Home from './pages';
import Login from "./pages/accounts/login";
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
      </Routes>
    </>
  );
}

export default App;
