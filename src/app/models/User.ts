import { Friendship, FriendshipStatus } from './Friendship';
import { Message } from './Message';
import { RoomParticipant } from './Rooms';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string | null;
  friendshipsSent?: Friendship[];
  friendshipsReceived?: Friendship[];
  rooms?: RoomParticipant[];
  messages?: Message[];
  status: UserStatus;

  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  accessToken: string;
  user: User;
  message: string;
}

export interface UserStatus {
  id: string;
  isOnline: boolean;
  lastActive?: string | null;
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: {
    id: string;
    userId: string;
    isOnline: boolean;
    lastActive: Date | null;
  } | null;
  friendshipStatus: FriendshipStatus;
}
