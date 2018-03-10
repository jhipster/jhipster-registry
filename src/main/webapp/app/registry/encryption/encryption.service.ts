import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JhiEncryptionService {
    constructor(private http: HttpClient) {}

    encrypt(textToEncrypt: string): Observable<any> {
        return this.http.post('config/encrypt', textToEncrypt).map((response: HttpResponse<any>) => {
            return '{cipher}' + response.body;
        });
    }

    decrypt(textToDecrypt: string): Observable<any> {
        return this.http.post('config/decrypt', textToDecrypt).map((response: HttpResponse<any>) => {
            return response.body;
        });
    }
}
