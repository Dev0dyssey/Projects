import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private chatService: ChatService) { }
  history: any;

  ngOnInit(): void {
    this.history = this.chatService.getChatHistory();
    console.log("Chat History: ", this.history);
  }

  title = 'angular-chat-bot-poc';
}
