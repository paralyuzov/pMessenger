import { User } from './User';

export interface Friendship {
  id: string;
  senderId: string | User;
  recipientId: string | User;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  sender: User;
  recipient: User;
}

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NONE = 'NONE',
}
