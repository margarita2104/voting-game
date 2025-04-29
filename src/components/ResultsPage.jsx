import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, remove } from "firebase/database";

Chart.register(ArcElement, Tooltip, Legend);

export default function ResultsPage() {
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const playersRef = ref(db, "players");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(Object.values(data));
      }
    });
  }, []);

  useEffect(() => {
    const votesRef = ref(db, "votes");
    onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setVotes(data);
    });
  }, []);

  const handleNext = () => {
    localStorage.removeItem("voted");
    remove(ref(db, "votes"));
    navigate("/vote");
  };

  // Tally vote counts
  const voteCounts = {};
  Object.values(votes).forEach(({ votedFor }) => {
    if (votedFor) {
      voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
    }
  });

  const labels = players;
  const dataValues = players.map((name) => voteCounts[name] || 0);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6",
          "#34d399", "#fcd34d", "#818cf8", "#c084fc", "#f87171", "#86efac", "#fca5a5"
        ],
        borderWidth: 1,
      },
    ],
  };

  const hasVotes = Object.keys(votes).length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          📊 Voting Results
        </h2>

        {hasVotes ? (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
              <Pie data={data} />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 font-medium">
            No votes yet! Let everyone cast their vote 🎯
          </p>
        )}

        <button
          onClick={handleNext}
          className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          🔄 Next Question
        </button>
      </div>
    </div>
  );
}
