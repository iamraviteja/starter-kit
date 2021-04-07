import { HttpClient, HttpEvent, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { finalize, mergeMap, retryWhen } from 'rxjs/operators';

import { Logger } from '../../logger.service';

import requestConfig from './request-config.json';

const log = new Logger('RequestService');

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  /**
   * get
   */
  public get(path: string, pathParams: any, options?: any): Observable<any> {
    const urlPath = this.getUrlPath(requestConfig, path, pathParams);
    const retryOptions = requestConfig.paths[path].retryOptions;
    return this.http.get(urlPath, options || {}).pipe(retryWhen(this.requestRetryStrategy(retryOptions)));
  }

  /**
   * post
   */
  public post(path: string, pathParams: any, body?: any, options?: any): Observable<any> {
    const urlPath = this.getUrlPath(requestConfig, path, pathParams);
    const retryOptions = requestConfig.paths[path].retryOptions;
    return this.http.post(urlPath, body || {}, options || {}).pipe(retryWhen(this.requestRetryStrategy(retryOptions)));
  }

  private requestRetryStrategy({
    maxRetryAttempts = 3,
    scalingDuration = 1000,
    excludedStatusCodes = [],
    shouldRetry = false,
  }: {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    excludedStatusCodes?: number[];
    shouldRetry?: boolean;
  } = {}) {
    return (attempts: Observable<any>) => {
      return attempts.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          if (!shouldRetry || retryAttempt > maxRetryAttempts || excludedStatusCodes.find((e) => e === error.status)) {
            return throwError(error);
          }
          log.info(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
          return timer(retryAttempt * scalingDuration);
        }),
        finalize(() => {
          if (shouldRetry) {
            log.info(`Request retry completed`);
          }
        })
      );
    };
  }

  private getUrlPath(requestConfig: any, pathKey: string, params: any): string {
    let returnPath = '';

    if (!pathKey) {
      throw new Error('path is required for making a request');
    }
    if (!requestConfig.paths[pathKey]) {
      throw new Error('The specified path is not present');
    }

    // check if the request needs json mockdata
    if (requestConfig.paths[pathKey].mockData && requestConfig.paths[pathKey].mockDataPath) {
      return requestConfig.paths[pathKey].mockDataPath;
    }

    returnPath = requestConfig.paths[pathKey].path;
    if (params) {
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          returnPath = returnPath.replace(`{${key}}`, params[key]);
        }
      }
    }

    if (returnPath.trim() == '') {
      throw new Error('The return path cannot be empty');
    }

    return returnPath;
  }
}
