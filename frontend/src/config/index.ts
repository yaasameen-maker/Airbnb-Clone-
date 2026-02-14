// Environment configuration for Vite
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

export const appConfig = {
  apiUrl: getApiUrl(),
  isDev: isDevelopment(),
  isProd: isProduction(),
  version: '1.0.0',
  appName: 'Airbnb Experiences Clone',
};
