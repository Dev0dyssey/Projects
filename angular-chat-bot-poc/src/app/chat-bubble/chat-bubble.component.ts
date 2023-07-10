import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../interfaces/message.interface';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() message: any;

}
