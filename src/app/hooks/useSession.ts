import { useEffect, useState } from 'react';

const STORAGE_KEY = 'alex-session';

function getInitialUserName(): string | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && stored.trim() ? stored : null;
}

export function useSession() {
  const [userName, setUserName] = useState<string | null>(getInitialUserName);

  useEffect(() => {
    if (userName) localStorage.setItem(STORAGE_KEY, userName);
    else localStorage.removeItem(STORAGE_KEY);
  }, [userName]);

  return {
    userName,
    isLoggedIn: userName !== null,
    login: (name: string) => setUserName(name),
    logout: () => setUserName(null),
  };
}
