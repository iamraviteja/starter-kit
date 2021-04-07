import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { map, switchMap, tap } from 'rxjs/operators';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private http: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    return this.http
      .post('/auth', {
        username: context.username,
        password: context.password,
      })
      .pipe(
        tap((data) => {
          let token = {};
          token[ACCESS_TOKEN_KEY] = data.accessToken;
          token[REFRESH_TOKEN_KEY] = data.refreshToken;
          this.credentialsService.setToken(token);
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    return this.http.post('/auth/logout', {}).pipe(
      switchMap((_) => {
        this.credentialsService.removeToken();
        return of(true);
      })
    );
  }

  /**
   * refreshToken
   */
  public refreshToken(): Observable<any> {
    const refreshTokenVal = this.credentialsService.getRefreshToken();

    if (!refreshTokenVal) {
      return of(null);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshTokenVal}`,
      }),
    };

    return this.http.get('/auth/refresh', httpOptions);
  }
}
