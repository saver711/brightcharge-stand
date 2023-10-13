import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TokenResolverService {
  constructor(private http: HttpClient) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const url = `/api/backoffice/auth/validate-token`;
    const token = route.queryParams['token'];
    const body = { token };

    return this.http.post(url, body).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );
  }
}

export const TokenResolverGuard: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(TokenResolverService).resolve(route, state);
};
