import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from '../chat/chat.component';
import { ApiService } from '../services/api.service';
import { DocumentListDialogComponent } from '../document-list-dialog/document-list-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ChatComponent,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  quickCards = [
    {
      icon: 'code',
      title: 'Backend GitHub Repo',
      subtitle:
        'View source code and project repository for the C# and Azure Pipeline.',
      action: 'View Repository',
      link: 'https://github.com/nashsparrow/azure-c-sharp-rag-assistant',
    },
    {
      icon: 'code',
      title: 'Frontend GitHub Repo',
      subtitle:
        'View source code and project repository for the Frontend implemented in Angular.',
      action: 'View Repository',
      link: 'https://github.com/nashsparrow/azure-rag-frontend',
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
  selectedFile: File | null = null;
  selectedFileName = '';

  constructor() {
    this.getAllDocuments();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
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
