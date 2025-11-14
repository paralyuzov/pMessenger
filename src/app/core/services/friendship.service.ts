import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/User';
import { Friendship } from '../../models/Friendship';
import { SocketService } from './socket.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  private readonly apiService = inject(ApiService);
  private readonly socketService = inject(SocketService);
  private readonly notificationService = inject(NotificationsService);
  private readonly destroyRef = inject(DestroyRef);
  private friends$$ = new BehaviorSubject<User[]>([]);
  friends$ = this.friends$$.asObservable();
  private loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable();
  private error$$ = new BehaviorSubject<string | null>(null);
  error$ = this.error$$.asObservable();

  constructor() {
    this.socketService.friendRequestAccepted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this.notificationService.getFriendshipResponse(payload);

        const newFriend = payload.recipient;
        if (newFriend) {
          this.addFriendToList(newFriend);
        }

        console.log('Friend request accepted:', payload);
      });

    this.socketService.friendRequestRejected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this.notificationService.getFriendshipResponse(payload);
        console.log('Friend request rejected:', payload);
      });

    // Handle user online status
    this.socketService.userOnline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((userId) => {
        this.updateFriendStatus(userId, true);
      });

    // Handle user offline status
    this.socketService.userOffline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((userId) => {
        this.updateFriendStatus(userId, false);
      });
  }

  getFriendsList() {
    this.loading$$.next(true);
    this.apiService.getFriendsList().subscribe({
      next: (friends) => {
        this.friends$$.next(friends);
        this.loading$$.next(false);
      },
      error: () => {
        this.friends$$.next([]);
        this.loading$$.next(false);
      },
    });
  }

  addFriendToList(friend: User) {
    const currentFriends = this.friends$$.value;
    if (!currentFriends.find((f) => f.id === friend.id)) {
      this.friends$$.next([...currentFriends, friend]);
    }
  }

  sendFriendRequest(friendId: string) {
    let friendShipResponse: Friendship;
    this.apiService.sendFriendRequest(friendId).subscribe({
      next: (friendship) => {
        friendShipResponse = friendship;
      },
      error: (error) => {
        console.error('Error sending friend request:', error);
      },
      complete: () => {
        this.socketService.sendFriendRequest(friendShipResponse.id);
      },
    });
  }

  acceptFriendRequest(friendshipId: string) {
    this.apiService.acceptFriendRequest(friendshipId).subscribe({
      next: () => {
        this.getFriendsList();
      },
      error: (error) => {
        console.error('Error accepting friend request:', error);
      },
      complete: () => {
        this.socketService.acceptFriendRequest(friendshipId);
      },
    });
  }

  rejectFriendRequest(friendshipId: string) {
    this.apiService.rejectFriendRequest(friendshipId).subscribe({
      next: () => {
        this.getFriendsList();
      },
      error: (error) => {
        console.error('Error rejecting friend request:', error);
      },
      complete: () => {
        this.socketService.rejectFriendRequest(friendshipId);
      },
    });
  }

  updateFriendStatus(userId: string, isOnline: boolean) {
    const currentFriends = this.friends$$.value;
    const updatedFriends = currentFriends.map(friend => {
      if (friend.id === userId) {
        return {
          ...friend,
          status: {
            ...friend.status!,
            isOnline: isOnline,
            lastActive: isOnline ? null : new Date().toISOString()
          }
        };
      }
      return friend;
    });
    this.friends$$.next(updatedFriends);
  }
}
