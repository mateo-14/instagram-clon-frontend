import { useState, useEffect } from 'react';

export default function usePostModal(posts) {
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleRequestOpenModal = (post) => {
    window.history.pushState({ postId: post.id }, null, `/posts/${post.id}`);
    setSelectedPostId(post.id);
  };

  const handlePostClose = () => {
    setSelectedPostId(null);
    window.history.pushState(null, null, `/`);
  };

  useEffect(() => {
    window.onpopstate = (event) => {
      if (event.state?.postId) setSelectedPost(event.state?.postId);
      else setSelectedPost(null);
    };
  }, [posts]);

  return {
    selectedPost: posts?.find((post) => post.id === selectedPostId),
    handleRequestOpenModal,
    handlePostClose,
  };
}
