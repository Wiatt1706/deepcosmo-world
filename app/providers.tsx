"use client";

import { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { usePathname, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [locale, setLocale] = useState("en"); // Default to English

  useEffect(() => {
    // Determine locale from the pathname or search params
    const pathLocale = pathname.split("/")[1];
    const searchLocale = searchParams.get("lang");

    if (searchLocale) {
      setLocale(searchLocale);
    } else if (pathLocale === "zh" || pathLocale === "en") {
      setLocale(pathLocale);
    } else {
      setLocale("en"); // Fallback to English if no valid locale found
    }
  }, [pathname, searchParams]);

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
