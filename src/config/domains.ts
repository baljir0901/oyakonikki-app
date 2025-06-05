// Domain configuration for different environments
export const DOMAINS = {
  // Production domains
  MAIN_DOMAIN: 'oyakonikki-web.netlify.app',
  ADMIN_DOMAIN: 'oyakonikki-app.netlify.app',
  
  // For local development
  LOCAL_MAIN: 'localhost',
  LOCAL_ADMIN: 'admin-localhost',
};

// Helper function to check if current domain is admin
export const isAdminDomain = (): boolean => {
  const hostname = window.location.hostname;
  
  // Check for production admin domain
  if (hostname === DOMAINS.ADMIN_DOMAIN) {
    return true;
  }
  
  // Check for local development admin domain
  if (hostname === DOMAINS.LOCAL_ADMIN || hostname.startsWith('admin-')) {
    return true;
  }
  
  return false;
};

// Helper function to get the correct redirect URL for auth
export const getAuthRedirectUrl = (path: string = ''): string => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  const baseUrl = port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;
  return `${baseUrl}${path}`;
};
