import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse, UserSearchResult } from '../../models/User';
import { Room } from '../../models/Rooms';
import { Friendship } from '../../models/Friendship';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private BASE_URL = environment.BASE_URL;

  login(email: string, password: string) {
    return this.http.post<UserResponse>(`${this.BASE_URL}/auth/login`, { email, password });
  }

  register(
    name: string,
    email: string,
    avatar: string,
    password: string,
    confirmPassword: string
  ) {
    console.log('Registering user with data:', {
      name,
      email,
      avatar,
      password,
      confirmPassword,
    });
    return this.http.post<{ message: string }>(`${this.BASE_URL}/auth/register`, {
      name,
      email,
      avatar,
      password,
      confirmPassword,
    });
  }

  getUserProfile() {
    return this.http.get<User>(`${this.BASE_URL}/auth/me`);
  }

  getFriendsList() {
    return this.http.get<User[]>(`${this.BASE_URL}/friendship/friends`);
  }

  createRoom(participantId: string) {
    return this.http.post<Room>(`${this.BASE_URL}/rooms/create-room`, { participantId });
  }

  getRooms() {
    return this.http.get<Room[]>(`${this.BASE_URL}/rooms/my-rooms`);
  }

  searchUsers(query: string) {
    return this.http.get<UserSearchResult[]>(`${this.BASE_URL}/user/search`, {
      params: { name: query },
    });
  }

  sendFriendRequest(recipientId: string) {
    return this.http.post<Friendship>(`${this.BASE_URL}/friendship/send-request`, { recipientId });
  }

  acceptFriendRequest(friendshipId: string) {
    return this.http.post<Friendship>(`${this.BASE_URL}/friendship/accept-request`, { friendshipId });
  }

  rejectFriendRequest(friendshipId: string) {
    return this.http.post<Friendship>(`${this.BASE_URL}/friendship/reject-request`, { friendshipId });
  }

  getPendingFriendRequests() {
    return this.http.get<Friendship[]>(`${this.BASE_URL}/friendship/pending-requests`);
  }

  getUnreadMessagesCount() {
    return this.http.get<Record<string, number>>(`${this.BASE_URL}/messages/unread-messages`);
  }
}
