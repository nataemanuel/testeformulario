document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. ANIMAÇÕES =================
  const elements = document.querySelectorAll('.fade');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
      }
    });
  }, { threshold: 0.2 });
  elements.forEach(el => observer.observe(el));


  // ================= 2. MENU HAMBÚRGUER =================
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
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
  }


  // ================= 3. CARROSSEL SWIPER =================
  const carouselEl = document.querySelector('.servicos-carousel');
  if (carouselEl && typeof Swiper !== 'undefined') {
    new Swiper('.servicos-carousel', {
      slidesPerView: 1.12,
      spaceBetween: 18,
      centeredSlides: true,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        480: { slidesPerView: 1.15, spaceBetween: 22, centeredSlides: true },
        768: { slidesPerView: 2.2, spaceBetween: 30, centeredSlides: false },
        1024: { slidesPerView: 3, spaceBetween: 35, centeredSlides: false, allowTouchMove: false }
      }
    });
  }


  // ================= 4. FORMULÁRIO DE CONTATO =================
  const formContato = document.getElementById("formContato");
  const toast = document.getElementById("toast");

  if (formContato) {
    formContato.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dados = {
        nome: document.getElementById("nome")?.value || "",
        email: document.getElementById("email")?.value || "",
        mensagem: document.getElementById("mensagem")?.value || ""
      };

      try {
        const resposta = await fetch("/contato", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        });

        if (resposta.ok) {
          if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 3000);
          }
          formContato.reset();
        } else {
          alert("Erro ao enviar a mensagem. Tente novamente.");
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
      }
    });
  }


  // ================= 5. MODAL & ENVIO DE FEEDBACK =================
  const modal = document.getElementById("modalFeedback");
  const btnAbrirModal = document.getElementById("btnAbrirModalFeedback");
  const btnFecharModal = document.querySelector(".fechar-modal");
  const formFeedback = document.getElementById("formFeedback");

  if (btnAbrirModal && modal) {
    btnAbrirModal.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
    });
  }

  if (btnFecharModal && modal) {
    btnFecharModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Envio do formulário de feedback para o backend
  if (formFeedback) {
    formFeedback.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dados = {
        nome: document.getElementById("fbNome").value,
        cargo: document.getElementById("fbCargo").value,
        estrelas: parseInt(document.getElementById("fbEstrelas").value),
        mensagem: document.getElementById("fbMensagem").value
      };

      try {
        const res = await fetch("/feedbacks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        });

        if (res.ok) {
          alert("Obrigado! Seu feedback foi enviado para análise e será publicado em breve.");
          formFeedback.reset();
          if (modal) modal.style.display = "none";
        } else {
          alert("Erro ao enviar o feedback.");
        }
      } catch (err) {
        console.error("Erro ao enviar feedback:", err);
      }
    });
  }


  // ================= 6. CARREGAR FEEDBACKS APROVADOS NA TELA =================
  async function carregarFeedbacksAprovados() {
    const grid = document.querySelector(".feedbacks-grid");
    if (!grid) return;

    try {
      const res = await fetch("/feedbacks/aprovados");
      const feedbacks = await res.json();

      if (feedbacks.length === 0) {
        grid.innerHTML = "<p style='text-align:center; width:100%;'>Nenhum depoimento publicado ainda.</p>";
        return;
      }

      grid.innerHTML = "";

      // Limita a 3 na index.html. Exibe todos se for feedbacks.html
      const ehPaginaFeedbacks = window.location.pathname.includes("feedbacks.html");
      const feedbacksExibidos = ehPaginaFeedbacks ? feedbacks : feedbacks.slice(0, 3);

      feedbacksExibidos.forEach(fb => {
        const quantidadeEstrelas = fb.estrelas || 5;
        let estrelasHtml = '<i class="fa-solid fa-star"></i>'.repeat(quantidadeEstrelas);

        grid.innerHTML += `
          <div class="card-feedback">
            <div class="feedback-estrelas">${estrelasHtml}</div>
            <p>"${fb.mensagem}"</p>
            <div class="feedback-usuario">
              <h4>${fb.nome}</h4>
              <span>${fb.cargo}</span>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error("Erro ao carregar feedbacks:", err);
    }
  }

  // Executa a busca dos feedbacks aprovados
  carregarFeedbacksAprovados();

});
