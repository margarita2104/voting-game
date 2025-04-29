import { Routes, Route, Navigate } from "react-router-dom";
import PlayerSetupPage from "./components/PlayerSetupPage";
import PlayerLoginPage from "./components/PlayerLoginPage";
import VotingPage from "./components/VotingPage";
import ResultsPage from "./components/ResultsPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/setup" />} />
        <Route path="/setup" element={<PlayerSetupPage />} />
        <Route path="/login" element={<PlayerLoginPage />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
  );
}

export default App;
