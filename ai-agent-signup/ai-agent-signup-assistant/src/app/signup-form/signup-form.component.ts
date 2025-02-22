import { Component, signal, effect } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, switchMap, tap } from 'rxjs'; // Import 'tap'

@Component({
  standalone: true,
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class SignupFormComponent {
  userMessage = signal('');
  private readonly submitSubject = new Subject<string>();

  private readonly message$ = this.submitSubject.pipe(
    switchMap((message) => {
      console.log('Sending message to API:', message); // Debug log
      return this.apiService.sendMessage(message).pipe(
        tap((response) => console.log('API Response:', response)), // Debug log: API response
        catchError((error) => {
          console.error(error);
          return of({
            message: 'Error: Could not communicate with the server',
          });
        })
      );
    })
  );

  messageSignal = toSignal(this.message$, { initialValue: { message: '' } });

  constructor(private apiService: ApiService) {
    effect(() => {
      console.log('Current Message Signal', this.messageSignal());
    });
  }

  onSubmit() {
    console.log('onSubmit called, userMessage:', this.userMessage()); // Debug log
    this.submitSubject.next(this.userMessage());
  }
}
