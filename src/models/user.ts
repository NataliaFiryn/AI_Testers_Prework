import { environment } from '../config/environment';

export interface User {
  email: string;
  password: string;
}

export const createUser = (overrides: Partial<User> = {}): User => {
  return {
    email: overrides.email ?? environment.userEmail,
    password: overrides.password ?? environment.userPassword
  };
};
