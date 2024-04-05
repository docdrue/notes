/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// import { EThemes } from 'themes/enums/themes.enum.ts';

interface ImportMetaEnv {
  readonly VITE_WALLET_API_URL: string;
  readonly VITE_SECONDARY_ID: string;
  readonly VITE_OATHKEEPER_URL: string;
  // readonly VITE_THEME: EThemes;
  readonly VITE_FAVICON: string;
  readonly VITE_LOGO: string;
  readonly VITE_SITE_TITLE: string;
  readonly VITE_NAME: string;
  readonly VITE_HOST: string;
  readonly VITE_PORT: number;
  readonly VITE_HTTPS: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
