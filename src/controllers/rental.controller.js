import { db } from "../database/database.connection.js";
import Joi from "joi";

//GET
export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
      SELECT 
        rentals.id,
        rentals."customerId",
        rentals."gameId",
        to_char(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
        rentals."daysRented",
        to_char(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
        rentals."originalPrice",
        rentals."delayFee",
        customers.id AS "customer_id",
        customers.name AS "customer_name",
        games.id AS "game_id",
        games.name AS "game_name"
      FROM rentals
      JOIN customers ON customers.id = rentals."customerId"
      JOIN games ON games.id = rentals."gameId";
    `);

    const formattedRentals = rentals.rows.map((rental) => {
      return {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customer_id,
          name: rental.customer_name,
        },
        game: {
          id: rental.game_id,
          name: rental.game_name,
        },
      };
    });

    res.send(formattedRentals);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//POST RENT
export async function addRent(req, res) {
  const schema = Joi.object({
    customerId: Joi.number().integer().positive().required(),
    gameId: Joi.number().integer().positive().required(),
    daysRented: Joi.number().integer().positive().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { customerId, gameId, daysRented } = req.body;

  try {
    const customer = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id = $1;
      `,
      [customerId]
    );

    if (customer.rows.length === 0) {
      return res.status(400).json({ error: "Cliente não encontrado." });
    }

    const game = await db.query(
      `
      SELECT *
      FROM games
      WHERE id = $1;
      `,
      [gameId]
    );

    if (game.rows.length === 0) {
      return res.status(400).json({ error: "Jogo não encontrado." });
    }

    const availableGames = await db.query(
      `
      SELECT COUNT(*) AS total_rentals
      FROM rentals
      WHERE "gameId" = $1 AND "returnDate" IS NULL;
      `,
      [gameId]
    );

    const totalRentals = availableGames.rows[0].total_rentals;
    const { quantityInStock } = game.rows[0];

    if (totalRentals >= quantityInStock) {
      return res.status(400).json({ error: "Jogo indisponível para aluguel." });
    }

    const { pricePerDay } = game.rows[0];
    const originalPrice = daysRented * pricePerDay;

    const rent = await db.query(
      `
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee") 
      VALUES ($1, $2, NOW(), $3, $4, NULL, NULL);
      `,
      [customerId, gameId, daysRented, originalPrice]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//POST FINALRENT
export async function finishRent(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(
      `
      SELECT *
      FROM rentals
      WHERE id = $1;
      `,
      [id]
    );

    const rentData = rental.rows[0];

    if (!rentData) {
      return res.status(404).json({ error: "Aluguel não encontrado." });
    }

    if (rentData.returnDate) {
      return res.status(400).json({ error: "Aluguel já finalizado." });
    }

    const rentDate = new Date(rentData.rentDate);
    const daysRented = rentData.daysRented;
    const pricePerDay = rentData.originalPrice / daysRented;

    const currentDate = new Date();
    const delayDays = Math.max(
      0,
      Math.ceil((currentDate - rentDate) / (1000 * 60 * 60 * 24))
    );

    const delayFee = delayDays * pricePerDay;

    await db.query(
      `
      UPDATE rentals
      SET "returnDate" = NOW(), "delayFee" = $1
      WHERE id = $2;
      `,
      [Math.max(0, delayFee), id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//DELETE RENT
export async function deleteRent(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(
      `
      SELECT *
      FROM rentals
      WHERE id = $1;
      `,
      [id]
    );

    if (rental.rows.length === 0) {
      return res.status(404).json({ error: "Aluguel não encontrado." });
    }

    if (rental.rows[0].returnDate) {
      return res
        .status(400)
        .json({ error: "Não é possível excluir um aluguel finalizado." });
    }

    await db.query(
      `
      DELETE FROM rentals
      WHERE id = $1;
      `,
      [id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
