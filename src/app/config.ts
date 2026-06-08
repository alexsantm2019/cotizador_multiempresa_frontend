export interface AppSettings {
  dir: 'ltr' | 'rtl';
  theme: string;
  sidenavOpened: boolean;
  sidenavCollapsed: boolean;
  boxed: boolean;
  horizontal: boolean;
  activeTheme: string;
  language: string;
  cardBorder: boolean;
  navPos: 'side' | 'top';
}

export const defaults: AppSettings = {
  dir: 'ltr',
  theme: 'light',
  sidenavOpened: true,
  sidenavCollapsed: true,
  boxed: false,
  horizontal: true,
  cardBorder: true,
  // activeTheme: 'blue_theme',
  activeTheme: 'orange_theme',
  language: 'en-us',
  navPos: 'side',
};
