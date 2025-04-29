import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, set } from "firebase/database";

export default function PlayerSetupPage() {
  const [players, setPlayers] = useState([""]);
  const navigate = useNavigate();

  const handleNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => setPlayers([...players, ""]);
  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const submitPlayers = () => {
    const cleaned = players.filter((name) => name.trim() !== "");
    const playersRef = ref(db, "players");
    const playersObj = {};
    cleaned.forEach((name, i) => {
      playersObj[`p${i}`] = name;
    });
    set(playersRef, playersObj);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-secondary">
          🎉 Add Players
        </h2>
        {players.map((name, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              className="w-full border-2 border-gray-300 p-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder={`Player ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <button
              onClick={() => removePlayer(index)}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ✖
            </button>
          </div>
        ))}
        <button
          onClick={addPlayer}
          className="w-full bg-accent text-black font-semibold py-2 rounded-xl hover:scale-105 transition-transform"
        >
          ➕ Add Player
        </button>
        <button
          onClick={submitPlayers}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          ✅ Start Game
        </button>
      </div>
    </div>
  );
}
