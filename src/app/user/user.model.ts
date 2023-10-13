export type User = {
  email: string;
  id: string;
  role: {
    authority: string;
    id: string;
    name: string;
  };
  username: string;
};

export type UserStateModel = {
  users: User[] | null;
};
