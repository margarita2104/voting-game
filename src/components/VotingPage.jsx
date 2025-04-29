import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, update, onValue } from "firebase/database";

export default function VotingPage() {
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(() => localStorage.getItem("voted") === "yes");
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
      setVotes(snapshot.val() || {});
    });
  }, []);

  const handleVote = (votedFor) => {
    if (voted) return;
    const voter = localStorage.getItem("voterName");
    if (!voter) return alert("No voter name set!");

    const voteRef = ref(db, `votes/${voter}`);
    update(voteRef, {
      votedFor,
      timestamp: Date.now(),
    });

    localStorage.setItem("voted", "yes");
    setVoted(true);
  };

  const allVoted = Object.keys(votes).length >= players.length;

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
          disabled={!allVoted}
          className={`mt-6 w-full py-2 rounded-lg font-semibold transition-all ${
            allVoted
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-gray-400 cursor-not-allowed text-white"
          }`}
        >
          🎯 Reveal Results
        </button>
      </div>
    </div>
  );
}
