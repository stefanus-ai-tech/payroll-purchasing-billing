import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // For development, always return a dummy user
      setUser({
        id: "1",
        email: "test@example.com",
      });
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return {
    user,
    isLoading,
    // Add dummy login/logout functions if needed
    login: () => setUser({ id: "1", email: "test@example.com" }),
    logout: () => setUser(null),
  };
}
