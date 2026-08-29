export const generateRegistrationEmail = (
  workerIndex: number,
  scenario = 'user'
): string =>
  `playwright.registration.${scenario}.${Date.now()}.${workerIndex}@example.com`;
