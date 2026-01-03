"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";
import Loading from "../loading";
import Link from "next/link";
import HRDashboard from "@/components/hr/HrDashboard";
import EmployeeDashboard from "@/components/employee/dashabord";

export default function Dashboard() {
  const { user: session, status } = useCurrentUserClient();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You need to be logged in to access this page.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onLogout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8">
        {/* Display HR Dashboard if role is HR */}
        {session.role === "HR" && <HRDashboard />}

        {/* Display Employee Dashboard if role is EMPLOYEE */}
        {session.role === "EMPLOYEE" && <EmployeeDashboard />}
      </main>
    </div>
  );
}
