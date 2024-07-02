import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  results: any;
  customPrompt: string = '';

  createPromptFromData(data: any[]): string {
    if (this.customPrompt) {
      return `${this.customPrompt} for the provided data: ${JSON.stringify(
        data
      )}`;
    }
    return `Can you generate a predicted weather pattern based on the provided data: ${JSON.stringify(
      data
    )} splitting each section with a new line character. Return the data but do not mention the new line character. Also strip out {} symbols and align the response by date under one another `;
  }

  onFileUpload(event: any) {
    const file = this.fileInput.nativeElement.files[0];
    const image = this.imageInput.nativeElement.files[0];
    if (image) {
      console.log('Image:', image);
    } else if (file) {
      console.log('File:', file);
    }
    this.processData(file);
  }

  onCustomPropmptInput(event: any) {
    this.customPrompt = event.target.value;
    console.log('Custom Prompt: ', this.customPrompt);
  }

  processData(csvData: string) {
    Papa.parse(csvData, {
      header: true,
      complete: (result) => {
        console.log('Parsed Data:', result.data);
        this.sendDataToAPI(result.data);
      },
    });
  }

  sendDataToAPI(data: any[]) {
    const prompt = this.createPromptFromData(data);

    this.http
      .post<ApiResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [{ role: 'system', content: prompt }],
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
        console.log('API Response:', response.choices[0].message.content);
        this.results = response.choices[0].message.content
          .replace(/date:/g, 'date:')
          .split('date:');
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
