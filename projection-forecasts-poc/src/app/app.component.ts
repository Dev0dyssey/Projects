import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as Papa from 'papaparse';
import OpenAI from 'openai';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'projection-forecasts-poc';
  openai = new OpenAI({
    apiKey: environment.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  completion: any;

  constructor(private http: HttpClient) {}

  @ViewChild('fileInput') fileInput!: ElementRef;

  createPromptFromData(data: any[]): string {
    return `Can you generate a predicted weather pattern based on the provided data: ${JSON.stringify(
      data
    )}`;
  }

  onFileUpload(event: any) {
    const file = this.fileInput.nativeElement.files[0];
    console.log('File Uploaded: ', file);
    this.processData(file);
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
      .post(
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
      .subscribe((response) => {
        console.log('API Response:', response);
      });
  }
}
