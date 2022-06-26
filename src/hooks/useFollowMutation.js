import { useMutation } from 'react-query';
import { followUser, unfollowUser } from 'services/usersService';

export default function useFollowMutation({ onSuccess } = {}) {
  const followMutation = useMutation(
    async ({ userId, followedByClient }) => {
      if (followedByClient) await unfollowUser(userId);
      else await followUser(userId);
    },
    { onSuccess }
  );

  return followMutation;
}
