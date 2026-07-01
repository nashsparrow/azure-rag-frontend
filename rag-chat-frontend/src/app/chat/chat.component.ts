import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements AfterViewChecked {
  readonly minQuestionLength = 10;
  readonly maxQuestionLength = 500;

  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLDivElement>;
  private pendingScroll = false;

  question = '';
  isAwaitingResponse = false;

  messages: Message[] = [];
  apiService = inject(ApiService);
  snackBar = inject(MatSnackBar);

  get trimmedQuestionLength(): number {
    return this.question.trim().length;
  }

  get isQuestionTooShort(): boolean {
    return (
      this.question.length > 0 &&
      this.trimmedQuestionLength < this.minQuestionLength
    );
  }

  get isQuestionTooLong(): boolean {
    return this.question.length > this.maxQuestionLength;
  }

  get canSendMessage(): boolean {
    return (
      !this.isAwaitingResponse &&
      this.trimmedQuestionLength >= this.minQuestionLength &&
      this.question.length <= this.maxQuestionLength
    );
  }

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
        this.isAwaitingResponse = false;
        this.messages.push({
          type: 'bot',
          text: response.answer,
          time: new Date(),
        });
        this.pendingScroll = true;
      },
      error: (error) => {
        const errorMessage =
          error.error.message ?? 'Unable to get a response right now.';
        console.error('Backend Error:', errorMessage);
        this.messages.push({
          type: 'system',
          text: errorMessage,
          time: new Date(),
        });
        this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['app-snackbar-error'],
        });
        this.isAwaitingResponse = false;
        this.pendingScroll = true;
      },
    });
  }

  sendMessage() {
    if (!this.canSendMessage) {
      this.questionModel?.control.markAsTouched();
      return;
    }

    if (this.canSendMessage) {
      this.chatWithModel();
    }
  }

  @ViewChild('questionModel') private questionModel?: NgModel;

  onQuestionChange(value: string): void {
    if (value.trim().length !== 0) {
      return;
    }

    this.questionModel?.control.markAsPristine();
    this.questionModel?.control.markAsUntouched();
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
