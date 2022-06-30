import EditProfileModal from 'components/EditProfileModal'
import PostModal from 'components/PostModal'
import { Toast } from 'components/Toast'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { ON_ADD_COMMENT, ON_CREATE_POST, ON_SHOW_TOAST } from './events/Events'
import { eventEmitter } from './main'
import Home from './pages'
import Login from './pages/accounts/login'
import Logout from './pages/accounts/logout'
import Signup from './pages/accounts/signup'
import Posts from './pages/posts'
import Profile from './pages/profile'

function App() {
  const location = useLocation()
  let finalLocation = location.state?.modalLocation
  if (!finalLocation) {
    if (location.pathname === '/accounts/edit') finalLocation = '/'
    else finalLocation = location
  }

  useEffect(() => {
    const onCreatePost = () => {
      eventEmitter.emit(ON_SHOW_TOAST, 'Post uploaded successfully.')
    }
    const onAddComment = () => {
      eventEmitter.emit(ON_SHOW_TOAST, 'Comment added.')
    }

    eventEmitter.on(ON_CREATE_POST, onCreatePost)
    eventEmitter.on(ON_ADD_COMMENT, onAddComment)

    return () => {
      eventEmitter.off(ON_CREATE_POST, onCreatePost)
      eventEmitter.off(ON_ADD_COMMENT, onAddComment)
    }
  }, [])

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
  )
}

export default App
