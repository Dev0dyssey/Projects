import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { reactPromptTemplate } from 'src/prompt-templates/promptTemplate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  standalone: true,
})
export class AppComponent {
  constructor(private readonly http: HttpClient) {}
  results: any;
  customPrompt: string = '';
  reactHistory: string = '';

  async askAgent(): Promise<any> {
    console.log('Asking agent...');

    if (!this.customPrompt.trim()) {
      console.log('No input provided. Calling chatQueryTool directly.');
      this.reactHistory += `
        Question: User provided no input.
        Thought: No specific question was asked.
        Action: chatQueryTool
        Action Input: N/A`;
      const response = await this.sendDataToAPI('');
      if (response) {
        const responseText = response.choices[0].message.content;
        this.results = responseText;
      }

      return; // Exit the function after handling the empty input
    }

    let conversationOver: boolean = false;
    let iterationCount: number = 0;
    const maxIterations: number = 10;

    while (!conversationOver && iterationCount < maxIterations) {
      iterationCount++;
      const response = await this.sendDataToAPI(this.customPrompt);
      if (response) {
        const responseText = response.choices[0].message.content;
        this.results = responseText;

        const actionMatch = responseText.match(/Action: (.*)/);
        const action = actionMatch ? actionMatch[1] : '';

        switch (action) {
          case 'chatQueryTool':
            console.log('Agent chose to use chatQueryTool');
            this.chatQueryTool();
            break;
          case 'Answer Directly':
            // Handle direct answer
            break;
          case 'characterRetrieval':
            console.log('Agent chose to use characterRetrieval');
            break;
          case 'logAnalysis':
            console.log('Agent chose to use logAnalysis');
            break;
          case 'searchQuery':
            console.log('Agent chose to use searchQuery');
            break;
          default:
            // Handle other actions or default behavior
            break;
        }

        if (responseText.includes('Final Answer')) {
          conversationOver = true;
        } else {
          this.customPrompt = '';
        }
      } else {
        console.error('No response from API');
        conversationOver = true;
      }
    }

    if (iterationCount >= maxIterations) {
      console.warn('Maximum iterations reached. Terminating conversation.');
      this.results += '\n(Conversation ended due to maximum turns limit)';
    }
  }

  chatQueryTool(): any {
    console.log('Chatting with the agent...');
  }

  clearResults() {
    this.results = null;
  }

  onCustomPropmptInput(event: any) {
    this.customPrompt = event.target.value;
  }

  async sendDataToAPI(promptInput: string): Promise<ApiResponse | null> {
    const prompt = reactPromptTemplate
      .replace('{question}', promptInput)
      .replace('{react_history}', this.reactHistory);

    try {
      const response = await this.http
        .post<ApiResponse>('/api/agent', {
          prompt,
          reactHistory: this.reactHistory,
        })
        .toPromise();

      if (!response) {
        console.error('API response is undefined');
        return null;
      }

      console.log('Response: ', response);
      console.log('API Response:', response.choices[0].message.content);

      // Update reactHistory with the new information
      const responseText = response.choices[0].message.content;
      this.reactHistory += `\n${responseText}`;
      console.log('Updated reactHistory:', this.reactHistory);

      return response;
    } catch (error) {
      console.error('Error calling API:', error);
      return null;
    }
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
