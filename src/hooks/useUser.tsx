import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Role {
  name: string;
}

interface UserRole {
  id: string;
  user_id: string;
  roles: Role;
}

interface UserWithRoles extends User {
  userRoles: UserRole[];
}

export const useUser = () => {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (!supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: userRoles, error } = await supabase
        .from("user_roles")
        .select("*, roles!inner(name)")
        .eq("user_id", supabaseUser.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      const userWithRoles = supabaseUser as UserWithRoles;
      userWithRoles.userRoles = userRoles as UserRole[] || [];

      setUser(userWithRoles);
      setIsLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          fetchUser();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
};
