import { db } from "../database/database.connection.js";

//GET
export async function getGames(req, res) {
  try {
    const games = await db.query(`SELECT * FROM games;`);
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// export async function getGamesById(req, res) {
//     const {id} = req.params
//     try{
//         const result = await db.query(`
//         SELECT
//             JOIN
//             ON
//             WHERE 
//         `)
//     } catch (err) {
//       res.status(500).send(err.message)  
//     }
// }

//POST
export async function addGame(req, res) {
  try {
    const game = await db.query(`INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES();`)

    res.send(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
