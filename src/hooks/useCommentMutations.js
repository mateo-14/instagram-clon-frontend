import { useMutation, useQueryClient } from 'react-query';
import { addLike, removeLike } from 'services/commentsService';

export function useCommentMutations(comment) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation(
    () => (comment.hasClientLike ? removeLike(comment.id) : addLike(comment.id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', comment.postId, 'comments']);
      },
    }
  );

  const like = () => likeMutation.mutate();

  return { like };
}
