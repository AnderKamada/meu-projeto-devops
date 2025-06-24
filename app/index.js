const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// conexão com o bancoAdd commentMore actions
const pool = new Pool({
  user: 'admin',
  host: 'localhost', // importante: o nome do serviço Docker
  database: 'minhaapi',
  password: 'admin',
  port: 5432,
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("API funcionando. Horário do banco: " + result.rows[0].now);
  } catch (err) {
    res.status(500).send("Erro ao conectar com o banco: " + err.message);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API ouvindo na porta ${port}`);
});

