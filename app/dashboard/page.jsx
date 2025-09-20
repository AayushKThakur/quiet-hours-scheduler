"use client";
import { useEffect, useState } from "react";
import createClientForBrowser from "@/utils/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientForBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        fetchBlocks();
      }
    });
  }, [router]);

  async function fetchBlocks() {
    try {
      const res = await fetch("/api/study-blocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data);
      } else {
        setError("Failed to load blocks");
      }
    } catch {
      setError("Failed to load blocks");
    }
  }

  async function addBlock(e) {
    e.preventDefault();
    setError("");
    if (!startTime || !endTime) {
      setError("Please provide start and end times");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/study-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_time: startTime, end_time: endTime }),
      });
      if (res.ok) {
        setStartTime("");
        setEndTime("");
        fetchBlocks();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add block");
      }
    } catch {
      setError("Failed to add block");
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    const supabase = createClientForBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user)
    return <div className="text-center mt-20">Checking authentication...</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 border rounded bg-white flex flex-col gap-6">
      <h2 className="text-center text-2xl font-semibold">
        Welcome, {user.email}
      </h2>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded self-end"
      >
        Logout
      </button>

      <form onSubmit={addBlock} className="flex flex-col gap-4">
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </label>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Adding..." : "Add Silent Study Block"}
        </button>
      </form>

      <h3 className="text-xl font-semibold">Your Silent Study Blocks</h3>
      {blocks.length === 0 && <p>No study blocks yet</p>}
      <ul className="space-y-2">
        {blocks.map((block) => (
          <li key={block._id} className="border p-3 rounded bg-gray-50">
            <div>
              <strong>Start:</strong>{" "}
              {new Date(block.start_time).toLocaleString()}
            </div>
            <div>
              <strong>End:</strong> {new Date(block.end_time).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
