import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArchitectureComponent } from './architecture/architecture.component';
import { EvaluationComponent } from './evaluation/evaluation.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'architecture', component: ArchitectureComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: '**', redirectTo: '' },
];
