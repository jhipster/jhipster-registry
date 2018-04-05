import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route } from 'app/shared';

@Injectable()
export class JhiHealthService {
    separator: string;

    constructor(private http: HttpClient) {
        this.separator = '.';
    }

    // get the Registry's health
    checkHealth(): Observable<any> {
        return this.http.get('management/health');
    }

    // get the instance's health
    checkInstanceHealth(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get(instance.prefix + '/management/health');
        }
        return this.checkHealth();
    }

    transformHealthData(data): any {
        const response = [];
        if (data.details !== undefined) {
            this.flattenHealthData(response, null, data.details);
        } else {
            this.flattenHealthData(response, null, data);
        }
        return response;
    }

    getBaseName(name): string {
        if (name) {
            const split = name.split('.');
            return split[0];
        }
    }

    getSubSystemName(name): string {
        if (name) {
            const split = name.split('.');
            split.splice(0, 1);
            const remainder = split.join('.');
            return remainder ? ' - ' + remainder : '';
        }
    }

    /* private methods */
    private addHealthObject(result, isLeaf, healthObject, name): any {
        const healthData: any = {
            name
        };

        const details = {};
        let hasDetails = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key)) {
                const value = healthObject[key];
                if (key === 'status' || key === 'error') {
                    healthData[key] = value;
                } else {
                    if (!this.isHealthObject(value)) {
                        details[key] = value;
                        hasDetails = true;
                    }
                }
            }
        }

        // Add the details
        if (hasDetails) {
            healthData.details = details;
        }

        // Only add nodes if they provide additional information
        if (isLeaf || hasDetails || healthData.error) {
            result.push(healthData);
        }
        return healthData;
    }

    private flattenHealthData(result, path, data): any {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (this.isHealthObject(value)) {
                    if (this.hasSubSystem(value)) {
                        this.addHealthObject(result, false, value, this.getModuleName(path, key));
                        this.flattenHealthData(result, this.getModuleName(path, key), value);
                    } else {
                        this.addHealthObject(result, true, value, this.getModuleName(path, key));
                    }
                }
            }
        }
        return result;
    }

    private getModuleName(path, name): string {
        let result;
        if (path && name) {
            result = path + this.separator + name;
        } else if (path) {
            result = path;
        } else if (name) {
            result = name;
        } else {
            result = '';
        }
        return result;
    }

    private hasSubSystem(healthObject): boolean {
        let result = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key)) {
                const value = healthObject[key];
                if (value && value.status) {
                    result = true;
                }
            }
        }
        return result;
    }

    private isHealthObject(healthObject): boolean {
        let result = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key)) {
                if (key === 'status') {
                    result = true;
                }
            }
        }
        return result;
    }
}
