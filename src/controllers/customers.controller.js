import { db } from "../database/database.connection.js";

// GET
export async function getCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers`)
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//GET by ID
export async function getCustomersById(req, res) {
  const {id} = req.params
  try{
      const result = await db.query(`
      SELECT
          JOIN
          ON
          WHERE 
      `)
  } catch (err) {
    res.status(500).send(err.message)  
  }
}

//POST CUSTOMER
export async function addCustomer(req, res) {
  try {
    const game = await db.query(`
    INSERT INTO customers (name, image, stockTotal, pricePerDay) 
    VALUES();`)

    res.send(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

//PUT CUSTUMER
export async function updateCustomer(req, res) {
  try {
    const updatedCostumer = await db.query(`
    UPDATE costumers 
    SET 
    WHERE`)
  } catch (err) {

  }
}