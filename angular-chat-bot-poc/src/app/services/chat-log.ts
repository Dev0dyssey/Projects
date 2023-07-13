import { Injectable } from '@angular/core';
import { Message } from '../interfaces/message.interface';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatHistory: { message: Message }[] = [];

  constructor() { }

  addMessage( message: Message) {
    this.chatHistory.push({ message });
  }

  getChatHistory() {
    return this.chatHistory;
  }
}