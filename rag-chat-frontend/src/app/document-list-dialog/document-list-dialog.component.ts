import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-document-list-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './document-list-dialog.component.html',
  styleUrl: './document-list-dialog.component.css',
})
export class DocumentListDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public documents: { id: string; fileName: string; createdUtc: string }[],
  ) {}
}
