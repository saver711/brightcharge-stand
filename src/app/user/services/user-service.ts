import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/backoffice/users');
  }
}
