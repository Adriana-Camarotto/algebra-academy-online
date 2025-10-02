import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupabaseDebugPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check authentication
      console.log("🔐 Testing authentication...");
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();
      results.auth = {
        session: !!session,
        user: session?.user?.email || "Not authenticated",
        error: authError,
      };

      // Test 2: Check bookings table
      console.log("📚 Testing bookings table...");
      const {
        data: bookings,
        error: bookingsError,
        count,
      } = await supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .limit(5);

      results.bookings = {
        count,
        sampleData: bookings,
        error: bookingsError,
      };

      // Test 3: Check users table
      console.log("👥 Testing users table...");
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .limit(5);

      results.users = {
        count: users?.length || 0,
        sampleData: users,
        error: usersError,
      };

      // Test 4: Test specific query similar to AdminBookingsPage
      console.log("🔍 Testing AdminBookingsPage query...");
      const { data: adminBookings, error: adminError } = await supabase
        .from("bookings")
        .select("*")
        .order("lesson_date", { ascending: false });

      results.adminQuery = {
        count: adminBookings?.length || 0,
        sampleData: adminBookings?.slice(0, 3),
        error: adminError,
      };

      // Test 5: Check table permissions
      console.log("🔒 Testing table permissions...");
      try {
        const { data: permTest } = await supabase
          .from("bookings")
          .select("id")
          .limit(1);
        results.permissions = {
          canRead: !!permTest,
          message: "Read access confirmed",
        };
      } catch (permError) {
        results.permissions = {
          canRead: false,
          error: permError,
        };
      }
    } catch (error) {
      results.generalError = error;
    }

    setDebugInfo(results);
    setLoading(false);
    console.log("🏁 Diagnostic completed:", results);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Supabase Debug</h1>
        <Button onClick={runDiagnostic} disabled={loading}>
          {loading ? "Running..." : "Run Diagnostic"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.auth, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Bookings Table</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.bookings, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>👥 Users Table</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.users, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Admin Query Test */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Admin Query Test</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.adminQuery, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>🔒 Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.permissions, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* General Error */}
        {debugInfo.generalError && (
          <Card>
            <CardHeader>
              <CardTitle>❌ General Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-red-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo.generalError, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupabaseDebugPage;
