import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Notifications } from "../user/notifications/notifications";
import { NotificationsService } from '../core/services/notifications.service';
import { SearchFriends } from "../user/search-friends/search-friends";

@Component({
  selector: 'app-nav',
  imports: [Notifications, SearchFriends],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationsService);
  notificationCount = this.notificationService.notificationsCount
  user = toSignal(this.userService.user$);
  toggleNotifications = signal(false);
  toggleSearchFriends = signal(false);

  ngOnInit() {
    this.notificationService.getPendingFriendRequests();
  }

  showNotifications() {
    this.toggleNotifications.set(!this.toggleNotifications());
  }

  searchFriends() {
    this.toggleSearchFriends.set(true);
  }

  handleCloseSearchFriends() {
    this.toggleSearchFriends.set(false);
  }

  handleCloseNotifications() {
    this.toggleNotifications.set(false);
  }


}
