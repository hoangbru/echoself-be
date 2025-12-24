export interface RegisterInput {
  userName: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}
