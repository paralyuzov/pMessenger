import { computed, inject, Injectable, signal } from '@angular/core';
import { Friendship } from '../../models/Friendship';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly apiService = inject(ApiService);
  private _friendRequests = signal<Friendship[]>([]);
  readonly friendRequests = this._friendRequests.asReadonly();
  private _unreadedMessages = signal<Record<string, number>>({});
  readonly unreadedMessages = this._unreadedMessages.asReadonly();
  private _friendResponse = signal<Friendship[]>([]);
  readonly friendResponse = this._friendResponse.asReadonly();

  notificationsCount = computed(() => this._friendRequests().length + this.friendResponse().length);

  receiveFriendRequest(friendship: Friendship) {
    this._friendRequests.update((requests) => [...requests, friendship]);
  }

  getPendingFriendRequests() {
    this.apiService.getPendingFriendRequests().subscribe({
      next: (requests) => {
        console.log('Fetched pending friend requests:', requests);
        this._friendRequests.set(requests);
      },
      error: (error) => {
        console.error('Error fetching pending friend requests:', error);
      },
    });
  }

  getFriendshipResponse(friendship: Friendship) {
    this._friendResponse.update((responses) => [...responses, friendship]);
  }

  removeFriendResponse(friendshipId: string) {
    this._friendResponse.update((responses) => responses.filter((res) => res.id !== friendshipId));
  }

  updateFriendRequest(friendshipId: string) {
    this._friendRequests.update((requests) => requests.filter((req) => req.id !== friendshipId));
  }

  clearNotifications() {
    this._friendRequests.set([]);
    this._friendResponse.set([]);
  }

  getUnreadMessagesCount() {
    this.apiService.getUnreadMessagesCount().subscribe({
      next: (counts) => {
        console.log('Fetched unread messages count:', counts);
        this._unreadedMessages.set(counts);
      },
      error: (error) => {
        console.error('Error fetching unread messages count:', error);
      },
    });
  }

  updateUnreadMessagesCount(roomId: string) {
    this._unreadedMessages.update((counts) => {
      counts[roomId] = (counts[roomId] || 0) + 1;
      return {
        ...counts,
        [roomId]: counts[roomId],
      };
    });
  }

  clearRoomUnreadMessages(roomId: string) {
    this._unreadedMessages.update((counts) => {
      if (counts[roomId]) {
        const updatedCounts = { ...counts };
        delete updatedCounts[roomId];
        return updatedCounts;
      }
      return counts;
    });
  }
  
}
