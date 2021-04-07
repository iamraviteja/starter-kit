/**
 * Reference link :
 *  https://devdactic.com/ionic-jwt-refresh-token/
 */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthenticationService } from '@app/auth/authentication.service';
import { CredentialsService } from '@app/auth/credentials.service';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenInterceptor implements HttpInterceptor {
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _auth: AuthenticationService, private _creds: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // We don't want to add token for some requests like login or refresh token itself
    // So we verify the url
    console.log(request.url, this.isUrlExcluded(request.url));
    if (this.isUrlExcluded(request.url)) {
      console.log(request.url);
      return next.handle(request);
    }

    const accessToken = this._creds.getToken();
    return next.handle(this.addAuthenticationToken(request, accessToken)).pipe(
      catchError((err) => {
        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 400:
              return throwError(err);
            case 401:
              return this.handle401Error(request, next);
            default:
              return throwError(err);
          }
        } else {
          return throwError(err);
        }
      })
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>, accessToken: string) {
    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
    // – which means the new token is ready and we can retry the request again
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addAuthenticationToken(request, token));
        })
      );
    }

    // handle the intial refresh token call
    // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);
    return this._auth.refreshToken().pipe(
      switchMap((token: any) => {
        if (!token) {
          // handle error from refresh token value call
          return of(null);
        }
        // store the access token to credentials service
        const accessToken = token.accessToken;
        this._creds.setAccessToken(accessToken);
        this.refreshTokenSubject.next(accessToken);
        return next.handle(this.addAuthenticationToken(request, accessToken));
      }),
      finalize(() => {
        //When the call to refreshToken completes we reset the refreshTokenInProgress to false
        // for the next time the token needs to be refreshed
        this.refreshTokenInProgress = false;
      })
    );
  }

  /**
   * isUrlExcluded
   */
  private isUrlExcluded(url: string): boolean {
    const excludedPaths = ['/auth', '/auth/logout', '/auth/refresh'];

    return excludedPaths.filter((val) => url.indexOf(val) != -1).length > 0;
  }
}
