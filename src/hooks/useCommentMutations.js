import { useMutation, useQueryClient } from 'react-query';
import { addLike, removeLike } from 'services/commentsService';

export function useCommentMutations(comment) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation(
    () => {
      if (comment.hasClientLike) removeLike(comment.id);
      else addLike(comment.id);
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(['posts', comment.postId, 'comments'], (postComments) => ({
          ...postComments,
          pages: postComments.pages.map((page) =>
            page.map((c) =>
              c.id === comment.id
                ? {
                    ...c,
                    hasClientLike: !c.hasClientLike,
                    _count: { ...c, likes: c._count.likes + (c.hasClientLike ? -1 : 1) },
                  }
                : c
            )
          ),
        }));
      },
    }
  );

  return { likeMutation };
}
