import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {


    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(mergeMap(() => {

            console.log(`[FakeBackendInterceptor] tryin to intercept: ${request.method} ${request.url}`);

            // Todo list
            // tslint:disable-next-line:no-string-literal
            if (request.url.endsWith(`${environment['apiBaseUrl']}todo/`) && request.method === 'GET') {
                console.log(`[FakeBackendInterceptor] intercepted: ${request.method} ${request.url}`);
                const body = [
                    {
                        id: this.makeid(),
                        title: 'item 1',
                        completed: false
                    },
                    {
                        id: this.makeid(),
                        title: 'item 2',
                        completed: true
                    },
                    {
                        id: this.makeid(),
                        title: 'item 3',
                        completed: false
                    }
                ];
                return of(new HttpResponse({ status: 200, body }));
            }

            // Add an Todo Item
            // tslint:disable-next-line:no-string-literal
            if (request.url.endsWith(`${environment['apiBaseUrl']}todo/`) && request.method === 'POST') {
                console.log(`[FakeBackendInterceptor] intercepted: ${request.method} ${request.url}`);
                const body = {
                    success: true,
                    result : {
                        id : this.makeid(),
                        title: 'item ' + this.makeid(),
                        completed: false
                    }
                };

                return of(new HttpResponse({ status: 200, body }));
            }

            // Delete an Todo Item
            // tslint:disable-next-line:no-string-literal
            if (request.url.startsWith(`${environment['apiBaseUrl']}todo/`) && request.method === 'DELETE') {
                console.log(`[FakeBackendInterceptor] intercepted: ${request.method} ${request.url}`);
                const body = {
                    success: true,
                };

                return of(new HttpResponse({ status: 200, body }));
            }

            // Update an Todo Item
            // tslint:disable-next-line:no-string-literal
            if (request.url.startsWith(`${environment['apiBaseUrl']}todo/`) && request.method === 'PUT') {
                console.log(`[FakeBackendInterceptor] intercepted: ${request.method} ${request.url}`);
                const body = {
                    success: true,
                    result    : {
                        title    : 'Update title',
                        completed: true,
                        id: this.makeid()
                    }
                };

                return of(new HttpResponse({ status: 200, body }));
            }

            // at default just process the request
            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }

    private makeid(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 25; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
