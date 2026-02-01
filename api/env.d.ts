
import { NodeEnvironment } from "./src/types/node-environment.type";

declare global {

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: NodeEnvironment;
            DATABASE_URL: string;
            BCRYPT_SALT_ROUNDS: string | number;
            BCRYPT_SECRET: string;
            JWT_ACCESS_TOKEN_SECRET: string;
            JWT_ACCESS_TOKEN_EXPIRATION_MS: string | number;
            JWT_REFRESH_TOKEN_SECRET: string;
            JWT_REFRESH_TOKEN_EXPIRATION_MS: string | number;
            PORT: string | number;
        }
    }
}

export {}
