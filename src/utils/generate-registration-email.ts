export const generateRegistrationEmail = (workerIndex: number): string =>
  `playwright.registration.${Date.now()}.${workerIndex}@example.com`;
