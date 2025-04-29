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

  const voteCounts = {};
  Object.values(votes).forEach(({ votedFor }) => {
    if (votedFor) {
      voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
    }
  });

  const labels = players;
  const dataValues = players.map((name) => voteCounts[name] || 0);

  const predefinedColors = [
    "#60a5fa",
    "#f472b6",
    "#facc15",
    "#a78bfa",
    "#4ade80",
    "#fb923c",
    "#fcd34d",
    "#34d399",
    "#818cf8",
    "#fca5a5",
    "#c084fc",
    "#86efac",
    "#f87171",
    "#e879f9",
  ];
  const colorMap = labels.map(
    (_, index) => predefinedColors[index % predefinedColors.length]
  );

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colorMap,
        borderWidth: 1,
      },
    ],
  };

  const hasVotes = Object.keys(votes).length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
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
          className="mt-8 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          🔄 Next Question
        </button>
      </div>
    </div>
  );
}
