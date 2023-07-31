import { db } from "../database/database.connection.js";

//GET
export async function getGames(req, res) {
  console.log("OI")
  try {
    const games = await db.query(`SELECT * FROM games;`);
    res.send(games.rows);
  } catch (err) {
    res.status(500).json({ error: "Ocorreu um erro ao buscar os jogos." });
  }
}

export async function addGame(req, res) {
  try {
    const { name, image, stockTotal, pricePerDay } = req.body;

    if (!name || !name.trim() || stockTotal <= 0 || pricePerDay <= 0) {
      return res.status(400).send("Campos inválidos.");
    }

    const gameExists = await db.query(
      `SELECT name FROM games WHERE name = $1`,
      [name]
    );
    if (gameExists.rows.length > 0) {
      return res.status(409).send("Jogo já existente.");
    }

    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,
      [name, image, stockTotal, pricePerDay]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
