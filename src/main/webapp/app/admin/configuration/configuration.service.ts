import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { Route } from 'app/shared/routes/route.model';

export interface ConfigProps {
  contexts: Contexts;
}

export interface Contexts {
  [key: string]: Context;
}

export interface Context {
  beans: Beans;
  parentId?: any;
}

export interface Beans {
  [key: string]: Bean;
}

export interface Bean {
  prefix: string;
  properties: any;
}

export interface Env {
  activeProfiles?: string[];
  propertySources: PropertySource[];
}

export interface PropertySource {
  name: string;
  properties: Properties;
}

export interface Properties {
  [key: string]: Property;
}

export interface Property {
  value: string;
  origin?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  getBeans(prefix: String = ''): Observable<Bean[]> {
    return this.http.get<ConfigProps>((SERVER_API_URL as string) + prefix + 'management/configprops').pipe(
      map(configProps =>
        Object.values(
          Object.values(configProps.contexts)
            .map(context => context.beans)
            .reduce((allBeans: Beans, contextBeans: Beans) => ({ ...allBeans, ...contextBeans }))
        )
      )
    );
  }

  getInstanceBeans(instance: Route | undefined): Observable<Bean[]> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.getBeans(instance.prefix + '/');
    }
    return this.getBeans();
  }

  getPropertySources(prefix: String = ''): Observable<PropertySource[]> {
    return this.http.get<Env>((SERVER_API_URL as string) + prefix + 'management/env').pipe(
      map(env => {
        return env.propertySources;
      })
    );
  }

  getInstancePropertySources(instance: Route | undefined): Observable<PropertySource[]> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.getPropertySources(instance.prefix + '/');
    }
    return this.getPropertySources();
  }
}
