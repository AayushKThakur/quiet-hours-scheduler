export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)",
      }}
    >
      <div
        className="container"
        style={{
          textAlign: "center",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 12px 24px rgba(0, 55, 255, 0.15)",
          padding: "32px 40px",
        }}
      >
        <h1
          style={{
            color: "#0f172a",
            fontWeight: 800,
            fontSize: "2.7rem",
            marginBottom: "24px",
            letterSpacing: "0.02em",
          }}
        >
          Welcome to Quiet Hours Scheduler
        </h1>
        <p
          style={{
            color: "#334155",
            fontSize: "1.25rem",
            marginBottom: "36px",
            letterSpacing: "0.01em",
          }}
        >
          Schedule your silent study sessions with reminders.
        </p>
        <a
          href="/login"
          style={{
            background: "linear-gradient(45deg, #4f46e5, #3b82f6)",
            color: "white",
            fontWeight: 600,
            padding: "16px 34px",
            borderRadius: "8px",
            boxShadow: "0 6px 12px rgba(59, 130, 246, 0.4)",
            textDecoration: "none",
            fontSize: "1rem",
            letterSpacing: "0.03em",
            display: "inline-block",
            marginTop: "10px",
            transition:
              "background 0.4s ease, transform 0.2s ease, box-shadow 0.3s",
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
