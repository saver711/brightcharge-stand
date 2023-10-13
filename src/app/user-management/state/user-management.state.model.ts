export interface ForgotPasswordModel {
  email: string;
  emailSent: boolean | undefined;
}

export enum UserRoles {
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

export type DecodedTokenInfo = {
  role: UserRoles;
  user_id: number;
  user_name: string;
  exp: number;
};
export interface SessionModel {
  username: string;
  token: string;
  loggedIn: boolean | undefined;
  role: UserRoles | undefined;
}
