import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserSearchResult } from '../../models/User';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { FriendshipStatus } from '../../models/Friendship';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private router = inject(Router);
  private user$$ = new BehaviorSubject<User | null>(null);
  user$ = this.user$$.asObservable();
  private loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable();
  private error$$ = new BehaviorSubject<string | null>(null);
  error$ = this.error$$.asObservable();

  private searchResults$$ = new BehaviorSubject<UserSearchResult[]>([]);
  searchResults$ = this.searchResults$$.asObservable();

  private readonly apiService = inject(ApiService);

  login(email: string, password: string) {
    this.loading$$.next(true);
    this.apiService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        localStorage.setItem('accessToken', response.accessToken);
        this.user$$.next(response.user);
        this.loading$$.next(false);
      },
      error: (err) => {
        this.error$$.next(err);
        this.loading$$.next(false);
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    });
  }

  register(
    username: string,
    email: string,
    avatar: string,
    password: string,
    confirmPassword: string
  ) {
    this.loading$$.next(true);
    this.apiService.register(username, email, avatar, password, confirmPassword).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        this.loading$$.next(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error$$.next(err);
        this.loading$$.next(false);
      },
    });
  }

  getProfile() {
    this.loading$$.next(true);
    this.apiService.getUserProfile().subscribe({
      next: (user) => {
        console.log('User profile:', user);
        this.user$$.next(user);
        this.loading$$.next(false);
      },
      error: (err) => {
        console.log('Error fetching profile:', err);
        this.error$$.next(err);
        this.loading$$.next(false);
        this.router.navigate(['/login']);
      },
    });
  }

  searchUsers(query: string) {
    this.loading$$.next(true);
    this.apiService.searchUsers(query).subscribe({
      next: (users) => {
        console.log('Search results:', users);
        this.searchResults$$.next(users);
        this.loading$$.next(false);
      },
      error: (err) => {
        this.error$$.next(err);
        this.loading$$.next(false);
      },
    });
  }

  updateUserFriendshipStatus(userId: string, status: FriendshipStatus) {
    const currentResults = this.searchResults$$.value;
    const updatedResults = currentResults.map(user =>
      user.id === userId ? { ...user, friendshipStatus: status } : user
    );
    this.searchResults$$.next(updatedResults);
  }
}
