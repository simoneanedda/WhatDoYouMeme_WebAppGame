import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
import './NavBar.css'; 

function MyNavBar (props) {
  return(
    <Navbar bg='primary' data-bs-theme='dark' className='fixed-navbar'>
      <Container fluid>
        <Link to='/' className='navbar-brand'>What do you meme? WebApp exam edition!</Link> 
        {props.loggedIn ? 
          <LogoutButton logout={props.handleLogout} /> :
          <Link to='/login'className='btn btn-outline-light'>Login</Link>
        }
      </Container>
    </Navbar>
  );
}

export default MyNavBar;
