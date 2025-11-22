import React, { useState, useEffect } from 'react';
import API from '../API';
import './ProfileComponent.css';
import { Link } from 'react-router-dom';

export function ProfileComponent(props) {
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const fetchGameHistory = async () => {
      const history = await API.getGameHistory(props.user.id);
      setGameHistory(history);
    };

    fetchGameHistory();
  }, [props.user.id]);

  return (
    <div className="profile-container">
      <h2>Game History</h2>
      <div className="scrollable-container">
        {gameHistory.map((game) => (
          <div key={game.id} className="game-summary">
            <h3>Game on {new Date(game.timestamp).toLocaleDateString()}</h3>
            <p>Total Score: {game.score}</p>
            {game.rounds.map((round, index) => (
              <div key={index} className="round-summary">
                <p>Meme:</p>
                <img src={round.memePath} alt="Meme" className="meme-image" />
                <p>Selected caption: {round.caption}</p>
                <p>Score: {round.score}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Link to="/personalarea" className="btn btn-primary btn-return-personal-area">Go to Personal Area</Link>
    </div>
  );
}
