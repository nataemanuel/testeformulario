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



// Modelo MongoDB (Exemplo Mongoose)

const feedbackSchema = new mongoose.Schema({

  nome: String,

  cargo: String,

  estrelas: Number,

  mensagem: String,

  status: { type: String, default: 'pendente' }, // 'pendente' ou 'aprovado'

  data: { type: Date, default: Date.now }

});

const Feedback = mongoose.model('Feedback', feedbackSchema);



// 1. Enviar Feedback (Público)

app.post('/feedbacks', async (req, res) => {

  try {

    const novoFeedback = new Feedback(req.body);

    await novoFeedback.save();

    res.status(201).json({ mensagem: 'Feedback recebido! Aguardando aprovação.' });

  } catch (err) {

    res.status(500).json({ erro: 'Erro ao salvar feedback' });

  }

});



// 2. Buscar Feedbacks Aprovados (Para index.html e feedbacks.html)

app.get('/feedbacks/aprovados', async (req, res) => {

  try {

    const feedbacks = await Feedback.find({ status: 'aprovado' }).sort({ data: -1 });

    res.json(feedbacks);

  } catch (err) {

    res.status(500).json({ erro: 'Erro ao buscar feedbacks' });

  }

});



// 3. Buscar TODOS ou Pendentes (Para admin.html)

app.get('/admin/feedbacks', async (req, res) => {

  try {

    const feedbacks = await Feedback.find().sort({ data: -1 });

    res.json(feedbacks);

  } catch (err) {

    res.status(500).json({ erro: 'Erro ao carregar feedbacks para admin' });

  }

});



// 4. Aprovar Feedback (Para admin.html)

app.put('/admin/feedbacks/:id/aprovar', async (req, res) => {

  try {

    await Feedback.findByIdAndUpdate(req.params.id, { status: 'aprovado' });

    res.json({ mensagem: 'Feedback aprovado com sucesso!' });

  } catch (err) {

    res.status(500).json({ erro: 'Erro ao aprovar feedback' });

  }

});



// 5. Deletar Feedback (Para admin.html)

app.delete('/admin/feedbacks/:id', async (req, res) => {

  try {

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({ mensagem: 'Feedback removido!' });

  } catch (err) {

    res.status(500).json({ erro: 'Erro ao deletar feedback' });

  }

});

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

