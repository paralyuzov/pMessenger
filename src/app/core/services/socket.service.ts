import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from '../../models/Message';
import { Friendship } from '../../models/Friendship';
import { User } from '../../models/User';

interface SocketEvents {
  connected: string;
  joinedRoom: string;
  messagesLoaded: Message[];
  olderMessagesLoaded: Message[];
  receivedMessage: Message;
  newFriendRequest: Friendship;
  friendRequestAccepted: Friendship;
  friendRequestRejected: Friendship;
  newMessageNotification: { roomId: string };
  friendJoinedRoom: { roomId: string };
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  private connected$$ = new Subject<string>();
  private joinedRoom$$ = new Subject<string>();
  private messagesLoaded$$ = new Subject<Message[]>();
  private olderMessagesLoaded$$ = new Subject<Message[]>();
  private receivedMessage$$ = new Subject<Message>();
  private newFriendRequest$$ = new Subject<Friendship>();
  private friendRequestAccepted$$ = new Subject<Friendship>();
  private friendRequestRejected$$ = new Subject<Friendship>();
  private newMessageNotification$$ = new Subject<{ roomId: string }>();
  private friendJoinedRoom$$ = new Subject<{ roomId: string }>();
  private friendTyping$$ = new BehaviorSubject<User | null>(null);
  private userOnline$$ = new Subject<string>();
  private userOffline$$ = new Subject<string>();

  readonly connected$ = this.connected$$.asObservable();
  readonly joinedRoom$ = this.joinedRoom$$.asObservable();
  readonly messagesLoaded$ = this.messagesLoaded$$.asObservable();
  readonly olderMessagesLoaded$ = this.olderMessagesLoaded$$.asObservable();
  readonly receivedMessage$ = this.receivedMessage$$.asObservable();
  readonly newFriendRequest$ = this.newFriendRequest$$.asObservable();
  readonly friendRequestAccepted$ = this.friendRequestAccepted$$.asObservable();
  readonly friendRequestRejected$ = this.friendRequestRejected$$.asObservable();
  readonly newMessageNotification$ = this.newMessageNotification$$.asObservable();
  readonly friendJoinedRoom$ = this.friendJoinedRoom$$.asObservable();
  readonly friendTyping$ = this.friendTyping$$.asObservable();
  readonly userOnline$ = this.userOnline$$.asObservable();
  readonly userOffline$ = this.userOffline$$.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('accessToken') || '',
      },
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connected', (message) => this.connected$$.next(message));
    this.socket.on('joinedRoom', (room) => this.joinedRoom$$.next(room));
    this.socket.on('messagesLoaded', (payload) => this.messagesLoaded$$.next(payload));
    this.socket.on('olderMessagesLoaded', (payload) => this.olderMessagesLoaded$$.next(payload));
    this.socket.on('receivedMessage', (payload) => this.receivedMessage$$.next(payload));
    this.socket.on('newFriendRequest', (payload) => this.newFriendRequest$$.next(payload));
    this.socket.on('friendRequestAccepted', (payload) =>
      this.friendRequestAccepted$$.next(payload)
    );
    this.socket.on('friendRequestRejected', (payload) =>
      this.friendRequestRejected$$.next(payload)
    );
    this.socket.on('newMessageNotification', (payload) =>
      this.newMessageNotification$$.next(payload)
    );
    this.socket.on('friendJoinedRoom', (payload) => this.friendJoinedRoom$$.next(payload));
    this.socket.on('userIsTyping', (friend: User) => {

      this.friendTyping$$.next(friend);
      setTimeout(() => {
        if (this.friendTyping$$.value?.id === friend.id) {
          this.friendTyping$$.next(null);
        }
      }, 5000);
    });

    this.socket.on('userOnline', (userId: string) => {
      console.log('User came online:', userId);
      this.userOnline$$.next(userId);
    });

    this.socket.on('userOffline', (userId: string) => {
      console.log('User went offline:', userId);
      this.userOffline$$.next(userId);
    });
  }

  emit<T = unknown>(event: string, data?: T): void {
    this.socket.emit(event, data);
  }

  joinRoom(room: string) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: string) {
    this.socket.emit('leaveRoom', room);
  }

  loadMessages(room: string) {
    this.socket.emit('loadMessages', room);
  }

  sendMessage(data: { room: string; type: string; content: string }) {
    this.socket.emit('sendMessage', data);
  }

  loadOlderMessages(data: { room: string; oldestMessageId: string }) {
    this.socket.emit('loadOlderMessages', data);
  }

  markMessagesAsRead(message: Message) {
    this.socket.emit('markMessagesAsRead', message);
  }

  sendFriendRequest(friendshipId: string) {
    this.socket.emit('sendFriendRequest', friendshipId);
  }

  acceptFriendRequest(friendshipId: string) {
    this.socket.emit('acceptFriendRequest', friendshipId);
  }

  rejectFriendRequest(friendshipId: string) {
    this.socket.emit('rejectFriendRequest', friendshipId);
  }

  userTyping(roomId: string) {
    console.log('Emitting userTyping for room:', roomId);
    this.socket.emit('userTyping', roomId);
  }
}
