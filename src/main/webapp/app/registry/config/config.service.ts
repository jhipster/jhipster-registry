import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(private http: HttpClient) {}

  getConfigAsYaml(application: string, profile: string, label: string): Observable<string> {
    return this.http.get('config/' + label + '/' + application + '-' + profile + '.yml', { responseType: 'text' });
  }

  getConfigAsProperties(application: string, profile: string, label: string): Observable<string> {
    return this.http.get('config/' + label + '/' + application + '-' + profile + '.properties', { responseType: 'text' });
  }

  getConfigAsJson(application: string, profile: string, label: string): Observable<string> {
    return this.http.get('config/' + label + '/' + application + '-' + profile + '.json', { responseType: 'text' });
  }
}
