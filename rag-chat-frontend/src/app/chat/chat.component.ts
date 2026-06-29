import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  question = '';

  messages: Message[] = [];
  apiService = inject(ApiService);

  chatWithModel() {
    this.messages.push({
      type: 'user',
      text: this.question,
      time: new Date(),
    });
    this.apiService.getChatResult(this.question).subscribe({
      next: (response) => {
        console.log(response);
        this.messages.push({
          type: 'bot',
          text: response.answer,
          time: new Date(),
        });
      },
      error: (error) => {
        console.error('Backend Error:', error);
      },
    });
  }

  sendMessage() {
    if (this.question != null) {
      this.chatWithModel();
    }
  }
}

export interface Message {
  type: string;
  text: string;
  time: Date;
}
