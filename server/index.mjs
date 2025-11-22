import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {getUser} from './user-dao.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { captionsSelector, memeSelector, saveGameResult, getGameHistory } from './meme_captions-dao.mjs';

const app = express(); 
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { 
  return cb(null, user);
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/* ROUTES */

app.get('/api/memedata', (request, response) => {
  memeSelector()
  .then(meme => response.json(meme))
  .catch(() => response.status(500).end());
});

app.get('/api/captions/:id', (request, response) => {
  captionsSelector(request.params.id)
  .then(captions => response.json(captions))
  .catch(() => response.status(500).end());
});

app.post('/api/result', async (req, res) => {
  try {
    const { userId, score, rounds } = req.body;
    await saveGameResult(userId, score, rounds);
    res.status(201).send("Game results saved successfully");
  } catch (error) {
    res.status(500).json({ error: "Error during the saving of the results" });
  }
});

app.get('/api/history/:userId', (req, res) => {
  const userId = req.params.userId;
  getGameHistory(userId)
    .then(gameHistory => res.json(gameHistory))
    .catch(() => res.status(500).end());
});

app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        return res.status(401).send(info);
      }
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });