import { Route, Routes } from 'react-router';
import Home from './pages';
import Posts from "./pages/posts";
import Profile from "./pages/profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/posts/:id" element={<Posts />} />
      </Routes>
    </>
  );
}

export default App;
