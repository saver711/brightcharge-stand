import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Select } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subscription, map } from 'rxjs';
import { UserManagementService } from 'src/app/user-management/services/user-management.service';
import { SessionState } from 'src/app/user-management/state/session.state';
import { SessionModel } from 'src/app/user-management/state/user-management.state.model';

@Injectable({
  providedIn: 'root',
})
class AuthGuard {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private jwtService: JwtHelperService,
    private userManagementService: UserManagementService
  ) {}
  subscription!: Subscription;

  @Select(SessionState.session)
  currentUser$!: Observable<SessionModel>;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const userToken = localStorage.getItem('token');
    const tokenStillValid = !this.jwtService.isTokenExpired(userToken);
    const isRemembered: boolean = JSON.parse(
      localStorage.getItem('remembered') || 'false'
    );
    // const canAccess =
    //   (tokenStillValid && isRemembered) || (tokenStillValid && !isRemembered);
    // For now, i don't prefer to refresh the token here, i want the interceptor to be the only place that does that
    // const canAccessButNeedsRefresh = !tokenStillValid && isRemembered;
    const cannotAccess = !tokenStillValid && !isRemembered;

    return this.currentUser$.pipe(
      map(user => {
        if (!user.loggedIn && cannotAccess) {
          if (state.url !== '/login') {
            this.router.navigate(['/login']);
            localStorage.removeItem('token');
          }
          return true;
        } else {
          if (state.url === '/login') {
            const path = this.userManagementService.getUserRootPath();
            this.router.navigate([path]);
          }
          return true;
        }
      })
    );
  }
}

export const IsLoggedInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthGuard).canActivate(route, state);
};
