import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface UploadStep {
  key: string;
  label: string;
  done: boolean;
}

export interface UploadStatusData {
  title: string;
  status: string;
  steps: UploadStep[];
}

@Component({
  selector: 'app-upload-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './upload-status-dialog.component.html',
  styleUrl: './upload-status-dialog.component.css',
})
export class UploadStatusDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UploadStatusData) {}
}
