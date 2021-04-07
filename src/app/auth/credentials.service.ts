import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
}

const credentialsKey = 'credentials';

const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;
  private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private _currentAccessToken: string = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
    this.loadToken();
  }

  /**
   * loadToken
   */
  public loadToken() {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      this._currentAccessToken = token;
      this.isAuthenticated$.next(true);
    } else {
      this.isAuthenticated$.next(false);
    }
  }

  /**
   * setToken
   */
  public setToken(token: any) {
    this._currentAccessToken = token[ACCESS_TOKEN_KEY];
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token[ACCESS_TOKEN_KEY]);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token[REFRESH_TOKEN_KEY]);
    this.isAuthenticated$.next(true);
  }

  /**
   * setToken
   */
  public setAccessToken(token: any) {
    this._currentAccessToken = token;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  /**
   * removeToken
   */
  public removeToken(): void {
    this._currentAccessToken = null;
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    this.isAuthenticated$.next(false);
  }

  /**
   * getToken
   */
  public getToken(): string {
    return this._currentAccessToken;
  }

  /**
   * getRefreshToken
   */
  public getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
