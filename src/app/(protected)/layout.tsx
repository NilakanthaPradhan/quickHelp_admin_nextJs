"use client";

import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Basic auth check
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "ADMIN") {
        router.push("/login");
      } else {
        setAuthorized(true);
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!authorized) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-950">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
