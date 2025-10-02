import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, UserRole } from "@/lib/auth";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useSupabaseAuth = () => {
  // Force cache refresh indicator
  console.log(
    "🔥 LOADING NEW VERSION OF useSupabaseAuth - INSTANT LOGIN ENABLED"
  );

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: false, // Start with false - only true during active auth operations
  });
  const { toast } = useToast();
  const { login, logout } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        console.log("🚀 User signed in, processing INSTANT login...");

        // Create user immediately from Supabase data
        let userRole = (session.user.user_metadata?.role ||
          "student") as UserRole;

        // Temporary logic to identify admin users by email
        const adminEmails = [
          "adriana.camarotto1@gmail.com",
          "admin@example.com",
        ];
        if (adminEmails.includes(session.user.email || "")) {
          userRole = "admin";
          console.log("🛡️ Email identified as admin, setting role to admin");
        }

        const userData = {
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
          email: session.user.email || "",
          role: userRole,
          avatar: session.user.user_metadata?.avatar || null,
        };

        console.log(
          "📋 User metadata from Supabase:",
          session.user.user_metadata
        );
        console.log(
          "🎭 Assigned role:",
          userData.role,
          "for email:",
          userData.email
        );

        console.log("⚡ Logging in user immediately:", userData);
        login(userData);

        // Set loading to false immediately - no waiting
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });

        console.log("✅ Login completed instantly, no database dependency");

        // Try to sync with database profile in background (optional)
        setTimeout(async () => {
          try {
            console.log("🔄 Background: Checking for database profile...");
            const { data: dbProfile } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (dbProfile) {
              console.log(
                "🔄 Background: Database profile found, updating store..."
              );
              login({
                id: dbProfile.id,
                name: dbProfile.name,
                email: dbProfile.email,
                role: dbProfile.role as UserRole,
                avatar: dbProfile.avatar,
              });
            } else {
              console.log(
                "🔄 Background: No database profile, creating one..."
              );
              await createUserProfile(session.user);
            }
          } catch (error) {
            console.log(
              "🔄 Background: Profile sync failed, but user login already successful:",
              error
            );
          }
        }, 100); // Very quick background check
      } else if (event === "SIGNED_OUT") {
        logout();
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      } else {
        // For other events, just update session without changing loading
        setAuthState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
        }));
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });

      if (session?.user) {
        // Get user profile from database and sync with Zustand store
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userProfile) {
          login({
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            role: userProfile.role as UserRole,
            avatar: userProfile.avatar,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      console.log("Creating user profile for:", user.id);

      // Use Edge Function to create user profile
      const { data, error } = await supabase.functions.invoke(
        "create-user-profile",
        {
          body: {
            user_id: user.id,
            email: user.email!,
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "User",
            role: user.user_metadata?.role || "student",
            avatar: user.user_metadata?.avatar || null,
          },
        }
      );

      if (error) {
        console.error("Error calling create-user-profile function:", error);

        // Fallback to direct database insertion
        console.log("Attempting fallback profile creation...");
        const { error: directError } = await supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email!,
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "User",
            role: user.user_metadata?.role || "student",
            avatar: user.user_metadata?.avatar,
          },
          { onConflict: "id" }
        );

        if (directError) {
          console.error("Error with fallback profile creation:", directError);
          throw directError;
        }

        console.log("Fallback profile creation successful");
      } else {
        console.log("Profile creation successful via Edge Function:", data);
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error);

      // Final fallback: show user a message but don't block the process
      toast({
        title: "Aviso",
        description:
          "Houve um problema na criação do perfil. Tente fazer login novamente se necessário.",
        variant: "default",
      });
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      name: string;
      role: string;
    }
  ) => {
    console.log("Starting signup process for:", email);
    setAuthState((prev) => ({ ...prev, loading: true }));

    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: userData.name,
          role: userData.role,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      setAuthState((prev) => ({ ...prev, loading: false }));
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    console.log("Signup successful:", data);

    // If user is created but needs email confirmation
    if (data.user && !data.user.email_confirmed_at) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      toast({
        title: "Conta criada!",
        description: "Verifique seu email para confirmar a conta.",
      });
    } else if (data.user) {
      // User is immediately confirmed (might happen in development)
      setAuthState((prev) => ({ ...prev, loading: false }));
      toast({
        title: "Conta criada e confirmada!",
        description: "Bem-vindo! Você já pode fazer login.",
      });

      // Attempt to create profile immediately
      setTimeout(async () => {
        await createUserProfile(data.user);
      }, 1000);
    }

    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    // Timeout de segurança - resetar loading após 5 segundos (muito reduzido)
    const timeoutId = setTimeout(() => {
      console.warn("Login timeout - resetting loading state");
      setAuthState((prev) => ({ ...prev, loading: false }));
      toast({
        title: "Timeout no login",
        description: "O login está demorando muito. Tente novamente.",
        variant: "destructive",
      });
    }, 5000); // Apenas 5 segundos

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      clearTimeout(timeoutId);
      setAuthState((prev) => ({ ...prev, loading: false }));
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    // Clear timeout on success - loading will be reset by onAuthStateChange
    clearTimeout(timeoutId);
    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta!",
    });

    return { data, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
};
