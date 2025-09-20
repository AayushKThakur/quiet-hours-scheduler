"use client";
import { useEffect, useState } from "react";
import createClientForBrowser from "@/utils/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientForBrowser();
    supabase.auth.getUser().then(({ data, error }) => {
      if (!data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClientForBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user)
    return <div className="text-center mt-20">Checking authentication...</div>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 border rounded bg-white flex flex-col items-center gap-4">
      <div>
        Welcome, <span className="font-bold">{user.email}</span>!
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}
