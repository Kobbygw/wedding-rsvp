import { useState, useEffect } from 'react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("vow_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // A simple hardcoded passcode for the couple
    if (password === "vow2026") {
      localStorage.setItem("vow_admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError(true);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", padding: 24 }}>
      <form onSubmit={handleLogin} className="card stack" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="serif" style={{ textAlign: "center", fontSize: 28 }}>Couple's Portal</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", marginBottom: 16 }}>
          Please enter your passcode to access your dashboard.
        </p>
        
        <input 
          type="password" 
          className="input" 
          placeholder="Passcode" 
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
        />
        {error && <p style={{ color: "var(--red)", fontSize: 12 }}>Incorrect passcode.</p>}
        
        <button type="submit" className="btn btn-gold" style={{ marginTop: 8, width: "100%" }}>Enter</button>
      </form>
    </div>
  );
}
