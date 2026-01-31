// src/@types/env.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      JWT_SECRET: string;

      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

export {};
