import { environment } from '../config/environment';

export interface User {
  email: string;
  password: string;
}

export const EMPTY_USER: Readonly<User> = Object.freeze({
  email: environment.userEmail,
  password: environment.userPassword
});

export const DEMO_USER: Readonly<User> = Object.freeze({
  email: environment.demoUserEmail,
  password: environment.demoUserPassword
});
