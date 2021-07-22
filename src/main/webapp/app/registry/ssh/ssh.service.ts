import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SSHService {
  constructor(private http: HttpClient) {}

  getSshPublicKey(): Observable<string> {
    return this.http.get<string>('api/ssh/public_key');
  }
}
