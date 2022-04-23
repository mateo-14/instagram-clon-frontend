import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePostModal(posts) {
  const [selectetId, setSelectedId] = useState(null);
  const { pathname } = useLocation();
  const outsideRef = useRef();

  const open = (post) => {
    window.history.pushState({ postId: post.id }, null, `/posts/${post.id}`);
    setSelectedId(post.id);
  };

  const close = () => {
    setSelectedId(null);
    window.history.pushState(null, null, pathname);
  };

  useEffect(() => {
    window.onpopstate = (event) => {
      if (event.state?.postId) setSelectedId(event.state?.postId);
      else setSelectedId(null);
    };
  }, [posts]);

  return {
    openPost: posts?.find((post) => post.id === selectetId),
    open,
    close,
    outsideRef,
  };
}
