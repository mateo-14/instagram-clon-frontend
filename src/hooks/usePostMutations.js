import { useMutation, useQueryClient } from 'react-query';
import { addLike, removeLike } from 'services/postsServices';
import { addComment as addPostComment } from 'services/commentsService';

export function usePostMutations(post = {}) {
  const queryClient = useQueryClient();
  const likeMutation = useMutation(
    () => {
      if (post.hasClientLike) removeLike(post.id);
      else addLike(post.id);

      return {
        hasClientLike: !post.hasClientLike,
        likesCount: post._count.likes + (post.hasClientLike ? -1 : 1),
        postId: post.id,
      };
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['posts', data.postId], (cachedPost) => {
          cachedPost = cachedPost || post;
          return {
            ...cachedPost,
            _count: { ...cachedPost._count, likes: data.likesCount },
            hasClientLike: data.hasClientLike,
          };
        });
      },
    }
  );

  const commentMutation = useMutation(
    async ({ text, commentRepliedId }) => {
      const comment = await addPostComment(post.id, text, commentRepliedId)
      return {postId: post.id, commentsCount: post._count.comments + 1, comment};
    },
    {
      onSuccess: (data) => {
        if (!queryClient.getQueryData(['posts', data.postId, 'comments'])) return;

        queryClient.setQueryData(['posts', data.postId, 'comments'], ({ pages, pageParams }) => {
          return {
            pageParams,
            pages: pages.map((page, i) => (i === 0 ? [data.comment, ...page] : page)),
          };
        });
      },
    }
  );

  return { commentMutation, likeMutation };
}
