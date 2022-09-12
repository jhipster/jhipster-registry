import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ProfileInfo, InfoResponse } from './profile-info.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private infoUrl = this.applicationConfigService.getEndpointFor('management/info');
  private profileInfo$?: Observable<ProfileInfo>;

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getProfileInfo(): Observable<ProfileInfo> {
    if (this.profileInfo$) {
      return this.profileInfo$;
    }

    this.profileInfo$ = this.http.get<InfoResponse>(this.infoUrl).pipe(
      map((response: InfoResponse) => ({
        activeProfiles: response.activeProfiles,
        inProduction: response.activeProfiles?.includes('prod'),
        openAPIEnabled: response.activeProfiles?.includes('api-docs'),
      })),
      shareReplay()
    );
    return this.profileInfo$;
  }
}
