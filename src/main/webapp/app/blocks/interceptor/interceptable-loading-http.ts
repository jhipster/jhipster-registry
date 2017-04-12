import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, RequestOptionsArgs, Request, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptor } from 'ng-jhipster';
import { NgLoadingBarHttp } from 'ng-loading-bar';
import { LoadingBarRequestOptionsArgs } from 'ng-loading-bar/lib/loading-bar.http';

@Injectable()
export class InterceptableLoadingBarHttp extends NgLoadingBarHttp {
    private firstInterceptor: HttpInterceptor;

    constructor(
        backend: ConnectionBackend,
        defaultOptions: RequestOptions,
        interceptors: HttpInterceptor[]
    ) {
        super(backend, defaultOptions);

        if (interceptors && interceptors.length > 0) {
            interceptors.reduce((chain, current) => {
                chain.successor = current;
                return current;
            });

            this.firstInterceptor = interceptors[0];
        }
    }

    request(url: string | Request, options?: LoadingBarRequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(url, this.getRequestOptionArgs(options));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (!options) {
            options = new RequestOptions();
        }
        if (!options.headers) {
            options.headers = new Headers();
        }

        return !this.firstInterceptor ? options : this.firstInterceptor.processRequestInterception(options);
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return !this.firstInterceptor ? observable : this.firstInterceptor.processResponseInterception(observable);
    }
}
