import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const show = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  return [toast, show] as const;
}
