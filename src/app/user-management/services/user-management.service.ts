import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DecodedTokenInfo,
  UserRoles,
} from '../state/user-management.state.model';
import { JwtHelperService } from '@auth0/angular-jwt';

type PostEmail = { username: string };

type LoginResponse = {
  token: 'string';
};

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtHelperService
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const res = this.http.post<LoginResponse>(`/api/backoffice/auth/login`, {
      userName: username,
      password,
    });
    return res;
  }

  emailRecoveryLink(username: string): Observable<PostEmail> {
    const res = this.http.patch<PostEmail>(
      `/api/backoffice/auth/password-forgot`,
      {
        userName: username,
      }
    );
    return res;
  }

  getUserRole(token: string): UserRoles | undefined {
    if (this.jwtService.isTokenExpired(token)) {
      return;
    }

    const decodedInfo: DecodedTokenInfo | null =
      this.jwtService.decodeToken(token);

    return decodedInfo?.role;
  }

  getUsername(token: string): string | undefined {
    if (this.jwtService.isTokenExpired(token)) {
      return;
    }

    const decodedInfo: DecodedTokenInfo | null =
      this.jwtService.decodeToken(token);

    return decodedInfo?.user_name;
  }

  setUserTokens(token: string) {
    const decodedInfo: DecodedTokenInfo | null =
      this.jwtService.decodeToken(token);
    localStorage.setItem('token', token);
  }

  getUserRootPath() {
    const userToken = localStorage.getItem('token')!;
    const role = this.getUserRole(userToken)!;

    const path = {
      admin: '/',
      operator: '/operator-dashboard',
    }[role];

    return path || '/';
  }
}
