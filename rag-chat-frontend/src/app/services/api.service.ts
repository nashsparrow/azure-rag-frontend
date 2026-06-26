import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getDocuments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/documents/getall`);
  }
}
