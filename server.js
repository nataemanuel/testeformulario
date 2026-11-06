
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Somente dois usuários autorizados
const usuariosAdmin = [
  {
    usuario: process.env.ADMIN1_USER,
    senhaHash: process.env.ADMIN1_PASSWORD_HASH
  },
  {
    usuario: process.env.ADMIN2_USER,
    senhaHash: process.env.ADMIN2_PASSWORD_HASH
  }
].filter(u => u.usuario && u.senhaHash);

if (usuariosAdmin.length !== 2) {
  console.error("Configure exatamente dois usuários no .env.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado.");
}

// Configuração do cookie JWT
function opcoesCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/"
  };
}

// Middleware de autenticação
function exigirAutenticacao(req, res, next) {
  const token = req.cookies.token_admin;

  if (!token) {
    if (req.path === "/admin.html" || req.path === "/admin") {
      return res.redirect("/login.html");
    }

    return res.status(401).json({ erro: "Não autenticado." });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.clearCookie("token_admin", opcoesCookie());

    if (req.path === "/admin.html" || req.path === "/admin") {
      return res.redirect("/login.html");
    }

    return res.status(401).json({ erro: "Sessão inválida ou expirada." });
  }
}

// LOGIN
app.post("/auth/login", async (req, res) => {
  try {
    const { usuario, senha } = req.body || {};

    if (!usuario || !senha) {
      return res.status(400).json({
        erro: "Informe usuário e senha."
      });
    }

    const conta = usuariosAdmin.find(
      u => u.usuario === usuario
    );

    if (
      !conta ||
      !(await bcrypt.compare(senha, conta.senhaHash))
    ) {
      return res.status(401).json({
        erro: "Usuário ou senha incorretos."
      });
    }

    const token = jwt.sign(
      { usuario: conta.usuario },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
        issuer: "manga-transportes"
      }
    );

    res.cookie("token_admin", token, opcoesCookie());

    return res.json({
      sucesso: true,
      usuario: conta.usuario
    });

  } catch (erro) {
    console.error("Erro no login:", erro);

    res.status(500).json({
      erro: "Erro interno ao realizar login."
    });
  }
});

// VERIFICAR SESSÃO
app.get("/auth/me", exigirAutenticacao, (req, res) => {
  res.json({
    autenticado: true,
    usuario: req.admin.usuario
  });
});

// SAIR
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token_admin", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });

  res.json({ sucesso: true });
});

// PROTEGER A PÁGINA ADMINISTRATIVA
app.get(["/admin", "/admin.html"], exigirAutenticacao, (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "admin.html")
  );
});

// CONEXÃO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro MongoDB:", err));

// MODELO DE MENSAGENS
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

// MODELO DE FEEDBACKS
const feedbackSchema = new mongoose.Schema({
  nome: String,
  cargo: String,
  estrelas: Number,
  mensagem: String,
  status: {
    type: String,
    default: "pendente"
  },
  data: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// ROTAS PÚBLICAS

app.post("/feedbacks", async (req, res) => {
  try {
    const novoFeedback = new Feedback(req.body);
    await novoFeedback.save();

    res.status(201).json({
      mensagem: "Feedback recebido! Aguardando aprovação."
    });

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao salvar feedback"
    });
  }
});

app.get("/feedbacks/aprovados", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      status: "aprovado"
    }).sort({ data: -1 });

    res.json(feedbacks);

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar feedbacks"
    });
  }
});

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

// ROTAS ADMINISTRATIVAS PROTEGIDAS

app.get("/admin/feedbacks", exigirAutenticacao, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ data: -1 });
    res.json(feedbacks);

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao carregar feedbacks"
    });
  }
});

app.put("/admin/feedbacks/:id/aprovar", exigirAutenticacao, async (req, res) => {
  try {
    await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: "aprovado" }
    );

    res.json({
      mensagem: "Feedback aprovado com sucesso!"
    });

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao aprovar feedback"
    });
  }
});

app.delete("/admin/feedbacks/:id", exigirAutenticacao, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Feedback removido!" });

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao deletar feedback"
    });
  }
});

app.get("/mensagens", exigirAutenticacao, async (req, res) => {
  try {
    const mensagens = await Mensagem.find().sort({ data: -1 });
    res.json(mensagens);

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao listar mensagens."
    });
  }
});

app.delete("/mensagens/:id", exigirAutenticacao, async (req, res) => {
  try {
    await Mensagem.findByIdAndDelete(req.params.id);
    res.json({ sucesso: true });

  } catch (err) {
    res.status(500).json({
      erro: "Erro ao apagar mensagem."
    });
  }
});

// ARQUIVOS PÚBLICOS POR ÚLTIMO
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
