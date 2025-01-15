import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { reactPromptTemplate } from 'src/prompt-templates/promptTemplate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule],
  standalone: true,
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  results: any;
  customPrompt: string = '';

  askAgent(): any {
    console.log('Asking agent...');
    this.sendDataToAPI();
  }

  chatQueryTool(): any {
    console.log('Chatting with the agent...');
    this.sendDataToAPI('Hello, how are you? Please respond with a greeting.');
  }

  clearResults() {
    this.results = null;
  }

  onCustomPropmptInput(event: any) {
    this.customPrompt = event.target.value;
  }

  sendDataToAPI(promptInput?: string): any {
    const prompt = reactPromptTemplate;

    this.http
      .post<ApiResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: prompt }],
            },
          ],
          model: 'gpt-4o',
        },
        {
          headers: {
            Authorization: `Bearer ${environment.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe((response: ApiResponse) => {
        console.log('Response: ', response);
        console.log('API Image Response:', response.choices[0].message.content);
        this.results = response.choices[0].message.content;
      });
  }
}

interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint: string;
}
