import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from '../core/config/application-config.service';
import { Logout } from 'app/login/logout.model';

@Injectable({ providedIn: 'root' })
export class LoginOAuth2Service {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  login(): void {
    let port = location.port ? `:${location.port}` : '';
    if (port === ':9000') {
      port = ':8761';
    }
    let contextPath = location.pathname;
    if (contextPath.endsWith('accessdenied')) {
      contextPath = contextPath.substring(0, contextPath.indexOf('accessdenied'));
    }
    if (!contextPath.endsWith('/')) {
      contextPath = contextPath + '/';
    }
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `//${location.hostname}${port}${contextPath}oauth2/authorization/oidc`;
  }

  logout(): Observable<Logout> {
    return this.http.post<Logout>(this.applicationConfigService.getEndpointFor('api/logout'), {});
  }
}
