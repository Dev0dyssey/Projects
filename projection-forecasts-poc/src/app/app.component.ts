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
  uploadEnabled: boolean | null = false;
  results: any;
  customPrompt: string = '';
  base64Image: string = '';
  parsedCsvData: any;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = this.fileInput.nativeElement.files[0];
    this.uploadEnabled = input.files && input.files.length > 0;
    this.processData(file);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const image = this.imageInput.nativeElement.files[0];
    this.uploadEnabled = input.files && input.files.length > 0;
    this.encodeImageToBase64(image);
  }

  processData(csvData: string) {
    Papa.parse(csvData, {
      header: true,
      complete: (result) => {
        console.log('Parsed Data:', result.data);
        this.parsedCsvData = result.data;
      },
    });
  }

  encodeImageToBase64(image: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.base64Image = base64String;
    };
    reader.readAsDataURL(image);
  }

  onFileUpload(event: any) {
    this.sendDataToAPI(this.parsedCsvData, this.base64Image);
  }

  onCustomPropmptInput(event: any) {
    this.customPrompt = event.target.value;
  }

  sendDataToAPI(file: any, base64Image: string) {
    const prompt =
      this.customPrompt ||
      'Analyse the attached image and make predictions of future behaviour, as well as weekly pattern';

    this.http
      .post<ApiResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
                {
                  type: 'text',
                  text: `Can you generate a predicted weather pattern based on the provided data: ${JSON.stringify(
                    file
                  )} splitting each section with a new line character. Return the data but do not mention the new line character. Also strip out {} symbols and align the response by date under one another `,
                },
              ],
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
