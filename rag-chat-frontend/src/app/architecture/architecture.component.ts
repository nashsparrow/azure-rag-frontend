import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.css',
})
export class ArchitectureComponent {}
