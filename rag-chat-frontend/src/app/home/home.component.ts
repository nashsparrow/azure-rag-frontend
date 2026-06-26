import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  quickCards = [
    {
      icon: 'code',
      title: 'GitHub Repo',
      subtitle: 'View source code and project repository.',
      action: 'View Repository',
    },
    {
      icon: 'account_tree',
      title: 'Architecture',
      subtitle: 'Explore the system architecture and pipeline.',
      action: 'View Architecture',
    },
    {
      icon: 'verified_user',
      title: 'Performance Evaluation',
      subtitle: 'Detailed performance analysis and insights.',
      action: 'View Evaluation',
    },
  ];
}
