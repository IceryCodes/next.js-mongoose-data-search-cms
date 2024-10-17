declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    
    NEXT_PRIVATE_GOOGLE_API_KEY: string;
    NEXT_PRIVATE_BASE_URL: string;
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_FEATURED_IMAGE: string;
  }
}
