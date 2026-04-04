import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pleasureblock.puzzle',
  appName: 'Pleasure Block',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
