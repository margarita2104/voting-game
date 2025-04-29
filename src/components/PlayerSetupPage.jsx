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
    localStorage.setItem("voterName", cleaned[0]); // Pick first for now
    navigate("/vote");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-100 to-pink-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">🧑‍🤝‍🧑 Setup Players</h2>
        {players.map((name, index) => (
          <div key={index} className="flex space-x-2">
            <input
              className="w-full border rounded px-3 py-1"
              placeholder={`Player ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <button
              onClick={() => removePlayer(index)}
              className="text-red-500 font-bold"
            >
              ✖
            </button>
          </div>
        ))}
        <button onClick={addPlayer} className="w-full bg-blue-500 text-white py-2 rounded">
          ➕ Add Player
        </button>
        <button
          onClick={submitPlayers}
          className="w-full bg-green-500 text-white py-2 rounded font-semibold"
        >
          ✅ Start Game
        </button>
      </div>
    </div>
  );
}
