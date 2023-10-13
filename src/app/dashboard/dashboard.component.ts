import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout } from '../user-management/state/user-management.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'bs-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private store: Store,
    private router: Router
  ) {}
  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }
}
