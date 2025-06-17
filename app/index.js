const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// conexão com o banco
const pool = new Pool({
  user: 'postgres',
  host: 'db', // importante: o nome do serviço Docker
  database: 'meubanco',
  password: 'senha123',
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

app.listen(port, () => {
  console.log(`API ouvindo na porta ${port}`);
});
