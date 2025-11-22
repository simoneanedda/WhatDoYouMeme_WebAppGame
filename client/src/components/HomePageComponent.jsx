import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css'; 
export function HomePage(props) {
  const navigate = useNavigate();

  const handleGuestPlay = () => {
    navigate('/play');
    props.setIsRegisteredUser(false) 
  };

  const handleRegisteredPlay = () => {
    navigate('/login');
  };

  const navigateToGameRules = () => {
    navigate('/rules'); 
  };

  return (
    <div className="home-page">
      <Container className="text-center">
        <h1 className="my-5">What Do You Meme?</h1>
        <Button variant="primary" size="lg" className="mx-3" onClick={handleGuestPlay}>
          Play as Guest
        </Button>
        <Button variant="secondary" size="lg" className="mx-3" onClick={handleRegisteredPlay}>
          Play as Registered User
        </Button>
        <Button variant="info" size="lg" className="mx-3" onClick={navigateToGameRules}>
          Game Rules
        </Button>
      </Container>
    </div>
  );
}

export function LoggedInUserPageComponent(props) {
  return (
    <Container className="logged-in-user-container mt-4">
      <Row className="mb-3">
        <Col className="text-center">
          <h2>Welcome, {props.user.name}!</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col className="text-center">
          <Link to="/play">
            <Button variant="primary" className="mx-2">Play Game</Button>
          </Link>
          <Link to="/stats">
            <Button variant="secondary" className="mx-2">View Stats</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}