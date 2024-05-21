"use client";

import { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { IntlProvider } from "react-intl";
import NotificationBar, {
  NotificationInfo,
} from "@/components/utils/NotificationBar";
import enMessages from "../locales/en.json";
import zhMessages from "../locales/zh.json";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  
  const [locale, setLocale] = useState("en"); // Default to English

 
  // Load corresponding messages based on current locale
  const messages = locale === "en" ? enMessages : zhMessages;

  return (
    // Internationalization
    <IntlProvider locale={locale} messages={messages}>
      <NextUIProvider>
        <NextThemesProvider {...themeProps}>
          <NotificationBar />
          <NotificationInfo />
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </IntlProvider>
  );
}
