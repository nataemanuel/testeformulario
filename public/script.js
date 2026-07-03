 const blocoFormulario = document.getElementById('blocoFormulario');
    const blocoResultado = document.getElementById('blocoResultado');
    const form = document.getElementById('formCalculaOrcamento');
    const btnVoltar = document.getElementById('btnVoltarForm');

    // AÇÃO AO SUBMITAR: Esconde form, calcula e exibe resultado
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Captura dos dados
      const nome = document.getElementById('nomeCliente').value;
      const servicoTexto = document.getElementById('tipoServico').options[document.getElementById('tipoServico').selectedIndex].text;
      const passageiros = parseInt(document.getElementById('qtdPessoas').value);
      const distancia = parseFloat(document.getElementById('distanciaKm').value);
      const data = document.getElementById('dataViagem').value;

      // Regras de negócio Manga Transportes
      let precoPorKm = 0;
      let veiculoRecomendado = "";
      const taxaBase = 150; 

      if (passageiros <= 25) {
        veiculoRecomendado = "Micro-ônibus (Até 25 lugares)";
        precoPorKm = 4.50; 
      } else if (passageiros <= 45) {
        veiculoRecomendado = "Ônibus de Fretamento (Até 45 lugares)";
        precoPorKm = 7.00;
      } else {
        const qtdVeiculos = Math.ceil(passageiros / 45);
        veiculoRecomendado = `${qtdVeiculos}x Ônibus (Comboio corporativo)`;
        precoPorKm = 7.00 * qtdVeiculos;
      }

      const valorTotal = taxaBase + (distancia * precoPorKm);

      // Atualiza o HTML interno do resultado
      document.getElementById('resPreco').innerText = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      document.getElementById('resVeiculo').innerText = veiculoRecomendado;
      document.getElementById('resDistancia').innerText = distancia + " Km";
      document.getElementById('resPassageiros').innerText = passageiros + " pessoas";

      // Formatação WhatsApp
      const telefoneEmpresa = "5544984385432";
      const mensagemWhats = `Olá Manga Transportes! Fiz uma simulação pelo site:\n\n` +
                            `• *Nome:* ${nome}\n` +
                            `• *Serviço:* ${servicoTexto}\n` +
                            `• *Passageiros:* ${passageiros}\n` +
                            `• *Distância:* ${distancia} Km\n` +
                            `• *Data:* ${data.split('-').reverse().join('/')}\n\n` +
                            `*Estimativa:* ${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
                            `*Veículo:* ${veiculoRecomendado}`;

      document.getElementById('btnEnviarWhats').href = `https://wa.me/${telefoneEmpresa}?text=${encodeURIComponent(mensagemWhats)}`;

      // ANIMAÇÃO DE TROCA: Transiciona sumindo o formulário e surgindo o resultado no mesmo lugar
      blocoFormulario.classList.add('hide');
      blocoResultado.classList.remove('hide');
      blocoResultado.classList.add('fade-in');
    });

    // AÇÃO DO BOTÃO VOLTAR: Esconde o resultado e ressurge o formulário preenchido
    btnVoltar.addEventListener('click', function() {
      blocoResultado.classList.remove('fade-in');
      blocoResultado.classList.add('hide');
      
      blocoFormulario.classList.remove('hide');
      blocoFormulario.classList.add('fade-in');
    });

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
document.addEventListener('DOMContentLoaded', () => {

  // ANIMAÇÃO DE ROLAGEM COM PERFORMANCE OTIMIZADA
  const elements = document.querySelectorAll('.fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Deixa de observar o elemento após ele aparecer para poupar memória do navegador
        observer.unobserve(entry.target); 
      }
    });
  }, { 
    threshold: 0.05, // Dispara assim que a pontinha do elemento entra na tela
    rootMargin: "0px 0px -50px 0px" // Dispara um pouquinho antes do elemento chegar ao topo do celular
  });

  elements.forEach(el => observer.observe(el));

  // MENU HAMBURGUER (Permanece igual, mas com a performance do CSS corrigida)
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
