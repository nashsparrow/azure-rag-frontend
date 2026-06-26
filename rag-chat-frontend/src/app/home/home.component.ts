import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from '../chat/chat.component';
import { ApiService } from '../services/api.service';
import { DocumentListDialogComponent } from '../document-list-dialog/document-list-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ChatComponent,
    MatDialogModule,
  ],
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

  documents: any[] = [];
  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);

  constructor() {
    this.getAllDocuments();
  }

  getAllDocuments() {
    this.apiService.getDocuments().subscribe({
      next: (response) => {
        console.log(response);
        this.documents = response;
      },
      error: (error) => {
        console.error('Backend Error:', error);
      },
    });
  }

  openDocumentsDialog(): void {
    this.dialog.open(DocumentListDialogComponent, {
      width: '600px',
      data: this.documents,
    });
  }
}
