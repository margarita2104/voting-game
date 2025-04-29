import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // import db
import { ref, onValue, remove } from "firebase/database"; // import Firebase functions
import players from "../players"; // import hardcoded player names

Chart.register(ArcElement, Tooltip, Legend);

export default function ResultsPage() {
  const [votes, setVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const votesRef = ref(db, "votes");
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setVotes(data);
    });

    // Optional: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    // Clear localStorage
    localStorage.removeItem("voted");

    // Clear Firebase votes
    const votesRef = ref(db, "votes");
    remove(votesRef);

    // Go back to voting
    navigate("/vote");
  };

  const labels = players;
  const dataValues = players.map((name) => votes[name] ? 1 : 0); // If name has a vote, count 1

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

  const hasVotes = dataValues.some((count) => count > 0);

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
