import React, { useState, useEffect } from 'react';
import API from '../API';
import { useNavigate,Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './PlayComponents.css';
export function GameComponent (props) {
  const [round, setRound] = useState(1);
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [correctCaptions, setCorrectCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shownMemes, setShownMemes] = useState([]);
  const [roundResults, setRoundResults] = useState([]); 
  const [correctlyAnsweredMemes, setCorrectlyAnsweredMemes] = useState([]);
  const navigate = useNavigate();


  const fetchMemeData = async () => {
        let meme;
        do {
          meme = await API.getMemeData();
        } while (shownMemes.includes(meme.id));
        setMeme(meme);
        setShownMemes([...shownMemes, meme.id]);
        if (shownMemes.length==9) setShownMemes([]);
        const captions = await API.getCaptionsData(meme.id);
        setCaptions(captions);
        const correctCaptions = captions.filter(caption => caption.memeID === meme.id);
        setCorrectCaptions(correctCaptions);
  };

  useEffect(() => {
    fetchMemeData();
  }, [round]);

  const handleCaptionSelect = (caption) => {
    setSelectedCaption(caption);
    if (caption.memeID===meme.id) {
      setScore((prevScore) => prevScore + 5);
      setCorrectlyAnsweredMemes([...correctlyAnsweredMemes, { memePath: meme.path, caption: caption.text }]);
    }
    setRoundResults((prevResults) => [
      ...prevResults,
      {
        memeId: meme.id,
        caption: caption.text,
        score: caption.memeID === meme.id ? 5 : 0,
        memePath: meme.path
      },
    ]);
  };

  const saveGameResult = async () => {
    const gameData = {
      userId: props.user.id,
      score: score,
      rounds: roundResults,
    };

    try {
      await API.saveGameResult(gameData);
    } catch (error) {
      console.error("Error saving game result:", error);
    }
  };

  const nextRound = () => {
    if (props.isRegisteredUser && round < 3) {
      setRound(round + 1);
      setSelectedCaption(null);
      setTimeUp(false);
    } else {
      if (props.isRegisteredUser) {
        setGameOver(true);
        saveGameResult();
      } else navigate("/");
    }
  };

  const resetGame = () => {
    setRound(1);
    setMeme(null);
    setCaptions([]);
    setCorrectCaptions([]);
    setSelectedCaption(null);
    setScore(0);
    setTimeUp(false);
    setGameOver(false);
    setShownMemes([]);
    setRoundResults([]);
    setCorrectlyAnsweredMemes([]);
    fetchMemeData();
  };

  return (
    <div className="game-container">
      {gameOver ? (
        <GameSummaryComponent score={score} 
        isRegisteredUser={props.isRegisteredUser} 
        correctlyAnsweredMemes={correctlyAnsweredMemes}
        handlePlayAgain={resetGame} />
      ) : (
        <>
          {timeUp || selectedCaption ? (
            <RoundSummaryComponent
              isRegisteredUser={props.isRegisteredUser}
              correctCaptions={correctCaptions}
              selectedCaption={selectedCaption}
              handlePlayAgain={resetGame}
              nextRound={nextRound}
              timeUp={timeUp}
            />
          ) : (
            <>
              <MemeComponent meme={meme} />
              <CaptionsComponent
                captions={captions}
                onCaptionSelect={handleCaptionSelect}
                timeUp={timeUp}
              />
              <TimerComponent setTimeUp={setTimeUp} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export function MemeComponent (props) {
 
  const imagePath = (props.meme && `${props.meme.path}`);

  return (
    <div className="meme-container">
      <img src={imagePath} alt="Meme" className="meme-image" />
    </div>
  );
};

  export function CaptionsComponent (props){
    return (
      <div className="captions-container">
        {props.captions.map((caption, index) => (
          <button 
            key={index} 
            onClick={() => props.onCaptionSelect(caption)} 
            disabled={props.timeUp}
            className="caption-button"
          >
            {caption.text}
          </button>
        ))}
      </div>
    );
  };
  

  export function RoundSummaryComponent(props) {
    const isCorrect = props.correctCaptions.includes(props.selectedCaption);
    return (
      <div className="round-summary">
        <h3>{props.timeUp ? 'No more time!' : (isCorrect ? 'Correct!' : 'Wrong!')}</h3>
        {!isCorrect && (
          <div>
            <p>The correct captions were:</p>
            <ul>
              {props.correctCaptions.map((caption, index) => (
                <li key={index}>{caption.text}</li>
              ))}
            </ul>
          </div>
        )}
        <Button onClick={props.nextRound}>{props.isRegisteredUser ? 'Next' : 'Go to homepage'}</Button>
        <div> {props.isRegisteredUser ? "" : <Link onClick={props.handlePlayAgain} className="btn btn-secondary mt-2">
          Play Again
        </Link>}</div>
      </div>
    );
  };

  export function GameSummaryComponent (props) {
    return (
      <div className="game-summary">
      <h2>Game Over!</h2>
      <p>Your total score is: {props.score}</p>

      {props.correctlyAnsweredMemes.length > 0 && (
        <div className="correctly-answered">
          <h4>Correctly Answered Memes:</h4>
          <ul className="answered-memes-list">
            {props.correctlyAnsweredMemes.map((item, index) => (
              <li key={index} className="answered-meme-item">
                <img src={item.memePath} alt="Meme" className="meme-thumbnail" />
                <p className="caption-text">Selected Caption: {item.caption}</p>
                <p></p>
              </li>
            ))}
          </ul>
        </div>
      )}

        <Link onClick={props.handlePlayAgain} className="btn btn-primary mt-3 me-2">
          Play Again
        </Link>

        <Link to={"/personalarea"} className="btn btn-secondary mt-3">
          Go to Personal Area
        </Link>
    </div>
    );
  };
  
  export function TimerComponent (props) {
    const [timeLeft, setTimeLeft] = useState(30);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
  
      if (timeLeft <= 0) {
        clearInterval(timer);
        props.setTimeUp(true);
      }
  
      return () => clearInterval(timer);
    }, [timeLeft, props.setTimeUp]);
  
    return (
      <div className="timer">
        <p>Time Left: {timeLeft}s</p>
      </div>
    );
  };