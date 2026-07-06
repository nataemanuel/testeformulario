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
    .then(() => console.log("✅ MongoDB conectado com sucesso!"))
    .catch(err => {
        console.error("❌ Erro grave ao conectar no MongoDB:");
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

// ENVIAR MENSAGEM (POST)
app.post("/contato", async (req, res) => {
    try {
        console.log("Recebendo dados no backend:", req.body); // Ajuda a ver se os dados chegaram

        const novaMensagem = new Mensagem(req.body);
        await novaMensagem.save();

        res.status(201).json({
            sucesso: true,
            mensagem: "Mensagem enviada!"
        });

    } catch (erro) {
        // AGORA O ERRO APARECE NO TERMINAL:
        console.error("❌ Erro ao salvar a mensagem no banco:", erro); 
        
        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });
    }
});

// LISTAR MENSAGENS (GET)
app.get("/mensagens", async (req, res) => {
    try {
        const mensagens = await Mensagem.find().sort({ data: -1 });
        res.json(mensagens);
    } catch (erro) {
        console.error("❌ Erro ao buscar mensagens:", erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// APAGAR MENSAGEM (DELETE)
app.delete("/mensagens/:id", async (req, res) => {
    try {
        await Mensagem.findByIdAndDelete(req.params.id);
        res.json({
            sucesso: true
        });
    } catch (erro) {
        console.error("❌ Erro ao deletar mensagem:", erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000");
});
