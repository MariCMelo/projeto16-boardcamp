import { db } from "../database/database.connection.js";

// GET
export async function getCustomers(req, res) {
  try {
   
    const customers = await db.query(`SELECT * FROM customers`);
    res.send(customers.rows);
  } catch (err) {
    res.status(500).json({ error: "Ocorreu um erro ao buscar os clientes." });
  }
}

//GET by ID
export async function getCustomersById(req, res) {
  const { id } = req.params;

  try { 
    console.log("teste clientes");
    const result = await db.query(
      `
      SELECT * 
        FROM customers 
        WHERE customers.id = $1;
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    res.send(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//POST CUSTOMER
export async function addCustomer(req, res) {
  try {
    const game = await db.query(`
    INSERT INTO customers (name, image, stockTotal, pricePerDay) 
    VALUES();`);

    res.send(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//PUT CUSTUMER
export async function updateCustomer(req, res) {
  try {
    const updatedCustomer = await db.query(`
    UPDATE customers 
    SET 
    WHERE`);
  } catch (err) {}
}
