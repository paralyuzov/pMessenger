import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { Button } from '../../shared/button/button';
import { ChatService } from '../../core/services/chat.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { RoomService } from '../../core/services/room.service';
import { FormsModule } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import { debounceTime, fromEvent } from 'rxjs';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { GifPicker } from '../../shared/gif-picker/gif-picker';
import { Gif } from '../../models/Gif';

@Component({
  selector: 'app-chat-messages',
  imports: [Button, DatePipe, FormsModule, ProgressSpinner, PickerComponent, GifPicker],
  templateUrl: './chat-messages.html',
  styleUrl: './chat-messages.css',
})
export class ChatMessages implements AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') private messageInput!: ElementRef<HTMLInputElement>;
  private chatService = inject(ChatService);
  private userService = inject(UserService);
  private roomService = inject(RoomService);
  private destroyRef = inject(DestroyRef);
  activeRoom = toSignal(this.chatService.activeRoom$);
  messages = this.chatService.bufferMessages;
  user = toSignal(this.userService.user$);
  rooms = toSignal(this.roomService.rooms$);
  messageContent: string = '';
  loading = toSignal(this.chatService.loading$);
  preventAutoScroll = signal(false);
  isFriendJoinedRoom = this.chatService.isFriendJoinedRoom;
  showPicker = signal(false);
  showGifPicker = signal(false);

  goBackToChats() {
    this.chatService.activeRoom$$.next(null);
  }

  friendTyping = computed(() => {
    const typingUser = this.chatService.friendTyping();
    const currentUserId = this.user()?.id;
    if(typingUser && typingUser.id !== currentUserId) {
      return typingUser;
    }
    return null;
  })

  friendInfo = computed(() => {
    const currentRoomId = this.activeRoom();
    const allRooms = this.rooms();
    const currentUserId = this.user()?.id;

    if (!currentRoomId || !allRooms || !currentUserId) {
      return null;
    }

    const room = allRooms.find(r => r.id === currentRoomId);
    if (!room) {
      return null;
    }

    const friendParticipant = room.participants.find(p => p.user?.id !== currentUserId);
    return friendParticipant?.user || null;
  })


  constructor() {
    effect(() => {
      const roomId = this.activeRoom();
      if (roomId) {
        this.chatService.loadMessages();
        this.preventAutoScroll.set(false);
        setTimeout(() => {
          if (this.messageInput?.nativeElement) {
            this.messageInput.nativeElement.focus();
          }
        }, 100);
      }
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.messagesContainer.nativeElement, 'scroll')
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const element = this.messagesContainer.nativeElement;
        if (element.scrollTop < 10 && this.chatService.hasMore()) {
          this.preventAutoScroll.set(true);
          this.chatService.loadOlderMessages();
          element.scrollTop = 400;
        }
        if (Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 20) {
          this.preventAutoScroll.set(false);
        }
      });

      fromEvent(this.messageInput.nativeElement, 'input').pipe(
        debounceTime(300), takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
       this.chatService.userTyping();
      });

      fromEvent(this.messageInput.nativeElement, 'focus').pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 300); 
      });
  }

  private scrollEffect = effect(() => {
    if (this.preventAutoScroll()) {
      return;
    }
    if (this.messages().length > 0) {
      this.scrollToBottom();
    }
    this.friendTyping();
  });

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 200);
  }

  sendMessage() {
    if (this.messageContent.trim() === '') {
      return;
    }
    this.chatService.sendMessage(this.messageContent);
    this.preventAutoScroll.set(false);
    this.messageContent = '';
  }

  togglePicker() {
    this.showPicker.set(!this.showPicker());
  }
  addEmoji(event: EmojiEvent) {
    this.messageContent += event.emoji.native;
    this.showPicker.set(false);
  }
  toggleGif() {
    this.showGifPicker.set(!this.showGifPicker());
  }

  handleSelectedGif(gif: Gif) {
    this.chatService.sendMessage(gif.images.original.url, 'IMAGE');
    this.showGifPicker.set(false);
  }
}
