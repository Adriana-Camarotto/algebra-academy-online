import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language } from "./i18n";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Define user roles
export type UserRole = "student" | "parent" | "tutor" | "admin" | "service";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  language: Language;
  supabaseUser: SupabaseUser | null;
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
  setSupabaseUser: (user: SupabaseUser | null) => void;
  signInWithSupabase: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null }>;
  signUpWithSupabase: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<{ user: User | null; error: string | null }>;
  signOutWithSupabase: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      language: "en",
      supabaseUser: null,
      login: (user) => {
        console.log("Logging in user:", user);
        set({ user, isAuthenticated: true });
      },
      logout: () =>
        set({ user: null, isAuthenticated: false, supabaseUser: null }),
      setLanguage: (language) => set({ language }),
      setSupabaseUser: (supabaseUser) => set({ supabaseUser }),

      signInWithSupabase: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Supabase sign in error:", error);
            return { user: null, error: error.message };
          }

          if (data.user) {
            // Set the Supabase user
            set({ supabaseUser: data.user });

            // Try to get user profile from database
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("id", data.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching user profile:", profileError);
              // If profile doesn't exist, create one with default role
              const { data: newProfile, error: createError } = await supabase
                .from("users")
                .insert([
                  {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.email?.split("@")[0] || "User",
                    role: "student",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  },
                ])
                .select()
                .single();

              if (createError) {
                console.error("Error creating user profile:", createError);
                return { user: null, error: "Failed to create user profile" };
              }

              const user: User = {
                id: newProfile.id,
                name: newProfile.name,
                email: newProfile.email,
                role: newProfile.role as UserRole,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  newProfile.name
                )}&background=4267ac&color=fff`,
              };

              set({ user, isAuthenticated: true });
              return { user, error: null };
            }

            const user: User = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              avatar:
                profile.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=4267ac&color=fff`,
            };

            set({ user, isAuthenticated: true });
            return { user, error: null };
          }

          return { user: null, error: "Authentication failed" };
        } catch (error) {
          console.error("Sign in error:", error);
          return { user: null, error: "Authentication failed" };
        }
      },

      signUpWithSupabase: async (
        email: string,
        password: string,
        name: string,
        role: UserRole
      ) => {
        try {
          console.log("Starting signup process...");

          // First, sign up the user with Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
                role: role,
              },
            },
          });

          if (error) {
            console.error("Supabase sign up error:", error);
            return { user: null, error: error.message };
          }

          console.log("Supabase signup successful:", data);

          if (data.user) {
            // Set the Supabase user
            set({ supabaseUser: data.user });

            // Wait for the session to be established
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Try multiple approaches to create the user profile
            console.log("Creating user profile...", {
              id: data.user.id,
              email: data.user.email,
              name,
              role,
            });

            // Method 1: Try direct database insert first
            console.log("Attempting direct database insert...");
            try {
              const { data: profile, error: profileError } = await supabase
                .from("users")
                .upsert(
                  [
                    {
                      id: data.user.id,
                      email: data.user.email || email,
                      name,
                      role,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    },
                  ],
                  {
                    onConflict: "id",
                  }
                )
                .select()
                .single();

              if (!profileError && profile) {
                console.log(
                  "Profile created successfully via direct insert:",
                  profile
                );
                const user: User = {
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.name
                  )}&background=4267ac&color=fff`,
                };

                set({ user, isAuthenticated: true });
                return { user, error: null };
              }

              console.log(
                "Direct insert failed, trying Edge Function...",
                profileError
              );
              throw new Error(
                `Direct insert failed: ${
                  profileError?.message || "Unknown error"
                }`
              );
            } catch (directError) {
              console.log("Direct insert error:", directError);

              // Method 2: Try Edge Function (if deployed)
              try {
                const { data: session } = await supabase.auth.getSession();

                if (!session?.session?.access_token) {
                  throw new Error("No access token available");
                }

                const { data: functionData, error: functionError } =
                  await supabase.functions.invoke("create-user-profile", {
                    body: { name, role },
                    headers: {
                      Authorization: `Bearer ${session.session.access_token}`,
                    },
                  });

                if (functionError) {
                  console.error("Edge Function error:", functionError);
                  throw new Error(
                    `Edge Function failed: ${functionError.message}`
                  );
                }

                const profile = functionData.profile;
                console.log(
                  "Profile created successfully via Edge Function:",
                  profile
                );

                const user: User = {
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.name
                  )}&background=4267ac&color=fff`,
                };

                set({ user, isAuthenticated: true });
                return { user, error: null };
              } catch (edgeFunctionError) {
                console.error("Edge Function also failed:", edgeFunctionError);

                // Method 3: Fallback - create user object with auth data only
                console.log(
                  "Using fallback method - creating user object without database profile"
                );
                const user: User = {
                  id: data.user.id,
                  name,
                  email: data.user.email || email,
                  role,
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    name
                  )}&background=4267ac&color=fff`,
                };

                set({ user, isAuthenticated: true });

                return {
                  user,
                  error: null, // Changed to null so user gets a clean experience
                };
              }
            }
          }

          return { user: null, error: "Registration failed" };
        } catch (error) {
          console.error("Sign up error:", error);
          return { user: null, error: "Registration failed" };
        }
      },

      signOutWithSupabase: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Sign out error:", error);
          }
        } catch (error) {
          console.error("Sign out error:", error);
        } finally {
          set({ user: null, isAuthenticated: false, supabaseUser: null });
        }
      },

      initializeAuth: async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error);
            return;
          }

          if (session?.user) {
            set({ supabaseUser: session.user });

            // Try to get user profile from database
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching user profile:", profileError);
              return;
            }

            const user: User = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              avatar:
                profile.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=4267ac&color=fff`,
            };

            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error("Initialize auth error:", error);
        }
      },
    }),
    {
      name: "math-tutor-auth",
    }
  )
);

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log("Auth state changed:", event, session?.user?.id);

  const store = useAuthStore.getState();

  if (event === "SIGNED_IN" && session?.user) {
    store.setSupabaseUser(session.user);

    // Try to get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!profileError && profile) {
      const user: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        avatar:
          profile.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=4267ac&color=fff`,
      };

      store.login(user);
    }
  } else if (event === "SIGNED_OUT") {
    store.logout();
  }
});

// Helper function to check if user has a specific role
export const hasRole = (
  user: User | null,
  roles: UserRole | UserRole[]
): boolean => {
  if (!user) return false;

  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }

  return user.role === roles;
};

// Mock user data for demo purposes (to be replaced with real authentication)
// Using proper UUID format for compatibility with database
export const mockUsers: Record<string, User> = {
  student1: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Alice Student",
    email: "alice@example.com",
    role: "student",
    avatar:
      "https://ui-avatars.com/api/?name=Alice+Student&background=4267ac&color=fff",
  },
  parent1: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Bob Parent",
    email: "bob@example.com",
    role: "parent",
    avatar:
      "https://ui-avatars.com/api/?name=Bob+Parent&background=7e57c2&color=fff",
  },
  parent2: {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Maria Responsável",
    email: "maria@example.com",
    role: "parent",
    avatar:
      "https://ui-avatars.com/api/?name=Maria+Responsável&background=7e57c2&color=fff",
  },
  tutor1: {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Carol Tutor",
    email: "carol@example.com",
    role: "tutor",
    avatar:
      "https://ui-avatars.com/api/?name=Carol+Tutor&background=00bcd4&color=fff",
  },
  admin1: {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "David Admin",
    email: "david@example.com",
    role: "admin",
    avatar:
      "https://ui-avatars.com/api/?name=David+Admin&background=ff5722&color=fff",
  },
  service1: {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Eve Service",
    email: "eve@example.com",
    role: "service",
    avatar:
      "https://ui-avatars.com/api/?name=Eve+Service&background=009688&color=fff",
  },
};

// Helper function to resolve mock user by key or return full user object
export const resolveUser = (userOrKey: User | string): User | null => {
  console.log("=== RESOLVING USER ===");
  console.log("Input userOrKey:", userOrKey);
  console.log("Type of input:", typeof userOrKey);

  if (!userOrKey) {
    console.log("No user provided, returning null");
    return null;
  }

  // If it's already a User object with proper UUID, return it
  if (
    typeof userOrKey === "object" &&
    userOrKey.id &&
    userOrKey.id.includes("-")
  ) {
    console.log("User already resolved with UUID:", userOrKey.id);
    console.log("User object:", userOrKey);
    return userOrKey;
  }

  // If it's a mock key, resolve to the actual user object
  if (typeof userOrKey === "string") {
    console.log("Resolving mock key:", userOrKey);
    const resolvedUser = mockUsers[userOrKey];
    if (resolvedUser) {
      console.log("Resolved mock key", userOrKey, "to UUID:", resolvedUser.id);
      console.log("Resolved user object:", resolvedUser);
      return resolvedUser;
    } else {
      console.log("Mock key not found in mockUsers:", Object.keys(mockUsers));
    }
  }

  console.error(
    "Could not resolve user - no valid UUID or mock key found:",
    userOrKey
  );
  return null;
};
