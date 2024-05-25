import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import OpenAI from 'openai';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'projection-forecasts-poc';
  openai = new OpenAI({});
  completion: any;
  completionSubscription: any;

  constructor() {}

  ngOnInit(): void {
    const completion$ = from(
      this.openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
        model: 'gpt-3.5-turbo',
      })
    );

    this.completionSubscription = completion$.subscribe((completion) => {
      this.completion = completion;
      console.log(this.completion.choices[0]);
    });
  }

  ngOnDestroy(): void {
    this.completionSubscription.unsubscribe();
  }
}
