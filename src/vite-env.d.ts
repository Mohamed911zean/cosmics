/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_TELEGRAM_PRIMARY_CHAT_ID: string
  readonly VITE_TELEGRAM_SECONDARY_CHAT_ID: string
  readonly VITE_FALLBACK_BOT_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
