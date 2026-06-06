const form = document.getElementById("formContato");
const toast = document.getElementById("toast");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    mensagem: document.getElementById("mensagem").value
  };

  try {
    const resposta = await fetch("/contato", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      // Mostra a notificação bonita no rodapé
      toast.classList.add("show");

      // Esconde o toast depois de 3 segundos (3000ms)
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);

      form.reset();
    } else {
      alert("Erro ao enviar a mensagem. Tente novamente.");
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
});