import localFont from "next/font/local";
import "../../public/globals.css";
import Providers from "./store/Providers";
import { AppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ListAlt } from "@mui/icons-material";
import { Suspense } from "react";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "IdealTech ToDo",
  description: "To Do list",
};

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Board',
    icon: <ListAlt />,
  },
];

const BRANDING= {
  title: "IdealTech ToDo",
  logo: null
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <AppProvider navigation={NAVIGATION} branding={BRANDING}>
                {children}
              </AppProvider>
            </AppRouterCacheProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
