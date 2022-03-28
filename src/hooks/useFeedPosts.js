import { useInfiniteQuery, useQueryClient } from 'react-query';
import { getFeed } from 'services/postsServices';

function useFeedPosts() {
  const queryClient = useQueryClient();
  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['posts', 'feed'],
    ({ pageParam }) => getFeed(pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 5) return;
        return lastPage[lastPage.length - 1].id;
      },
    }
  );

  const handleLikeSuccess = (postId, newLikes, hasClientLike) => {
    queryClient.setQueryData(['posts', 'feed'], (data) => ({
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
    queryClient.setQueryData(['posts', 'feed'], (data) => ({
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
  
  return {
    posts: data?.pages?.flat(),
    status,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleLikeSuccess,
    handleCommentSuccess,
  };
}

export default useFeedPosts;
