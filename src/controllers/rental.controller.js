import { db } from "../database/database.connection.js"

//GET
export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT * FROM rentals;`);
    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//POST RENT
export async function addRent(req, res) {
  try {
    const rent = await db.query(`
      INSERT INTO rental (name, image, stockTotal, pricePerDay) 
      VALUES();`);

    res.send(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//POST FINALRENT
export async function finishRent(req, res) {
  try {
  } catch (err) {}
}

//DELETE RENT
export async function deleteRent(req, res) {
  try {
  } catch (err) {}
}
