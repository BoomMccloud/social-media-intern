// src/components/StoreInitializer.tsx
'use client';

import { useRef } from 'react';
import { useChatStore } from '@/store/chat-store';

export function StoreInitializer() {
  const initialized = useRef(false);

  if (!initialized.current) {
    // Initialize any default values if needed
    initialized.current = true;
  }

  return null;
}