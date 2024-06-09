import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

export function FileTableCell({ userId }: { userId: Id<'users'> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}
