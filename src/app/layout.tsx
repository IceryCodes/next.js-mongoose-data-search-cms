'use client';

import { LoadScript } from '@react-google-maps/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import localFont from 'next/font/local';

import Header from './components/Header';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F5F5F5]`}>
        <QueryClientProvider client={queryClient}>
          <LoadScript googleMapsApiKey={process.env.NEXT_PRIVATE_GOOGLE_API_KEY}>
            <Header>{children}</Header>
          </LoadScript>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
