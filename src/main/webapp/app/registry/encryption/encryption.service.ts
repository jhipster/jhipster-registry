import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JhiEncryptionService {
    constructor(private http: HttpClient) {}

    encrypt(textToEncrypt: string): Observable<string> {
        return this.http.post('config/encrypt', textToEncrypt, { responseType: 'text' }).map((response: string) => {
            return '{cipher}' + response;
        });
    }

    decrypt(textToDecrypt: string): Observable<string> {
        return this.http.post('config/decrypt', textToDecrypt, { responseType: 'text' }).map((response: string) => {
            return response;
        });
    }
}
