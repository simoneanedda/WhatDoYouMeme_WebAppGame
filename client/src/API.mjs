import { Meme, Caption } from "./MemeData.mjs";

const SERVER_URL = 'http://localhost:3001';

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };

  const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }
  const getMemeData = async()=>{
    const response = await fetch(SERVER_URL+'/api/memedata' );
    if(response.ok) {
      const memedataJson = await response.json();
      return new Meme(memedataJson.id, memedataJson.path);
    }
    else
      throw new Error('Internal server error');
    }
  const getCaptionsData = async(memeID)=>{
    const response = await fetch(`${SERVER_URL}/api/captions/${memeID}` );
    if(response.ok) {
      const captionsJson = await response.json();
      return captionsJson.map(c => new Caption(c.id, c.text, c.memeID));
    }
    else
      throw new Error('Internal server error');
    }
  const saveGameResult=async (gameData) => {
    const response = await fetch(`${SERVER_URL}/api/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    if(response.ok) {
      const result = await response.text();
      return result;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  }
  const getGameHistory = async (userId) => {
    const response = await fetch(`${SERVER_URL}/api/history/${userId}`);
    if (response.ok) {
      const gameHistoryJson = await response.json();
      return gameHistoryJson;
    } else {
      const errDetails = await response.text();
      throw new Error('Failed to fetch game history: ' + errDetails);
    }
  };
  
const API = {logIn, logOut, getMemeData, getCaptionsData, saveGameResult, getGameHistory};
export default API;