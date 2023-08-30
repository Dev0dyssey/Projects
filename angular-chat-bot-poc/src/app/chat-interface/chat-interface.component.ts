import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../services/chat-log';
import { Message } from '../interfaces/message.interface';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})



export class ChatInterfaceComponent {
  constructor(private chatService: ChatService) { }

  submitQuery() {
    const message: Message = { 
      sender: 'UserA',
      message: this.askGuy.value ? this.askGuy.value : 'No message',
      timestamp: new Date()
    };
    this.chatService.addMessage(message);
    this.askGuy.reset();
  }

  answerQuery() {
    const message: Message = { 
      sender: 'UserB',
      message: 'This is a response',
      timestamp: new Date()
    };
    this.chatService.addMessage(message);
    this.askGuy.reset();
  }

  askGuy = new FormControl('');
}
