import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiEncryptionService {

    constructor(private http: Http) {}

    encrypt(textToEncrypt: string): Observable<any> {
        return this.http.post('config/encrypt', textToEncrypt).map((response: Response) => {
            return '{cipher}' + response.text();
        });
    }

    decrypt(textToDecrypt: string): Observable<any> {
        return this.http.post('config/decrypt', textToDecrypt).map((response: Response) => {
            return response.text();
        });
    }
}
