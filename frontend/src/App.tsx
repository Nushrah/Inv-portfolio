import { Link, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <span className="brand">Portfolio Dashboard</span>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<p className="muted">Setup complete. Auth and dashboard coming next.</p>}
          />
        </Routes>
      </main>
    </div>
  );
}
