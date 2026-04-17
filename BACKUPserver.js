//SHITF+ALT+F

//Importando o Express para criar o servidor
const express = require("express");
const app = express();


// Rota para verificar o status do servidor
app.get("/status", (req, res) => {
    res.send("OK");
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/status");
});