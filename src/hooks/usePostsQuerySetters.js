import { useQueryClient } from "react-query";

export default function usePostsQuerySetters(key) {
  const queryClient = useQueryClient();

  const handleLikeSuccess = (postId, newLikes, hasClientLike) => {
    queryClient.setQueryData(key, (data) => ({
      ...data,
      pages: data.pages.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: { ...post._count, likes: newLikes },
                hasClientLike,
              }
            : post
        )
      ),
    }));
  };

  const handleCommentSuccess = (postId, newComments) => {
    queryClient.setQueryData(key, (data) => ({
      ...data,
      pages: data.pages.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: { ...post._count, comments: newComments },
              }
            : post
        )
      ),
    }));
  };

  return { handleLikeSuccess, handleCommentSuccess };
}
