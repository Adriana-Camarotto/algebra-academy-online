import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StudentSidebar from "@/components/student/StudentSidebar";

const StudentDashboardLayout: React.FC = () => {
  const { user } = useAuthStore();

  // Debug: verificar o estado do usuário
  console.log("User object:", user);
  console.log("User role:", user?.role);

  // Temporarily allow access for debugging - TODO: fix auth integration
  // Redirect if not a student
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This area is only accessible to students.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <StudentSidebar />

        <main className="flex-1 p-6 h-[auto] mb-[50px] bg-gray-50 min-h-0">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboardLayout;
