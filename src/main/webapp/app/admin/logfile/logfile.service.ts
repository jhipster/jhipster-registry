import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from 'app/shared/routes/route.model';

@Injectable({ providedIn: 'root' })
export class LogfileService {
  constructor(private http: HttpClient) {}

  // get the Registry's logfile
  getLogfile(): Observable<string> {
    return this.http.get('management/logfile', { responseType: 'text' });
  }

  // get the instance's logfile
  getInstanceLogfile(instance: Route | undefined): Observable<string> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.http.get(instance.prefix + '/management/logfile', { responseType: 'text' });
    }
    return this.getLogfile();
  }
}
