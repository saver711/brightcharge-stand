export class Logout {
  static readonly type = '[Logout] reset state';
}

export class Login {
  static readonly type = '[Login] Login';
  constructor(
    public username: string,
    public password: string,
    public remember: boolean
  ) {}
}
