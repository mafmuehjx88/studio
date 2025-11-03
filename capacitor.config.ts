
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atgamehub.app',
  appName: 'AT Game HUB',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  ios: {
    webDir: 'out',
  }
};

export default config;
