import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../shared/button/button';
import { UserService } from '../../core/services/user.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { FriendshipService } from '../../core/services/friendship.service';
import { FriendshipStatus } from '../../models/Friendship';

@Component({
  selector: 'app-search-friends',
  imports: [Button, FormsModule],
  templateUrl: './search-friends.html',
  styleUrl: './search-friends.css',
})
export class SearchFriends implements AfterViewInit {
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;
  private userService = inject(UserService);
  private friendshipService = inject(FriendshipService);
  private destroyRef = inject(DestroyRef);
  searchResults = toSignal(this.userService.searchResults$, { initialValue: [] });
  loading = toSignal(this.userService.loading$, { initialValue: false });
  searchQuery = '';
  closeShowFriends = output<boolean>();
  user = toSignal(this.userService.user$);

  ngAfterViewInit() {
    this.searchInputRef.nativeElement.focus();
    fromEvent(this.searchInputRef.nativeElement, 'input')
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const query = this.searchQuery.trim();
        if (query === '') {
          return;
        }
        this.userService.searchUsers(query);
      });
  }

  sendFriendRequest(friendId: string) {
    this.friendshipService.sendFriendRequest(friendId);

    // Update the user's status in the search results immediately
    this.userService.updateUserFriendshipStatus(friendId, FriendshipStatus.PENDING);
  }

  closeModal($event: Event) {
    this.closeShowFriends.emit(true);
  }
}
