import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import players from "../players";
import { db } from "../firebase"; 
import { ref, update } from "firebase/database"; 

export default function VotingPage() {
  const [voted, setVoted] = useState(() => localStorage.getItem("voted") === "yes");
  const navigate = useNavigate();

  const handleVote = (name) => {
    if (voted) return;

    const voteRef = ref(db, `votes/${name}`);
    update(voteRef, {
      timestamp: Date.now(), 
    });

    localStorage.setItem("voted", "yes");
    setVoted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-purple-700 mb-4">
          👀 Who fits the question best?
        </h2>
        {voted ? (
          <p className="text-green-600 text-center">✅ You already voted!</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {players.map((name) => (
              <button
                key={name}
                onClick={() => handleVote(name)}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md font-semibold"
              >
                {name}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => navigate("/results")}
          className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold"
        >
          🎯 Reveal Results
        </button>
      </div>
    </div>
  );
}
