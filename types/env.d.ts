declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SOCKETIO_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}
