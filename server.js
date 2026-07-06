const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => {
  console.error("Erro MongoDB:");
  console.error(err);
});

const mensagemSchema = new mongoose.Schema({
    nome: String,
    email: String,
    mensagem: String,
    data: {
        type: Date,
        default: Date.now
    }
});

const Mensagem = mongoose.model("Mensagem", mensagemSchema);


// ENVIAR MENSAGEM
app.post("/contato", async (req, res) => {
    try {
        const novaMensagem = new Mensagem(req.body);

        await novaMensagem.save();

        res.status(201).json({
            sucesso: true,
            mensagem: "Mensagem enviada!"
        });

    } catch (erro) {
        res.status(500).json({
            sucesso: false
        });
    }
});


// LISTAR MENSAGENS
app.get("/mensagens", async (req, res) => {

    const mensagens = await Mensagem.find().sort({ data: -1 });

    res.json(mensagens);
});


// APAGAR MENSAGEM
app.delete("/mensagens/:id", async (req, res) => {

    await Mensagem.findByIdAndDelete(req.params.id);

    res.json({
        sucesso: true
    });

});

app.listen(3000, () => {
    console.log("Servidor rodando");
});
