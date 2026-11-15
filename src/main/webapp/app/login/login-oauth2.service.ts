import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

export interface Logout {
  logoutUrl: string;
}

@Service()
export class LoginOAuth2Service {
  private readonly http = inject(HttpClient);

  login(): void {
    let port = location.port ? `:${location.port}` : '';
    if (port === ':4200') {
      port = ':8761';
    }
    let contextPath = location.pathname;
    if (contextPath.endsWith('accessdenied')) {
      contextPath = contextPath.substring(0, contextPath.indexOf('accessdenied'));
    }
    if (!contextPath.endsWith('/')) {
      contextPath = `${contextPath}/`;
    }
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `//${location.hostname}${port}${contextPath}oauth2/authorization/oidc`;
  }

  logout(): Observable<Logout> {
    return this.http.post<Logout>(`${serverApiUrl}api/logout`, {});
  }
}
