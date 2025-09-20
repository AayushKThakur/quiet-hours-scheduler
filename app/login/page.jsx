"use client";
import { useState } from "react";
import createClientForBrowser from "@/utils/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const supabase = createClientForBrowser();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Check your email to confirm sign up!");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const supabase = createClientForBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Login successful! Redirecting...");
  };

  return (
    <form className="flex flex-col gap-2 max-w-xs mx-auto mt-24">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Login
        </button>
        <button
          onClick={handleSignUp}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {message && <div className="text-green-600">{message}</div>}
    </form>
  );
}
