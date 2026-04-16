'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DateResetHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has('date')) {
      // Only redirect if this is a manual page refresh (F5 or Ctrl+R)
      // performance.navigation.type === 1 means TYPE_RELOAD (manual refresh)
      if (typeof window !== 'undefined' && performance.navigation.type === 1) {
        router.replace('/');
      }
    }
  }, [searchParams, router]);

  return null;
}
