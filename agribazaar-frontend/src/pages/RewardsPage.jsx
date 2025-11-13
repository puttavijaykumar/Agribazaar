import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const RewardsPage = () => {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    AuthService.fetchRewardPoints().then(data => setPoints(data.reward_points));
    AuthService.fetchRewardHistory().then(data => setHistory(data));
  }, []);

  return (
    <div>
      <h2>Rewards</h2>
      <p>Total Points: {points}</p>
      <h3>History</h3>
      {history.length > 0 ? (
        history.map(tx => (
          <div key={tx.id}>
            {tx.description}: {tx.points} pts - {new Date(tx.created_at).toLocaleString()}
          </div>
        ))
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
};

export default RewardsPage;
