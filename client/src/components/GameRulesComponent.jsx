import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export function GameRulesComponent() {
  return (
    <div className="game-rules-page">
      <Container>
        <Row>
          <Col>
            <h2>Game Overview:</h2>
            <p>
              Players receive a random meme image and seven captions. They must select the correct caption that best fits the meme.
            </p>
            <h2>Gameplay:</h2>
            <ul>
              <li>Each round presents a random meme image and seven captions in random order.</li>
              <li>Two of the captions are the best matches for the meme.</li>
              <li>Players have 30 seconds to select the correct caption.</li>
              <li>Choosing one of the two correct captions earns 5 points and ends the round.</li>
              <li>Choosing incorrectly or running out of time results in 0 points.</li>
              <li>The application provides feedback and displays the correct captions.</li>
            </ul>
            <h2>Registered Users:</h2>
            <ul>
              <li>Registered users play a game consisting of 3 rounds.</li>
              <li>Game and round history are recorded after each game.</li>
              <li>A profile page shows round scores, meme images, and total scores.</li>
              <li>Previously shown memes do not repeat in subsequent rounds of the same game.</li>
            </ul>
            <h2>Game End:</h2>
            <ul>
              <li>After 3 rounds, the total game score is displayed.</li>
              <li>Summary includes correctly matched memes and selected captions.</li>
            </ul>
            <h2>Guest Users:</h2>
            <ul>
              <li>Anonymous users can only play a single round game.</li>
              <li>They do not have access to registered user features.</li>
            </ul>
            
          </Col>
        </Row>
      </Container>
      <Link to="/" className="btn btn-primary">Go to HomePage</Link>
    </div>
  );
}
