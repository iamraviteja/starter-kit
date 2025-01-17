import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '@core';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.credentialsService.isAuthenticated().pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuth: boolean) => {
        if (!isAuth) {
          log.debug('Not authenticated, redirecting and adding redirect url...');
          this.router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
        }
        return isAuth;
      })
    );
  }
}
