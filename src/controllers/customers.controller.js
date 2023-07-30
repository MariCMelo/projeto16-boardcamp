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
  const { name, phone, cpf, birthday } = req.body;

  if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    return res.status(400).json({ error: "CPF inválido." });
  }

  if (
    !phone ||
    (phone.length !== 10 && phone.length !== 11) ||
    !/^\d+$/.test(phone)
  ) {
    return res.status(400).json({ error: "Telefone inválido." });
  }

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Nome inválido." });
  }

  if (isNaN(Date.parse(birthday))) {
    return res.status(400).json({ error: "Data de aniversário inválida." });
  }

  try {
    const existingCustomer = await db.query(
      `
      SELECT * 
      FROM customers 
      WHERE cpf = $1;
      `,
      [cpf]
    );

    if (existingCustomer.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "CPF já cadastrado para outro cliente." });
    }

    await db.query(
      `
      INSERT INTO customers (name, phone, cpf, birthday)
      VALUES ($1, $2, $3, $4);
      `,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//PUT CUSTUMER
export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    return res.status(400).json({ error: "CPF inválido." });
  }

  if (
    !phone ||
    (phone.length !== 10 && phone.length !== 11) ||
    !/^\d+$/.test(phone)
  ) {
    return res.status(400).json({ error: "Telefone inválido." });
  }

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Nome inválido." });
  }

  if (isNaN(Date.parse(birthday))) {
    return res.status(400).json({ error: "Data de aniversário inválida." });
  }

  try {
    const existingCustomer = await db.query(
      `
      SELECT * 
      FROM customers 
      WHERE cpf = $1 AND id != $2;
      `,
      [cpf, id]
    );

    if (existingCustomer.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "CPF já cadastrado para outro cliente." });
    }

    const customerToUpdate = await db.query(
      `
      SELECT * 
      FROM customers 
      WHERE id = $1;
      `,
      [id]
    );

    if (customerToUpdate.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    await db.query(
      `
      UPDATE customers 
      SET name = $1, phone = $2, cpf = $3, birthday = $4
      WHERE id = $5;
      `,
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
