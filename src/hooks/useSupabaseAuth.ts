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
  console.log("🔥 SISTEMA DE LOGIN CORRIGIDO - VERSÃO OTIMIZADA");

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: false, // Só ativa durante operações de auth
  });

  const { toast } = useToast();
  const { login, logout } = useAuthStore();

  useEffect(() => {
    console.log("🔧 Configurando listeners de autenticação...");

    // Listener para mudanças de estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔄 Auth event: ${event}`, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        console.log("✅ Login detectado - sincronizando perfil...");

        // Mantém loading como true até sincronização completa
        setAuthState({
          user: session.user,
          session,
          loading: true,
        });

        // Busca e sincroniza perfil em background
        try {
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userProfile) {
            console.log("📋 Perfil encontrado:", userProfile.email);
            login({
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              role: userProfile.role as UserRole,
              avatar: userProfile.avatar,
            });
          } else {
            console.log("⚠️ Perfil não encontrado - criando...");
            await createUserProfile(session.user);
          }

          // Só agora define loading como false após sincronização completa
          setAuthState((prev) => ({ ...prev, loading: false }));
        } catch (error) {
          console.warn(
            "⚠️ Erro na sincronização de perfil (não bloqueia login):",
            error
          );
          // Cria perfil básico para não bloquear o login
          login({
            id: session.user.id,
            name: session.user.email?.split("@")[0] || "Usuário",
            email: session.user.email!,
            role: "student",
            avatar: null,
          });

          // Define loading como false também no caso de erro
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      } else if (event === "SIGNED_OUT") {
        console.log("🚪 Logout detectado");
        logout();
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      } else {
        // Para outros eventos, apenas atualiza sessão
        setAuthState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
        }));
      }
    });

    // Verifica sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("🔍 Verificando sessão existente...", session?.user?.email);

      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });

      if (session?.user) {
        // Sincroniza perfil se já logado
        try {
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
        } catch (error) {
          console.warn("Erro ao carregar perfil existente:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      console.log("👤 Criando perfil para:", user.email);

      const userData = {
        id: user.id,
        email: user.email!,
        name:
          user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
        role: user.user_metadata?.role || "student",
        avatar: user.user_metadata?.avatar || null,
      };

      // Usa upsert para evitar conflitos
      const { error: upsertError } = await supabase
        .from("users")
        .upsert(userData, { onConflict: "id" });

      if (upsertError) {
        console.error("❌ Erro ao criar perfil:", upsertError);
        throw upsertError;
      }

      console.log("✅ Perfil criado com sucesso");

      // Atualiza store imediatamente
      login({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        avatar: userData.avatar,
      });
    } catch (error) {
      console.error("❌ Erro crítico na criação de perfil:", error);

      // Fallback: cria perfil básico no store para não bloquear
      login({
        id: user.id,
        name: user.email?.split("@")[0] || "Usuário",
        email: user.email!,
        role: "student",
        avatar: null,
      });

      toast({
        title: "Aviso",
        description:
          "Perfil criado com informações básicas. Você pode atualizá-lo nas configurações.",
        variant: "default",
      });
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { name: string; role: string }
  ) => {
    console.log("📝 Iniciando cadastro para:", email);
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData,
        },
      });

      if (error) {
        console.error("❌ Erro no cadastro:", error);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log("✅ Cadastro realizado:", data.user?.email);

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para confirmar a conta.",
        });
      } else if (data.user) {
        toast({
          title: "Conta criada e confirmada!",
          description: "Bem-vindo! Você já pode fazer login.",
        });
      }

      return { data, error: null };
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("🔑 Iniciando login para:", email);
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Erro no login:", error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log("✅ Login realizado com sucesso!");
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      });

      return { data, error: null };
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    console.log("🚪 Realizando logout...");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Erro no logout:", error);
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log("✅ Logout realizado com sucesso");
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
