import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePostModal(posts) {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { pathname } = useLocation();

  const handleRequestOpenModal = (post) => {
    window.history.pushState({ postId: post.id }, null, `/posts/${post.id}`);
    setSelectedPostId(post.id);
  };

  const handlePostClose = () => {
    setSelectedPostId(null);
    window.history.pushState(null, null, pathname);
  };

  useEffect(() => {
    window.onpopstate = (event) => {
      if (event.state?.postId) setSelectedPostId(event.state?.postId);
      else setSelectedPostId(null);
    };
  }, [posts]);

  return {
    selectedPost: posts?.find((post) => post.id === selectedPostId),
    handleRequestOpenModal,
    handlePostClose,
  };
}
