import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
    MatProgressBarModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLDivElement>;
  private pendingScroll = false;

  question = '';
  isAwaitingResponse = false;

  messages: Message[] = [];
  apiService = inject(ApiService);

  chatWithModel() {
    const question = this.question.trim();

    this.messages.push({
      type: 'user',
      text: question,
      time: new Date(),
    });
    this.question = '';
    this.isAwaitingResponse = true;
    this.pendingScroll = true;

    this.apiService.getChatResult(question).subscribe({
      next: (response) => {
        console.log(response);
        this.isAwaitingResponse = false;
        this.messages.push({
          type: 'bot',
          text: response.answer,
          time: new Date(),
        });
        this.pendingScroll = true;
      },
      error: (error) => {
        console.error('Backend Error:', error);
        this.isAwaitingResponse = false;
      },
    });
  }

  sendMessage() {
    if (this.question?.trim()) {
      this.chatWithModel();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.pendingScroll) {
      return;
    }

    const container = this.chatBody?.nativeElement;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
    this.pendingScroll = false;
  }
}

export interface Message {
  type: string;
  text: string;
  time: Date;
}
