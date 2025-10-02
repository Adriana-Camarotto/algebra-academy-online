import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Creating user profile...");

    // Create Supabase client using the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get request body
    const { user_id, email, name, role, avatar } = await req.json();

    console.log("Received user data:", { user_id, email, name, role });

    if (!user_id || !email || !name) {
      throw new Error("Missing required user data: user_id, email, or name");
    }

    // Check if user profile already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means "no rows returned", which is fine
      console.error("Error checking existing user:", checkError);
      throw new Error(`Error checking existing user: ${checkError.message}`);
    }

    if (existingUser) {
      console.log("User profile already exists:", existingUser.id);
      return new Response(
        JSON.stringify({
          success: true,
          message: "User profile already exists",
          user: existingUser,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Create new user profile
    const userData = {
      id: user_id,
      email: email,
      name: name,
      role: role || "student", // Default to student if no role provided
      avatar: avatar || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Creating user profile with data:", userData);

    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      console.error("Error creating user profile:", insertError);
      throw new Error(`Error creating user profile: ${insertError.message}`);
    }

    console.log("User profile created successfully:", newUser.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "User profile created successfully",
        user: newUser,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-user-profile function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: "Error creating user profile",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
