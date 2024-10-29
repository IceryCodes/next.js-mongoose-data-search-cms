declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PRIVATE_MONGODB_URI: string;
    NEXT_PRIVATE_JWT_SECRET: string;
    NEXT_PRIVATE_EMAIL_USER: string;
    NEXT_PRIVATE_EMAIL_PASSWORD: string;
    NEXT_PRIVATE_ADMIN_EMAIL: string;
    NEXT_PRIVATE_GOOGLE_API_KEY: string;
    NEXT_PRIVATE_REQUESTS_LIMIT: string;

    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_FEATURED_IMAGE: string;
  }
}
