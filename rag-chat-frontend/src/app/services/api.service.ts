import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);

  getDocuments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/documents/getall`);
  }

  uploadDocument(file: File, jobId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('indexing', 'true');
    formData.append('jobid', jobId);
    return this.http.post(`${this.baseUrl}/documents/upload`, formData);
  }

  getUploadStatus(jobId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/documents/getstatus/${jobId}`);
  }

  getChatResult(question: string): Observable<any> {
    const body = {
      question: question,
    };
    return this.http.post(`${this.baseUrl}/query/chat/sk`, body);
  }
}
