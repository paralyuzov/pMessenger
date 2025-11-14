import { User } from "./User";
import { Message } from "./Message";

export interface RoomParticipant {
  id: string;
  userId: string;
  roomId: string;
  user: User;
  room: Room;
}

export interface Room {
  id: string;
  name?: string | null;
  isGroup: boolean;
  participants: RoomParticipant[];
  lastMessage?: Message | null;
  lastActivity?: string | null;
  createdAt: string;
  updatedAt: string;
}
