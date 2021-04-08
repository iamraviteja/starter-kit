import { Injectable, InjectionToken, Inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';

const log = new Logger('TimeoutHandlerInterceptor');

export const REQUEST_CONFIG = new InjectionToken<any>('requestConfig');

/**
 * Adds a default timeout handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class TimeoutHandlerInterceptor implements HttpInterceptor {
  duration = this.requestConfig.defaults.timeout;
  constructor(@Inject(REQUEST_CONFIG) protected requestConfig: any) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.duration = request.headers.get('timeout') || this.duration;
    this.duration = parseInt(this.duration);
    return next.handle(request).pipe(
      timeout(this.duration * 1000),
      catchError((error: HttpErrorResponse) => this.errorHandler(error))
    );
  }

  private errorHandler(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (response instanceof TimeoutError) {
      log.error(`The request is timedout after ${this.duration} secs`);
    }

    return throwError(response);
  }
}
