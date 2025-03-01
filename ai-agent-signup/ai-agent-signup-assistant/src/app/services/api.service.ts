import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  sendMessage(message: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/echo`, { message });
  }

  checkCompanyExists(
    companyName: string
  ): Observable<{ exists: boolean; company?: any }> {
    return this.http.get<{ exists: boolean; company?: any }>(
      `${this.apiUrl}/check-company/${companyName}`
    );
  }
}
