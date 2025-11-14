import { Room } from './Rooms';
import { User } from './User';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  type: MessageType;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  room?: Room;
}

enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
}
