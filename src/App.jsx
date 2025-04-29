import { Routes, Route, Navigate } from "react-router-dom";
import VotingPage from "./components/VotingPage";
import ResultsPage from "./components/ResultsPage";
import PlayerSetupPage from "./components/PlayerSetupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/setup" />} />
      <Route path="/setup" element={<PlayerSetupPage />} />
      <Route path="/vote" element={<VotingPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}

export default App;
