import { Routes, Route, Navigate } from "react-router-dom";
import PapersPage from "../pages/PapersPage";
import InteractionsPage from "../pages/InteractionsPage";
import SearchPage from "../pages/SearchPage";
import GraphPage from "../pages/GraphPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/papers" replace />} />
      <Route path="/papers" element={<PapersPage />} />
      <Route path="/interactions" element={<InteractionsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/graph" element={<GraphPage />} />
    </Routes>
  );
}
