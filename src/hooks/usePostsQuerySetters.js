import { useQueryClient } from 'react-query';

export default function usePostsQuerySetters(key) {
  const queryClient = useQueryClient();

  const handleLikeSuccess = ({ postId, likesCount, hasClientLike }) => {
    queryClient.setQueryData(key, (data) => ({
      ...data,
      pages: data.pages.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: { ...post._count, likes: likesCount },
                hasClientLike,
              }
            : post
        )
      ),
    }));
  };

  const handleCommentSuccess = ({ postId, commentsCount }) => {
    queryClient.setQueryData(key, (data) => ({
      ...data,
      pages: data.pages.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: { ...post._count, comments: commentsCount },
              }
            : post
        )
      ),
    }));
  };

  return { handleLikeSuccess, handleCommentSuccess };
}
