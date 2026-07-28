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


  // ================= 3. CARROSSEL SWIPER (SERVIÇOS) =================
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
        480: {
          slidesPerView: 1.15,
          spaceBetween: 22,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 2.2,
          spaceBetween: 30,
          centeredSlides: false,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 35,
          centeredSlides: false,
          allowTouchMove: false,
        }
      }
    });
  }


  // ================= 4. NAV ATIVA AO ROLAR =================
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");
  if (sections.length > 0) {
    const observerNav = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            link.classList.remove("active");
            if (!id && link.textContent.includes("Início")) {
              link.classList.add("active");
            }
            if (id && link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }, { threshold: 0.6 });

    sections.forEach(section => observerNav.observe(section));
  }


  // ================= 5. FORMULÁRIO DE CONTATO (index.html) =================
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


  // ================= 6. CÁLCULO DE ORÇAMENTO (orcamento.html) =================
  const formOrcamento = document.getElementById("formOrcamento");
  const boxFormulario = document.getElementById("boxFormulario") || formOrcamento;
  const resBox = document.getElementById("resultadoOrcamento");
  const btnVoltarForm = document.getElementById("btnVoltarForm");

  if (formOrcamento) {
    formOrcamento.addEventListener("submit", function (e) {
      e.preventDefault();

      // Leitura dos dados do formulário
      const nome = document.getElementById("nome")?.value || "";
      const empresa = document.getElementById("empresa")?.value || "";
      const telefone = document.getElementById("telefone")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const origem = document.getElementById("origem")?.value || "";
      const destino = document.getElementById("destino")?.value || "";

      const elKm = document.getElementById("kmTotal");
      const elPassageiros = document.getElementById("qtdPassageiros");

      const km = elKm ? parseFloat(elKm.value) || 0 : 0;
      const passageiros = elPassageiros ? parseInt(elPassageiros.value) || 0 : 0;
      const info = document.getElementById("info")?.value || "";

      // Definindo tabela e veiculo sugerido
      let veiculo = "Ônibus Rodoviário";
      let capacidade = 50;
      let precoPorKm = 8.50;
      let taxaMinima = 700;

      if (passageiros <= 6) {
        veiculo = "Minivan Executiva";
        capacidade = 6;
        precoPorKm = 3.50;
        taxaMinima = 250;
      } else if (passageiros <= 15) {
        veiculo = "Van Executiva";
        capacidade = 15;
        precoPorKm = 4.80;
        taxaMinima = 350;
      } else if (passageiros <= 30) {
        veiculo = "Micro-ônibus";
        capacidade = 30;
        precoPorKm = 6.50;
        taxaMinima = 500;
      }

      // Cálculo do valor
      let valorCalculado = km * precoPorKm;
      if (valorCalculado < taxaMinima && km > 0) {
        valorCalculado = taxaMinima;
      }

      const valorFormatado = valorCalculado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });

      // Atualiza os dados na tela
      const resVeiculo = document.getElementById("resVeiculo");
      const resKm = document.getElementById("resKm");
      const resCapacidade = document.getElementById("resCapacidade");
      const resValor = document.getElementById("resValor");

      if (resVeiculo) resVeiculo.innerText = veiculo;
      if (resKm) resKm.innerText = km;
      if (resCapacidade) resCapacidade.innerText = capacidade;
      if (resValor) resValor.innerText = valorFormatado;

      // OCULTA O FORMULÁRIO E EXIBE O RESULTADO SOZINHO
      if (boxFormulario) boxFormulario.style.display = "none";
      if (resBox) {
        resBox.style.display = "block";
        resBox.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Link para o WhatsApp
      const numeroWhatsApp = "5544984385432";
      let mensagem = `*Solicitação de Orçamento - Manga Transportes*\n\n`;
      mensagem += `*Nome:* ${nome}\n`;
      if (empresa) mensagem += `*Empresa:* ${empresa}\n`;
      mensagem += `*Telefone:* ${telefone}\n`;
      mensagem += `*E-mail:* ${email}\n`;
      mensagem += `*Origem:* ${origem}\n`;
      mensagem += `*Destino:* ${destino}\n`;
      mensagem += `*Distância Total:* ${km} KM\n`;
      mensagem += `*Passageiros:* ${passageiros}\n`;
      mensagem += `*Veículo Recomendado:* ${veiculo}\n`;
      mensagem += `*Estimativa Inicial:* ${valorFormatado}\n`;
      if (info) mensagem += `*Observações:* ${info}\n`;

      const btnWhatsapp = document.getElementById("btnEnviarWhatsApp");
      if (btnWhatsapp) {
        btnWhatsapp.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      }
    });
  }

  // AÇÃO DO BOTÃO "VOLTAR AO FORMULÁRIO"
  if (btnVoltarForm) {
    btnVoltarForm.addEventListener("click", function () {
      if (resBox) resBox.style.display = "none";
      if (boxFormulario) {
        boxFormulario.style.display = "block";
        boxFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

});
