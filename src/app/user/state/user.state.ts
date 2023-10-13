import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import { GetUsers } from './user.actions';
import { UserStateModel } from '../user.model';
import { UserService } from '../services/user-service';

@State<UserStateModel>({
  name: 'users',
})
@Injectable()
export class UserState {
  constructor(private userService: UserService) {}

  @Action(GetUsers)
  GetUsers(ctx: StateContext<UserStateModel>) {
    return this.userService.getUsers().pipe(
      tap({
        next: response => {
          ctx.patchState({
            users: response,
          });
        },
      })
    );
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.users;
  }
}
