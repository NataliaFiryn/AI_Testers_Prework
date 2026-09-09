import { environment } from '../config/environment';

export interface User {
  email: string;
  password: string;
}

export const EMPTY_USER: Readonly<User> = Object.freeze({
  get email(): string {
    return environment.userEmail;
  },
  get password(): string {
    return environment.userPassword;
  }
});

export const DEMO_USER: Readonly<User> = Object.freeze({
  get email(): string {
    return environment.demoUserEmail;
  },
  get password(): string {
    return environment.demoUserPassword;
  }
});
