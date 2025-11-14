import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/Message';
import { NotificationsService } from './notifications.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socketService = inject(SocketService);
  private notificationService = inject(NotificationsService);
  private destroyRef = inject(DestroyRef);
  hasMore = signal(true);

  activeRoom$$ = new BehaviorSubject<string | null>(null);
  activeRoom$ = this.activeRoom$$.asObservable();
  private lastMessage$$ = new BehaviorSubject<Message | null>(null);
  lastMessage$ = this.lastMessage$$.asObservable();
  private loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable();
  bufferMessages = signal<Message[]>([]);
  private _isFriendJoinedRoom = signal<boolean>(false);
  readonly isFriendJoinedRoom = this._isFriendJoinedRoom.asReadonly();

  friendTyping = toSignal(this.socketService.friendTyping$, { initialValue: null });

  constructor() {
    this.socketService.connected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
      console.log('START', message);
    });

    this.socketService.joinedRoom$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadMessages();
    });

    this.socketService.messagesLoaded$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this.hasMoreMessages(payload);
        this.lastMessage$$.next(payload[payload.length - 1] || null);
        this.bufferMessages.set(payload);
        this.loading$$.next(false);
      });

    this.socketService.olderMessagesLoaded$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this.hasMoreMessages(payload);
        this.bufferMessages.update((msgs) => [...payload, ...msgs]);
        this.loading$$.next(false);
      });

    this.socketService.receivedMessage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (payload.roomId !== this.activeRoom$$.getValue()) {
          return;
        }
        this.hasMore.set(true);
        this.lastMessage$$.next(payload);
        this.bufferMessages.update(() => {
          if (this.bufferMessages().length >= 20) {
            return [...this.bufferMessages().slice(1), payload];
          } else {
            return [...this.bufferMessages(), payload];
          }
        });
        this.socketService.markMessagesAsRead(payload);
      });

    this.socketService.newFriendRequest$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this.notificationService.receiveFriendRequest(payload);
      });

    this.socketService.newMessageNotification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (payload.roomId === this.activeRoom$$.getValue()) {
          console.log(payload.roomId, this.activeRoom$$.getValue());
          return;
        }
        this.notificationService.updateUnreadMessagesCount(payload.roomId);
      });

    this.socketService.friendJoinedRoom$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this._isFriendJoinedRoom.set(true);
      });
  }

  joinRoom(room: string) {
    if (this.activeRoom$$.getValue() !== null && this.activeRoom$$.getValue() === room) {
      this.socketService.leaveRoom(room);
    }
    this.activeRoom$$.next(room);
    this.bufferMessages.set([]);
    this.hasMore.set(true);
    this.loading$$.next(false);
    this.socketService.joinRoom(room);
    this.notificationService.clearRoomUnreadMessages(room);
  }

  loadMessages() {
    this.loading$$.next(true);
    this.socketService.loadMessages(this.activeRoom$$.getValue()!);
  }

  sendMessage(message: string, type = 'TEXT') {
    console.log('Sending message:', message, 'of type:', type);
    this.socketService.sendMessage({
      room: this.activeRoom$$.getValue()!,
      type: type,
      content: message,
    });
  }

  loadOlderMessages() {
    if (!this.hasMore() || this.bufferMessages().length < 20) {
      return;
    }
    const olderMessage = this.bufferMessages()[0];
    this.loading$$.next(true);
    this.socketService.loadOlderMessages({
      room: this.activeRoom$$.getValue()!,
      oldestMessageId: olderMessage.id,
    });
    console.log(
      'Loading older messages before ID:',
      olderMessage.id,
      'for room:',
      this.activeRoom$$.getValue()
    );
  }

  userTyping() {
    if (this.activeRoom$$.getValue() === null) {
      return;
    }
    this.socketService.userTyping(this.activeRoom$$.getValue()!);
  }

  private hasMoreMessages(messages: Message[]): void {
    if (messages.length < 20) {
      this.hasMore.set(false);
    } else {
      this.hasMore.set(true);
    }
  }
}
