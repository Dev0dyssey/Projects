import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})



export class ChatInterfaceComponent {
  submitQuery() {
    console.log(this.askGuy.value);
  }

  askGuy = new FormControl('');
}
