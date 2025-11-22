import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import MyNavBar from "./components/NavBar";
import { LoginForm } from './components/AuthComponents';
import API from './API.mjs';
import './App.css'
import { HomePage, LoggedInUserPageComponent } from './components/HomePageComponent';
import { GameComponent } from './components/PlayComponents';
import { ProfileComponent } from './components/StatsComponent';
import {GameRulesComponent} from './components/GameRulesComponent';
import NotFound from './components/NotFoundComponent';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); 
  const [message, setMessage] = useState(''); 
  const [user, setUser] = useState('');
  const [isRegisteredUser, setIsRegisteredUser]= useState(false);
  
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setIsRegisteredUser(true);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };
  const navigate=useNavigate();
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    navigate("/");
  };
  return (
    <Routes>
      <Route element={<>
 
        <MyNavBar loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Outlet/>
        </Container>
        </>
      }>
        <Route index element={
          <HomePage setIsRegisteredUser={setIsRegisteredUser}/>
        } />
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/personalarea' /> : <LoginForm login={handleLogin} />
        } />
         <Route path='/play' element={
          <GameComponent isRegisteredUser={isRegisteredUser} user={user} /> 
        } />
         <Route path='/personalarea' element={
          loggedIn ? <LoggedInUserPageComponent user={user} /> : <Navigate replace to='/login' />
        } />
        <Route path='/stats' element={
          loggedIn ? <ProfileComponent user={user} /> : <Navigate replace to='/login' />
        } />
        <Route path='/rules' element={
          <GameRulesComponent/>
        } />
        <Route path='*' element={
          <NotFound/>
        } />
        
      </Route>
    </Routes>
  )
}

export default App
