import { Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <nav>
        <ul>
          <li><Link to="/papers">Papers</Link></li>
          <li><Link to="/interactions">Interactions</Link></li>
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/graph">Graph</Link></li>
        </ul>
      </nav>

      <main>
        <AppRoutes />
      </main>
    </div>
  );
}
