import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LoginForm.css';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      props.login(credentials);
  };

  return (
  <div className="login-form-container">
      <Row className="justify-content-center align-items-center login-form">
        <Col md={6} className="p-4 shadow-sm rounded bg-light">
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='username' className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type='email' 
                value={username} 
                onChange={ev => setUsername(ev.target.value)} 
                required={true} 
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type='password' 
                value={password} 
                onChange={ev => setPassword(ev.target.value)} 
                required={true} 
                minLength={6} 
                placeholder="Enter your password"
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button type='submit' variant="primary">Login</Button>
              <Link className='btn btn-outline-secondary' to={'/'}>Cancel</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
};

function LogoutButton(props) {
  return(
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };