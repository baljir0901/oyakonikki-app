
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.90e24904d4654560a62d700746d698d6',
  appName: 'oyakoni-diary-bridge',
  webDir: 'dist',
  server: {
    url: 'https://90e24904-d465-4560-a62d-700746d698d6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#fdf2f8',
      showSpinner: false
    }
  }
};

export default config;
