import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class EncryptionService {
  private readonly http = inject(HttpClient);

  encrypt(textToEncrypt: string): Observable<string> {
    return this.http
      .post(`${serverApiUrl}config/encrypt`, textToEncrypt, { responseType: 'text' })
      .pipe(map(response => `{cipher}${response}`));
  }

  decrypt(textToDecrypt: string): Observable<string> {
    return this.http.post(`${serverApiUrl}config/decrypt`, textToDecrypt, { responseType: 'text' });
  }
}
