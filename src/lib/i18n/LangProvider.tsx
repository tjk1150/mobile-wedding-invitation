'use client';

import en from '@/locales/en.json';
import kr from '@/locales/kr.json';
import { useSearchParams } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const messages = { kr, en } as const;

export type Lang = 'kr' | 'en';

type LangContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  isKr: boolean;
  isEn: boolean;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const initialParam = searchParams.get('lang');
  const initialLang: Lang =
    initialParam === 'en' || initialParam === 'kr'
      ? (initialParam as Lang)
      : 'kr';
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const param = searchParams.get('lang');
    if (param === 'kr' || param === 'en') {
      setLang(param);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute(
        'lang',
        lang === 'en' ? 'en' : 'ko'
      );
    }
  }, [lang]);

  // Ensure the global fade-in applies (globals.css uses body.opacity 0 until loaded)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('loaded');
    }
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, isKr: lang === 'kr', isEn: lang === 'en' }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === 'object' &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useT() {
  const { lang } = useLang();
  return (key: string): string => {
    const val = getByPath(messages[lang], key);
    if (typeof val === 'string') return val;
    return String(val ?? '');
  };
}
