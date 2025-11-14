import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RoomService } from '../../core/services/room.service';
import { ChatService } from '../../core/services/chat.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-chats-section',
  imports: [],
  templateUrl: './chats-section.html',
  styleUrl: './chats-section.css',
})
export class ChatsSection {
  private readonly roomService = inject(RoomService);
  private readonly chatService = inject(ChatService);
  private readonly notificationService = inject(NotificationsService);
  private userService = inject(UserService);
  rooms = toSignal(this.roomService.rooms$);
  loading = toSignal(this.roomService.loading$);
  error = toSignal(this.roomService.error$);
  activeRoom = toSignal(this.chatService.activeRoom$);
  unreadedMessages = this.notificationService.unreadedMessages;
  user = toSignal(this.userService.user$);

  ngOnInit(): void {
    this.roomService.getRooms();
    this.notificationService.getUnreadMessagesCount();
  }

  joinRoom(roomId: string) {
    if (this.activeRoom() === roomId) {
      return;
    }
    console.log('Joining room:', roomId);
    this.chatService.joinRoom(roomId);
  }

  truncateMessage(message: string, maxLength: number = 30): string {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + '...';
  }
}
