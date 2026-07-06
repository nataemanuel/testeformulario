 

    document.addEventListener('DOMContentLoaded', () => {

      // ANIMAÇÃO

      const elements = document.querySelectorAll('.fade');

      const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }

        });

      }, { threshold: 0.2 });

      elements.forEach(el => observer.observe(el));

      // MENU HAMBURGUER

      const menuToggle = document.getElementById('menu-toggle');
      const nav = document.getElementById('nav');

      menuToggle.addEventListener('click', () => {

        nav.classList.toggle('active');

        const icon = menuToggle.querySelector('i');

        if (nav.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }

      });

    });
    // ================= NAV ATIVA AO ROLAR =================

// ================= NAV ATIVA AO ROLAR =================

if (window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/")) {

  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  const observerNav = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        const id = entry.target.getAttribute("id");

        navLinks.forEach(link => {
          link.classList.remove("active");

          if (id && link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });

      }

    });

  }, {
    threshold: 0.6
  });

  sections.forEach(section => observerNav.observe(section));

}

// OBSERVA TODAS AS SEÇÕES
sections.forEach(section => {
  observerNav.observe(section);
});

  
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