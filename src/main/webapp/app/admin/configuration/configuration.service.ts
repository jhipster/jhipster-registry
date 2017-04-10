import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import {Route} from '../../routes/route.model';

@Injectable()
export class JhiConfigurationService {

    constructor(private http: Http) {}

    getConfigs(prefix: String = ''): Observable<any> {
        return this.http.get(prefix + 'management/configprops').map((res: Response) => {
            let properties: any[] = [];

            const propertiesObject = res.json();

            for (let key in propertiesObject) {
                if (propertiesObject.hasOwnProperty(key)) {
                    properties.push(propertiesObject[key]);
                }
            }

            return properties.sort((propertyA, propertyB) => {
                return (propertyA.prefix === propertyB.prefix) ? 0 :
                    (propertyA.prefix < propertyB.prefix) ? -1 : 1;
            });
        });
    }

    getInstanceConfigs(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.getConfigs(instance.prefix + '/');
        }
        return this.getConfigs();
    }

    getEnv(prefix: String = ''): Observable<any> {
        return this.http.get(prefix + 'management/env').map((res: Response) => {
            let properties: any = {};

            const propertiesObject = res.json();

            for (let key in propertiesObject) {
                if (propertiesObject.hasOwnProperty(key)) {
                    let valsObject = propertiesObject[key];
                    let vals: any[] = [];

                    for (let valKey in valsObject) {
                        if (valsObject.hasOwnProperty(valKey)) {
                            vals.push({key: valKey, val: valsObject[valKey]});
                        }
                    }
                    properties[key] = vals;
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
