import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'projection-forecasts-poc';

  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('/api/upload', formData).subscribe({
      next: (response) => {
        // Handle success response
        console.log('File uploaded successfully');
      },
      error: (error) => {
        // Handle error response
        console.error('Error uploading file:', error);
      },
    });
  }
}
