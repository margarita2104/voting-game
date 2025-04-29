import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, update, onValue } from "firebase/database";

export default function VotingPage() {
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(
    () => localStorage.getItem("voted") === "yes"
  );
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          👀 Who fits the question best?
        </h2>
        {voted ? (
          <p className="text-green-600 text-center text-lg font-medium">
            ✅ You already voted!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {players.map((name) => (
              <button
                key={name}
                onClick={() => handleVote(name)}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold shadow-sm transition-transform hover:scale-105"
              >
                {name}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => navigate("/results")}
          disabled={!allVoted}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all shadow-md ${
            allVoted
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-gray-300 cursor-not-allowed text-gray-600"
          }`}
        >
          🎯 Reveal Results
        </button>
      </div>
    </div>
  );
}
