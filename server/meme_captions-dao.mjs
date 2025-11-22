import { Meme, Caption } from '../client/src/MemeData.mjs';
import { db } from './db.mjs';

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

export const memeSelector = () => {
  console.log("inside");
  const nmemes=10;
  return new Promise((resolve, reject) => {
    let id=(getRandomInt(nmemes))+1;
    const sql = 'SELECT memeID, memePATH FROM memes WHERE memeID=?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else {
        const meme = new Meme(row.memeID, row.memePATH);
        console.log(meme);
        resolve(meme);
      }
    });
  });
}

export const captionsSelector = (memeID) => {
  const ncaptions = 50;
  return new Promise((resolve, reject) => {
    const sql = 'SELECT captionID, captionTEXT, memeID FROM captions WHERE memeID=?';
    db.all(sql, [memeID], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const correctCaptions = rows.map((c) => new Caption(c.captionID, c.captionTEXT, c.memeID));
        let id1, id2, id3, id4, id5;

        do { id1 = getRandomInt(ncaptions) + 1; } while (correctCaptions.some(c => c.id === id1));
        do { id2 = getRandomInt(ncaptions) + 1; } while (correctCaptions.some(c => c.id === id2) || id2 === id1);
        do { id3 = getRandomInt(ncaptions) + 1; } while (correctCaptions.some(c => c.id === id3) || id3 === id1 || id3 === id2);
        do { id4 = getRandomInt(ncaptions) + 1; } while (correctCaptions.some(c => c.id === id4) || id4 === id1 || id4 === id2 || id4 === id3);
        do { id5 = getRandomInt(ncaptions) + 1; } while (correctCaptions.some(c => c.id === id5) || id5 === id1 || id5 === id2 || id5 === id3 || id5 === id4);

        const sql2 = 'SELECT captionID, captionTEXT, memeID FROM captions WHERE captionID IN (?, ?, ?, ?, ?)';
        db.all(sql2, [id1, id2, id3, id4, id5], (err, rows2) => {
          if (err) {
            reject(err);
          } else {
            shuffle(correctCaptions);
            const selectedCorrectCaptions = correctCaptions.slice(0, 2);
            const wrongCaptions = rows2.map((c) => new Caption(c.captionID, c.captionTEXT, c.memeID));
            const captions = selectedCorrectCaptions.concat(wrongCaptions);
            shuffle(captions);
            resolve(captions);
          }
        });
      }
    });
  });
};

export const saveGameResult = (userId, score, rounds) => {
  console.log(rounds);
  return new Promise((resolve, reject) => {
    const sqlInsertGame = 'INSERT INTO gameResults (userId, score, timestamp) VALUES (?, ?, ?)';
    const sqlInsertRound = 'INSERT INTO roundResults (gameId, memeId, caption, score, memePath) VALUES (?, ?, ?, ?, ?)';

    db.run(sqlInsertGame, [userId, score, new Date().toISOString()], function (err) {
      if (err) {
        reject(err);
      } else {
        const gameId = this.lastID;
        const roundPromises = rounds.map(round => {
          return new Promise((resolve, reject) => {
            db.run(sqlInsertRound, [gameId, round.memeId, round.caption, round.score, round.memePath], (roundErr) => {
              if (roundErr) {
                reject(roundErr);
              } else {
                resolve();
              }
            });
          });
        });

        Promise.all(roundPromises)
          .then(() => resolve({ success: true }))
          .catch(reject);
      }
    });
  });
};

export const getGameHistory = (userId) => {
  console.log(`Fetching game history for user: ${userId}`);
  return new Promise((resolve, reject) => {
    const getGameHistorySQL = `
      SELECT g.gameId, g.score, g.timestamp, r.memeId, r.caption, r.score as roundScore, r.memePath
      FROM gameResults g
      JOIN roundResults r ON g.gameId = r.gameId
      WHERE g.userId = ?
      ORDER BY g.timestamp DESC
    `;

    db.all(getGameHistorySQL, [userId], (err, rows) => {
      if (err) {
        console.error('Error fetching game history:', err);
        reject(err);
      } else {
        console.log('Fetched rows:', rows);
        const gameHistory = {};

        rows.forEach(row => {
          if (!gameHistory[row.gameId]) {
            gameHistory[row.gameId] = {
              id: row.gameId,
              score: row.score,
              timestamp: row.timestamp,
              rounds: []
            };
          }
          gameHistory[row.gameId].rounds.push({
            memeId: row.memeId,
            caption: row.caption,
            score: row.roundScore,
            memePath: row.memePath
          });
        });

        console.log('Game history:', gameHistory);
        resolve(Object.values(gameHistory));
      }
    });
  });
};