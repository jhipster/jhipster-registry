import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

export interface Config {
  label?: string;
  serverConfigurationSources?: Record<string, unknown>[];
}

@Service()
export class ConfigService {
  private readonly http = inject(HttpClient);

  getConfigAsYaml(application: string, profile: string, label: string): Observable<string> {
    return this.http.get(`${serverApiUrl}config/${label}/${application}-${profile}.yml`, { responseType: 'text' });
  }

  getConfigAsProperties(application: string, profile: string, label: string): Observable<string> {
    return this.http.get(`${serverApiUrl}config/${label}/${application}-${profile}.properties`, { responseType: 'text' });
  }

  getConfigAsJson(application: string, profile: string, label: string): Observable<string> {
    return this.http.get(`${serverApiUrl}config/${label}/${application}-${profile}.json`, { responseType: 'text' });
  }

  getConfigSources(): Observable<Config> {
    return this.http.get<Config>(`${serverApiUrl}api/config/sources`);
  }
}
