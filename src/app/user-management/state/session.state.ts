import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';
import { UserManagementService } from '../services/user-management.service';
import { Login, Logout } from './user-management.actions';
import { SessionModel } from './user-management.state.model';

const SIMPLE_VALUE_STATE_TOKEN = new StateToken<SessionModel>('session');
const user = localStorage.getItem('user');
@State<SessionModel>({
  name: SIMPLE_VALUE_STATE_TOKEN,
  defaults: user
    ? (JSON.parse(user) as SessionModel)
    : {
        username: '',
        loggedIn: undefined,
        role: undefined,
        token: '',
      },
})
@Injectable()
export class SessionState {
  constructor(
    private userManagementService: UserManagementService,
    private cookieService: CookieService
  ) {}

  @Action(Login)
  login(ctx: StateContext<SessionModel>, action: Login) {
    return this.userManagementService
      .login(action.username, action.password)
      .pipe(
        tap({
          next: loginResponse => {
            const { token } = loginResponse;

            const role = this.userManagementService.getUserRole(token);
            const username = this.userManagementService.getUsername(token);
            this.userManagementService.setUserTokens(token);

            if (action.remember) {
              localStorage.setItem('remembered', 'true');
            }

            const user = {
              username: username || action.username,
              loggedIn: true,
              role,
              ...loginResponse,
            };
            localStorage.setItem('user', JSON.stringify(user));
            ctx.patchState(user);
          },
        })
      );
  }

  @Action(Logout)
  logout(ctx: StateContext<SessionModel>) {
    ctx.setState({
      loggedIn: false,
      role: undefined,
      token: '',
      username: '',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('remembered');
  }

  @Selector()
  static session(state: SessionModel) {
    return state;
  }
}
