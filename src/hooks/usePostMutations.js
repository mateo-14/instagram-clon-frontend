import { useMutation, useQueryClient } from 'react-query';
import { addLike, removeLike } from 'services/postsServices';
import { addComment as addPostComment } from 'services/commentsService';

export function usePostMutations(post, { onLikeSuccess, onCommentSuccess } = {}) {
  const queryClient = useQueryClient();
  const likeMutation = useMutation(
    () => {
      if (post.hasClientLike) removeLike(post.id);
      else addLike(post.id);
    },
    {
      onSuccess: () => {
        const hasClientLike = !post.hasClientLike;
        const newLikes = post._count.likes + (post.hasClientLike ? -1 : 1);
        queryClient.setQueryData(['posts', post.id], (data) => {
          data = data || post;
          return {
            ...data,
            _count: { ...data._count, likes: newLikes },
            hasClientLike,
          };
        });

        if (onLikeSuccess) onLikeSuccess(post.id, newLikes, hasClientLike);
      },
    }
  );

  const commentMutation = useMutation(
    ({ text, commentRepliedId }) => addPostComment(post.id, text, commentRepliedId),
    {
      onSuccess: (data) => {
        if (onCommentSuccess) onCommentSuccess(post.id, post._count.comments + 1);
        if (!queryClient.getQueryData(['posts', data.postId, 'comments'])) return;
        queryClient.setQueryData(['posts', data.postId, 'comments'], ({ pages, pageParams }) => {
          return {
            pageParams,
            pages: pages.map((page, i) => (i === 0 ? [data, ...page] : page)),
          };
        });
      },
    }
  );

  const like = () => {
    likeMutation.mutate();
  };

  const addComment = (data) => {
    commentMutation.mutate(data);
  };

  return { like, addComment };
}
