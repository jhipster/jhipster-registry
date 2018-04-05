import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Route } from 'app/shared';

@Injectable()
export class JhiConfigurationService {
    constructor(private http: HttpClient) {}

    getConfigs(prefix: String = ''): Observable<any> {
        return this.http.get(prefix + 'management/configprops', { observe: 'response' }).map((res: HttpResponse<any>) => {
            const properties: any[] = [];
            const propertiesObject = this.getConfigPropertiesObjects(res.body);
            for (const key in propertiesObject) {
                if (propertiesObject.hasOwnProperty(key)) {
                    properties.push(propertiesObject[key]);
                }
            }

            return properties.sort((propertyA, propertyB) => {
                return propertyA.prefix === propertyB.prefix ? 0 : propertyA.prefix < propertyB.prefix ? -1 : 1;
            });
        });
    }

    getConfigPropertiesObjects(res: Object) {
        // This code is for Spring Boot 2
        if (res['contexts'] !== undefined) {
            for (const key in res['contexts']) {
                // If the key is not bootstrap, it will be the ApplicationContext Id
                // For default app, it is applicationName
                // For microservice, it is applicationName-1
                if (!key.startsWith('bootstrap')) {
                    return res['contexts'][key]['beans'];
                }
            }
        }
        // Otherwise, return res.json(), which is for Spring Boot 1
        return res;
    }

    getInstanceConfigs(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.getConfigs(instance.prefix + '/');
        }
        return this.getConfigs();
    }

    getEnv(prefix: String = ''): Observable<any> {
        return this.http.get(prefix + 'management/env', { observe: 'response' }).map((res: HttpResponse<any>) => {
            const properties: any = {};
            const propertiesObject = res.body;

            if (propertiesObject['propertySources'] !== undefined) {
                // This is for Spring Boot 2
                const propertySources = propertiesObject['propertySources'];
                for (const propertyObject of propertySources) {
                    const name = propertyObject['name'];
                    const detailProperties = propertyObject['properties'];
                    const vals: any[] = [];
                    for (const keyDetail in detailProperties) {
                        if (detailProperties.hasOwnProperty(keyDetail)) {
                            vals.push({ key: keyDetail, val: detailProperties[keyDetail]['value'] });
                        }
                    }
                    properties[name] = vals;
                }
            } else {
                // This is for Spring Boot 1
                for (const key in propertiesObject) {
                    if (propertiesObject.hasOwnProperty(key)) {
                        const valsObject = propertiesObject[key];
                        const vals: any[] = [];
                        for (const valKey in valsObject) {
                            if (valsObject.hasOwnProperty(valKey)) {
                                vals.push({ key: valKey, val: valsObject[valKey] });
                            }
                        }
                        properties[key] = vals;
                    }
                }
            }
            return properties;
        });
    }

    getInstanceEnv(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.getEnv(instance.prefix + '/');
        }
        return this.getEnv();
    }
}
