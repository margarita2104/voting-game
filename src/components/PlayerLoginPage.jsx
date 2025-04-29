import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function PlayerLoginPage() {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState("");
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

  const handleStart = () => {
    if (!selected) return alert("Please select your name!");
    localStorage.setItem("voterName", selected);
    localStorage.removeItem("voted");
    navigate("/vote");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/40 to-secondary/20 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold text-primary mb-6">
          🙋‍♀️ Who are you?
        </h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border-2 border-gray-300 p-3 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select your name</option>
          {players.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleStart}
          className="mt-6 w-full bg-primary text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          🚀 Start Voting
        </button>
      </div>
    </div>
  );
}
