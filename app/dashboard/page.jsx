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
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h2>Welcome, {user.email}</h2>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <form onSubmit={addBlock}>
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>

        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Adding..." : "Add Silent Study Block"}
        </button>
      </form>

      <div>
        <h3>Your Silent Study Blocks</h3>

        {blocks.length === 0 ? (
          <p>No study blocks yet</p>
        ) : (
          <ul>
            {blocks.map((block) => (
              <li key={block._id} className="study-block">
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(block.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(block.end_time).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
