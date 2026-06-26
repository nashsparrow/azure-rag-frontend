import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
  prompt = '';

  messages = [
    {
      type: 'user',
      text: 'test answer',
      time: '10:30 AM',
    },
    {
      type: 'bot',
      text: `test message`,
      time: '10:30 AM',
    },
    {
      type: 'user',
      text: 'test message',
      time: '10:31 AM',
    },
    {
      type: 'bot',
      text: 'test answer',
      time: '10:31 AM',
    },
  ];
}
