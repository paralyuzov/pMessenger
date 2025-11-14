import { Component, effect, inject, signal } from '@angular/core';
import { ChatsSection } from "../../chat/chats-section/chats-section";
import { ChatMessages } from "../../chat/chat-messages/chat-messages";
import { Nav } from "../../nav/nav";
import { FriendsSection } from "../../friends/friends-section/friends-section";
import { ChatService } from '../../core/services/chat.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main',
  imports: [ChatsSection, ChatMessages, Nav, FriendsSection],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  private readonly chatService = inject(ChatService);
  activeRoom = toSignal(this.chatService.activeRoom$);
  mobileView = signal<'chats' | 'messages' | 'friends'>('chats');

  constructor() {
    effect(() => {
      const room = this.activeRoom();
      if (room) {
        this.mobileView.set('messages');
      } else if (!room && this.mobileView() === 'messages') {
        this.mobileView.set('chats');
      }
    });
  }

  setMobileView(view: 'chats' | 'messages' | 'friends') {
    this.mobileView.set(view);
  }
}
