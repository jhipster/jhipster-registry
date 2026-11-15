import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class SSHService {
  private readonly http = inject(HttpClient);

  getSshPublicKey(): Observable<string> {
    return this.http.get(`${serverApiUrl}api/ssh/public_key`, { responseType: 'text' });
  }
}
