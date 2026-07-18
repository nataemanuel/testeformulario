document.addEventListener('DOMContentLoaded', () => {
  // ANIMAÇÃO
  const elements = document.querySelectorAll('.fade');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel'); // corrigido: era 'visible', CSS espera 'visivel'
      }
    });
  }, { threshold: 0.2 });
  elements.forEach(el => observer.observe(el));

  // MENU HAMBURGUER
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
});

document.addEventListener('DOMContentLoaded', function () {
  const carouselEl = document.querySelector('.servicos-carousel');
  if (carouselEl && typeof Swiper !== 'undefined') {
    const swiperServicos = new Swiper('.servicos-carousel', {
      // Configurações de responsividade
      slidesPerView: 1.15, // Mostra 1 card inteiro e 15% do próximo
      spaceBetween: 20,    // Espaçamento entre os cards
      centeredSlides: false,
      grabCursor: true,    // Cursor de "mãozinha" para arrastar no PC

      // Configuração das bolinhas indicadoras
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      // Ajustes para diferentes tamanhos de tela
      breakpoints: {
        // Telas de celulares médios/grandes (acima de 480px)
        480: {
          slidesPerView: 1.3, // Mostra um pouco mais do próximo card
          spaceBetween: 25,
        },
        // Tablets (acima de 768px)
        768: {
          slidesPerView: 2.2, // Mostra 2 cards inteiros e um pedaço do terceiro
          spaceBetween: 30,
        },
        // Desktops (acima de 1024px)
        1024: {
          slidesPerView: 3,   // Em telas grandes, mostra os 3 cards lado a lado normalmente
          spaceBetween: 35,
          allowTouchMove: false, // Desativa o arrastar se todos couberem na tela
        }
      }
    });
  }
});

// ================= NAV ATIVA AO ROLAR =================
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");
  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          // INÍCIO
          if (!id && link.textContent.includes("Início")) {
            link.classList.add("active");
          }
          // OUTRAS SEÇÕES
          if (id && link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, {
    threshold: 0.6
  });
  // OBSERVA TODAS AS SEÇÕES
  sections.forEach(section => {
    observerNav.observe(section);
  });

  // ================= FORMULÁRIO DE CONTATO (index.html) =================
  const form = document.getElementById("formContato");
  const toast = document.getElementById("toast");
  if (form) {
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
          if (toast) {
            toast.classList.add("show");
            // Esconde o toast depois de 3 segundos (3000ms)
            setTimeout(() => {
              toast.classList.remove("show");
            }, 3000);
          }
          form.reset();
        } else {
          alert("Erro ao enviar a mensagem. Tente novamente.");
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
      }
    });
  }

  // ================= FORMULÁRIO DE ORÇAMENTO (orcamento.html) =================
  const formOrcamento = document.getElementById("formOrcamento");
  const toastOrcamento = document.getElementById("toast");
  if (formOrcamento) {
    formOrcamento.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dados = {
        nome: document.getElementById("nome").value,
        empresa: document.getElementById("empresa") ? document.getElementById("empresa").value : "",
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        origem: document.getElementById("origem").value,
        destino: document.getElementById("destino").value,
        passageiros: document.getElementById("tipoCarga").value,
        info: document.getElementById("info").value
      };
      try {
        const resposta = await fetch("/orcamento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dados)
        });
        if (resposta.ok) {
          if (toastOrcamento) {
            toastOrcamento.classList.add("show");
            setTimeout(() => {
              toastOrcamento.classList.remove("show");
            }, 3000);
          }
          formOrcamento.reset();
        } else {
          alert("Erro ao enviar o orçamento. Tente novamente.");
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
      }
    });
  }
});