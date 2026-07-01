import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatComponent } from '../chat/chat.component';
import { ApiService } from '../services/api.service';
import { DocumentListDialogComponent } from '../document-list-dialog/document-list-dialog.component';
import { CommonModule } from '@angular/common';
import { UploadStatusDialogComponent } from '../upload-status-dialog/upload-status-dialog.component';
import { catchError, of, switchMap, takeWhile, timer } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    ChatComponent,
    MatDialogModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly maxUploadSizeInBytes = 3 * 1024 * 1024;

  quickCards = [
    {
      icon: 'code',
      title: 'Backend GitHub Repo',
      subtitle:
        'View source code and project repository for the C# and Azure Pipeline.',
      action: 'View Repository',
      link: 'https://github.com/nashsparrow/azure-c-sharp-rag-assistant',
      type: 'external',
    },
    {
      icon: 'code',
      title: 'Frontend GitHub Repo',
      subtitle:
        'View source code and project repository for the Frontend implemented in Angular.',
      action: 'View Repository',
      link: 'https://github.com/nashsparrow/azure-rag-frontend',
      type: 'external',
    },
    {
      icon: 'account_tree',
      title: 'Architecture',
      subtitle: 'Explore the system architecture and pipeline.',
      action: 'View Architecture',
      link: '/architecture',
      type: 'internal',
    },
    {
      icon: 'verified_user',
      title: 'Performance Evaluation',
      subtitle: 'Detailed performance analysis and insights.',
      action: 'View Evaluation',
      link: '/evaluation',
      type: 'internal',
    },
  ];

  documents: any[] = [];
  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  selectedFile: File | null = null;
  selectedFileName = '';
  jobId = crypto.randomUUID();

  constructor() {
    this.getAllDocuments();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.isValidPdf(file)) {
      this.showUploadValidationError('Only PDF files are allowed.');
      this.resetSelectedFile(input);
      return;
    }

    if (file.size > this.maxUploadSizeInBytes) {
      this.showUploadValidationError('File size must be 3 MB or smaller.');
      this.resetSelectedFile(input);
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.uploadDocument();
  }

  getAllDocuments() {
    this.apiService.getDocuments().subscribe({
      next: (response) => {
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

  uploadDocumenttemp(file: File) {
    this.apiService.uploadDocument(file, this.jobId).subscribe({
      next: (response) => {
        this.documents = response;
      },
      error: (error) => {
        console.error('Backend Error:', error);
      },
    });
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      return;
    }

    const jobId = crypto.randomUUID();

    const dialogRef = this.dialog.open(UploadStatusDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        title: 'Uploading Document',
        status: 'starting',
        steps: this.generateStepsFromId(''),
        hasError: false,
        hasSuccess: false,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllDocuments();
    });

    const pollSub = timer(0, 1500)
      .pipe(
        switchMap(() =>
          this.apiService.getUploadStatus(jobId).pipe(
            catchError((error) => {
              return of({
                status: 'Pending',
              });
            }),
          ),
        ),
        takeWhile(
          (statusResponse) =>
            !!statusResponse &&
            statusResponse.status !== 'Indexed' &&
            statusResponse.status !== 'Failed',
          true,
        ),
      )
      .subscribe({
        next: (statusResponse) => {
          if (!statusResponse) {
            return;
          }

          dialogRef.componentInstance.data = {
            title: 'Uploading Document',
            status: statusResponse.status,
            steps: this.generateStepsFromId(statusResponse.status),
            hasError: false,
            hasSuccess:
              statusResponse.status === DocumentStatus.Indexed ||
              statusResponse.status === DocumentStatus.Completed,
            successMessage:
              statusResponse.status === DocumentStatus.Indexed ||
              statusResponse.status === DocumentStatus.Completed
                ? 'Uploaded successfully.'
                : undefined,
          };
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          dialogRef.disableClose = false;
        },
      });

    this.apiService.uploadDocument(this.selectedFile, jobId).subscribe({
      next: (response) => {
        console.log('upload request accepted', response);
      },
      error: (error) => {
        pollSub.unsubscribe();
        console.error(error);
        dialogRef.disableClose = false;
        dialogRef.componentInstance.data = {
          title: 'Uploading Document',
          status: 'Failed',
          steps: this.generateStepsFromId(DocumentStatus.Failed),
          hasError: true,
          hasSuccess: false,
          errorMessage:
            error.error.message ??
            'The upload request failed. Please close this dialog and try again.',
        };
      },
    });
  }

  generateStepsFromId(status: string): any[] {
    var steps: any[] = [
      { key: 'Uploaded', label: 'File uploaded', done: false },
      { key: 'Extracted', label: 'Document Extracted', done: false },
      { key: 'Cleaned', label: 'Text is Cleaned', done: false },
      { key: 'Chunked', label: 'Document Chunked', done: false },
      { key: 'Embedded', label: 'Embeddings Derived', done: false },
      { key: 'Indexed', label: 'Indexed in Azure Search', done: false },
      { key: 'Completed', label: 'Completed', done: false },
    ];

    var completedKeys: string[] = [];

    if (status == DocumentStatus.Uploaded) {
      completedKeys.push('Uploaded');
    } else if (status == DocumentStatus.Extracted) {
      completedKeys.push('Uploaded', 'Extracted');
    } else if (status == DocumentStatus.Cleaned) {
      completedKeys.push('Uploaded', 'Extracted', 'Cleaned');
    } else if (status == DocumentStatus.Chunked) {
      completedKeys.push('Uploaded', 'Extracted', 'Cleaned', 'Chunked');
    } else if (status == DocumentStatus.Embedded) {
      completedKeys.push(
        'Uploaded',
        'Extracted',
        'Cleaned',
        'Chunked',
        'Embedded',
      );
    } else if (
      status == DocumentStatus.Indexed ||
      status == DocumentStatus.Completed
    ) {
      completedKeys.push(
        'Uploaded',
        'Extracted',
        'Cleaned',
        'Chunked',
        'Embedded',
        'Indexed',
        'Completed',
      );
    }

    steps.forEach((step) => {
      if (completedKeys.includes(step.key)) {
        step.done = true;
      }
    });

    return steps;
  }

  private isValidPdf(file: File): boolean {
    return (
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    );
  }

  private resetSelectedFile(input: HTMLInputElement): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    input.value = '';
  }

  private showUploadValidationError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['app-snackbar-error', 'app-snackbar-centered'],
    });
  }
}

enum DocumentStatus {
  Pending = 'Pending',
  Uploaded = 'Uploaded',
  Extracted = 'Extracted',
  Cleaned = 'Cleaned',
  Chunked = 'Chunked',
  Embedded = 'Embedded',
  Indexed = 'Indexed',
  Completed = 'Completed',
  Failed = 'Failed',
}
