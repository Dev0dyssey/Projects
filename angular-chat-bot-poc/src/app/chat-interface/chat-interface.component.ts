import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../services/chat-log';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})



export class ChatInterfaceComponent {
  constructor(private chatService: ChatService) { }

  submitQuery() {
    console.log(this.askGuy.value);
    this.chatService.addMessage('user', this.askGuy.value);
  }

  askGuy = new FormControl('');
}
