import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { Route } from 'app/shared/routes/route.model';

@Injectable({ providedIn: 'root' })
export class JhiConfigurationService {
  constructor(private http: HttpClient) {}

  getConfigs(prefix: String = ''): Observable<any> {
    return this.http.get(SERVER_API_URL + prefix + 'management/configprops', { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        const properties: any[] = [];
        const propertiesObject = this.getConfigPropertiesObjects(res.body);
        for (const key in propertiesObject) {
          if (Object.prototype.hasOwnProperty.call(propertiesObject, key)) {
            properties.push(propertiesObject[key]);
          }
        }

        return properties.sort((propertyA, propertyB) => {
          return propertyA.prefix === propertyB.prefix ? 0 : propertyA.prefix < propertyB.prefix ? -1 : 1;
        });
      })
    );
  }

  getConfigPropertiesObjects(res: Record<string, any>) {
    // This code is for Spring Boot 2
    if (res['contexts'] !== undefined) {
      for (const key in res['contexts']) {
        // If the key is not bootstrap, it will be the ApplicationContext Id
        // For default app, it is baseName
        // For microservice, it is baseName-1
        if (!key.startsWith('bootstrap')) {
          return res['contexts'][key]['beans'];
        }
      }
    }
    // by default, use the default ApplicationContext Id
    return res['contexts']['JHipsterRegistry']['beans'];
  }

  getInstanceConfigs(instance: Route): Observable<any> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.getConfigs(instance.prefix + '/');
    }
    return this.getConfigs();
  }

  getEnv(prefix: String = ''): Observable<any> {
    return this.http.get(SERVER_API_URL + prefix + 'management/env', { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        const properties: any = {};
        const propertySources = res.body['propertySources'];

        for (const propertyObject of propertySources) {
          const name = propertyObject['name'];
          const detailProperties = propertyObject['properties'];
          const vals: any[] = [];
          for (const keyDetail in detailProperties) {
            if (Object.prototype.hasOwnProperty.call(detailProperties, keyDetail)) {
              vals.push({ key: keyDetail, val: detailProperties[keyDetail]['value'] });
            }
          }
          properties[name] = vals;
        }
        return properties;
      })
    );
  }

  getInstanceEnv(instance: Route): Observable<any> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.getEnv(instance.prefix + '/');
    }
    return this.getEnv();
  }
}
