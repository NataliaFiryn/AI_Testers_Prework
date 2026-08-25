export const PAGE_URLS = {
  home: '/',
  alerts: '/alerts.html',
  documentation: '/docs.html',
  registration: '/register.html',
  login: '/login.html',
  swagger: '/swagger.html'
} as const;

export type PageUrl = (typeof PAGE_URLS)[keyof typeof PAGE_URLS];
