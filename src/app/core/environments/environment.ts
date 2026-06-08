import packageInfo from '../../../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,

  // apiUrl: 'http://gpsvoyager.test',
  apiUrl: 'http://localhost:8000',
  apiUrlProfiles: 'http://newprofiles.test',

  // Control de tiempo para inactividad de usuario (hace logout automáticamente)
  // inactivityTimeout: 1 * 60 * 1000, // 2 minutos en milisegundos
  // inactivityTimeout: 100000,
  inactivityTimeout: 10 * 60 * 1000,
  //tokenRefreshOffset: 4 * 60 * 1000, // 3 minutos antes de que expire el token
  //tokenRefreshOffset: 30 * 1000, // 30 segundos antes de que expire el token (¡ajustado para pru
  // tokenRefreshOffset: 9 * 60 * 1000, // 30 segundos antes de que expire el token (¡ajustado para pru
  tokenRefreshOffset: 2.5 * 60 * 1000, // 1 minuto (en milisegundos) despues de creado el token refresco
};
