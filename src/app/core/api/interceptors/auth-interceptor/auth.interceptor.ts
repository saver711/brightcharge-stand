import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { ErrorCodes, ErrorResponse } from '../../api.model';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Logout } from 'src/app/user-management/state/user-management.actions';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private messageService: MessageService
  ) {}

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<unknown> =
    new BehaviorSubject<any>(null);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: ErrorResponse) => {
        console.log(`catchError ~ error:`, error);
        if (
          error.error &&
          error.error.errorCode === ErrorCodes.ACCESS_TOKEN_EXPIRED
        ) {
          // if (error.status === 401) {
          const isRemembered = localStorage.getItem('remembered');
          if (isRemembered) {
            return this.handleExpiredAccessToken(request, next);
          } else {
            this.store.dispatch(new Logout());
            this.router.navigate(['/login'], {
              state: { message: 'Your session ended, login again' },
            });
            return throwError(() => error);
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  handleExpiredAccessToken(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshAccessTokenRequest().pipe(
        switchMap((newToken: { token: string }) => {
          const token = newToken.token;
          request = this.addTokenToRequest(request, token);
          localStorage.setItem('token', token);
          return next.handle(request);
        }),
        catchError((error: ErrorResponse) => {
          if (error.status === 401) {
            this.store.dispatch(new Logout());
            this.router.navigate(['/login'], {
              state: { message: 'Your session ended, login again' },
            });
            return throwError(() => error);
          }
          this.messageService.add({
            severity: 'error',
            summary:
              'Something is wrong with your access, try logging in again',
          });
          return throwError(() => 'Refresh token failed');
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          request = this.addTokenToRequest(
            request,
            localStorage.getItem('token')
          );
          return next.handle(request);
        })
      );
    }
  }

  refreshAccessTokenRequest(): Observable<any> {
    return this.http.get('/api/backoffice/auth/refresh-token');
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string | null
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
