import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../../models/Rooms';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message } from '../../models/Message';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly apiService = inject(ApiService);
  private readonly socketService = inject(SocketService);
  private readonly destroyRef = inject(DestroyRef);
  private rooms$$ = new BehaviorSubject<Room[]>([]);
  rooms$ = this.rooms$$.asObservable();
  private loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable();
  private error$$ = new BehaviorSubject<string | null>(null);
  error$ = this.error$$.asObservable();

  constructor() {
    this.socketService.userOnline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((userId) => {
        this.updateUserStatus(userId, true);
      });

    this.socketService.userOffline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((userId) => {
        this.updateUserStatus(userId, false);
      });

    this.socketService.receivedMessage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        this.updateRoomLastMessage(message);
      });
  }

  getRooms() {
    this.loading$$.next(true);
    this.apiService.getRooms().subscribe({
      next: (rooms) => {
        console.log('Fetched rooms:', rooms);
        this.rooms$$.next(rooms);
        this.loading$$.next(false);
      },
      error: (error) => {
        this.error$$.next(error);
        this.loading$$.next(false);
      },
    });
  }

  createRoom(friendId: string) {
    return this.apiService.createRoom(friendId).subscribe({
      next: (room) => {
        console.log('Created room:', room);
        this.getRooms();
      },
      error: (error) => {
        console.error('Error creating room:', error);
      },
    });
  }

  updateUserStatus(userId: string, isOnline: boolean) {
    const currentRooms = this.rooms$$.value;
    const updatedRooms = currentRooms.map(room => {
      const updatedParticipants = room.participants.map(participant => {
        if (participant.user?.id === userId) {
          return {
            ...participant,
            user: {
              ...participant.user,
              status: {
                ...participant.user.status!,
                isOnline: isOnline,
                lastActive: isOnline ? null : new Date().toISOString()
              }
            }
          };
        }
        return participant;
      });
      return {
        ...room,
        participants: updatedParticipants
      };
    });
    this.rooms$$.next(updatedRooms);
  }

  updateRoomLastMessage(message: Message) {
    const currentRooms = this.rooms$$.value;
    const updatedRooms = currentRooms.map(room => {
      if (room.id === message.roomId) {
        return {
          ...room,
          lastMessage: message,
          lastActivity: message.createdAt
        };
      }
      return room;
    });
    // Sort rooms by last activity (most recent first)
    updatedRooms.sort((a, b) => {
      const dateA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const dateB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      return dateB - dateA;
    });
    this.rooms$$.next(updatedRooms);
  }
}
