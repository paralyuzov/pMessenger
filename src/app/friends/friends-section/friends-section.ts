import { Component, computed, inject, OnInit } from '@angular/core';
import { FriendshipService } from '../../core/services/friendship.service';
import { ChatService } from '../../core/services/chat.service';
import { RoomService } from '../../core/services/room.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-friends-section',
  imports: [],
  templateUrl: './friends-section.html',
  styleUrl: './friends-section.css',
})
export class FriendsSection implements OnInit {
  private readonly friendshipService = inject(FriendshipService);
  private readonly chatService = inject(ChatService);
  private readonly roomService = inject(RoomService);

  friends = toSignal(this.friendshipService.friends$, { initialValue: [] });
  rooms = toSignal(this.roomService.rooms$, { initialValue: [] });

  ngOnInit(): void {
    this.friendshipService.getFriendsList();
  }

  onlineFriends = computed(() => this.friends().filter((friend) => friend.status?.isOnline));

  offlineFriends = computed(() => this.friends().filter((friend) => !friend.status?.isOnline));

  startChat(friendId: string) {
    const existingRoom = this.rooms().find((room) =>
      room.participants.some((p) => p.user.id === friendId)
    );

    if (existingRoom) {
      this.chatService.joinRoom(existingRoom.id);
    } else {
      this.roomService.createRoom(friendId);
    }
  }

  getLastActiveText(lastActive: Date | string | null | undefined): string {
    if (!lastActive) return 'Offline';

    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - lastActiveDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return 'Long time ago';
  }
}
