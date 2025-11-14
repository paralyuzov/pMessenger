import { Component, inject, output } from '@angular/core';
import { Button } from '../../shared/button/button';
import { NotificationsService } from '../../core/services/notifications.service';
import { FriendshipService } from '../../core/services/friendship.service';

@Component({
  selector: 'app-notifications',
  imports: [Button],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  private readonly notificationService = inject(NotificationsService);
  private readonly friendshipService = inject(FriendshipService);
  friendRequest = this.notificationService.friendRequests;
  friendResponse = this.notificationService.friendResponse;

  closeDropdown = output<void>();

  acceptFriendRequest(requestId: string) {
    this.friendshipService.acceptFriendRequest(requestId);
    this.notificationService.updateFriendRequest(requestId);
  }

  rejectFriendRequest(requestId: string) {
    this.friendshipService.rejectFriendRequest(requestId);
    this.notificationService.updateFriendRequest(requestId);
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
  }

  dismissFriendResponse(responseId: string) {
    this.notificationService.removeFriendResponse(responseId);
  }

  closeNotifications() {
    this.closeDropdown.emit();
  }
}
