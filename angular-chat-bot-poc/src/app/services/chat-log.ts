import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatHistory: { sender: string, message: string }[] = [];

  constructor() { }

  addMessage(sender: string, message: any) {
    this.chatHistory.push({ sender, message });
    console.log("Chat History: ", this.chatHistory);
  }

  getChatHistory() {
    return this.chatHistory;
  }
}