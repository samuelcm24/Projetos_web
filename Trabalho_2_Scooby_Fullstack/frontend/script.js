const API_URL = "http://localhost:3000";

/* =========================
   FUNÇÕES AUXILIARES
========================= */

function getToken() {
  return localStorage.getItem("token");
}

function escaparHtml(texto) {
  if (!texto) {
    return "";
  }

  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mensagemLoginObrigatorio(classeTexto = "") {
  return `
        <p class="${classeTexto}">
            Faça login para carregar os conteúdos.
        </p>
    `;
}

/* =========================
   LOGIN
========================= */

async function fazerLogin() {
  const emailInput = document.querySelector("#email-login");
  const senhaInput = document.querySelector("#senha-login");
  const mensagemLogin = document.querySelector("#mensagem-login");

  const email = emailInput.value;
  const senha = senhaInput.value;

  if (!email || !senha) {
    mensagemLogin.textContent = "Preencha o e-mail e a senha.";
    mensagemLogin.style.color = "orange";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    });

    if (!resposta.ok) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const dados = await resposta.json();

    localStorage.setItem("token", dados.access_token);

    mensagemLogin.textContent = "Login realizado com sucesso.";
    mensagemLogin.style.color = "lightgreen";

    await carregarTodosConteudos();
    const modalLogin = document.querySelector("#modal-login");

    if (modalLogin) {
      modalLogin.classList.remove("ativo");
    }
  } catch (erro) {
    console.error(erro);

    mensagemLogin.textContent =
      "Erro ao fazer login. Verifique o e-mail e a senha.";
    mensagemLogin.style.color = "red";
  }
}

function sair() {
  localStorage.removeItem("token");

  const mensagemLogin = document.querySelector("#mensagem-login");

  if (mensagemLogin) {
    mensagemLogin.textContent = "Você saiu do sistema.";
    mensagemLogin.style.color = "orange";
  }

  limparConteudos();
}

/* =========================
   BUSCAR DADOS DA API
========================= */

async function buscarConteudos(categoria) {
  const token = getToken();

  if (!token) {
    return [];
  }

  try {
    const resposta = await fetch(
      `${API_URL}/conteudos?categoria=${categoria}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar conteúdos da categoria: ${categoria}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error(erro);
    return [];
  }
}

/* =========================
   SINOPSE
========================= */

function criarTextoSinopse(conteudo) {
  return `
        <p class="frase_sinopse">
            ${escaparHtml(conteudo.texto)}
        </p>
    `;
}

async function carregarSinopse() {
  const areaSinopse = document.querySelector("#conteudos-sinopse");

  if (!areaSinopse) {
    return;
  }

  if (!getToken()) {
    areaSinopse.innerHTML = mensagemLoginObrigatorio("frase_sinopse");
    return;
  }

  areaSinopse.innerHTML = `<p class="frase_sinopse">Carregando sinopse...</p>`;

  const sinopses = await buscarConteudos("sinopse");

  if (sinopses.length === 0) {
    areaSinopse.innerHTML = `
            <p class="frase_sinopse">
                Nenhuma sinopse cadastrada no banco de dados.
            </p>
        `;
    return;
  }

  areaSinopse.innerHTML = "";

  sinopses.forEach((sinopse) => {
    areaSinopse.innerHTML += criarTextoSinopse(sinopse);
  });
}

/* =========================
   TEMPORADAS
========================= */

function criarCardTemporada(conteudo) {
  return `
        <div class="mini_card_temporada card_expansivel">
            <div class="botao-card">
                <div class="img_temporadas">
                    <img src="${escaparHtml(conteudo.imagem)}" alt="${escaparHtml(conteudo.titulo)}">
                </div>

                <h3 class="nome_temporada">${escaparHtml(conteudo.titulo)}</h3>
            </div>

            <div class="card_retraido conteudo-card">
                <p class="info_temporada">
                    ${escaparHtml(conteudo.texto)}
                </p>
            </div>
        </div>
    `;
}

async function carregarTemporadas() {
  const areaTemporadas = document.querySelector("#conteudos-temporadas");

  if (!areaTemporadas) {
    return;
  }

  if (!getToken()) {
    areaTemporadas.innerHTML = mensagemLoginObrigatorio("frase_temporada");
    return;
  }

  areaTemporadas.innerHTML = `<p class="frase_temporada">Carregando temporadas...</p>`;

  const temporadas = await buscarConteudos("temporada");

  if (temporadas.length === 0) {
    areaTemporadas.innerHTML = `
            <p class="frase_temporada">
                Nenhuma temporada cadastrada no banco de dados.
            </p>
        `;
    return;
  }

  areaTemporadas.innerHTML = "";

  temporadas.forEach((temporada) => {
    areaTemporadas.innerHTML += criarCardTemporada(temporada);
  });
}

async function carregarResumoTemporadas() {
  const areaResumo = document.querySelector("#conteudos-resumo-temporadas");

  if (!areaResumo) {
    return;
  }

  if (!getToken()) {
    areaResumo.innerHTML = `<p>Faça login para carregar o resumo das temporadas.</p>`;
    return;
  }

  const resumos = await buscarConteudos("resumo_temporada");

  if (resumos.length === 0) {
    areaResumo.innerHTML = `
            <p>
                Nenhum resumo de temporadas cadastrado no banco de dados.
            </p>
        `;
    return;
  }

  areaResumo.innerHTML = "";

  resumos.forEach((resumo) => {
    areaResumo.innerHTML += `
            <p>
                ${escaparHtml(resumo.texto)}
            </p>
        `;
  });
}

/* =========================
   GALERIA
========================= */

function criarCardGaleria(conteudo) {
  return `
        <div class="mini_card_galeria card_expansivel">
            <div class="botao-card">
                <div class="img_galeria">
                    <img src="${escaparHtml(conteudo.imagem)}" alt="${escaparHtml(conteudo.titulo)}">
                </div>

                <h3 class="titulo_card_galeria">${escaparHtml(conteudo.titulo)}</h3>
            </div>

            <div class="card_retraido conteudo-card">
                <p class="info_personagens">
                    ${escaparHtml(conteudo.texto)}
                </p>
            </div>
        </div>
    `;
}

async function carregarTextoGaleria() {
  const areaTextoGaleria = document.querySelector("#conteudos-texto-galeria");

  if (!areaTextoGaleria) {
    return;
  }

  if (!getToken()) {
    areaTextoGaleria.innerHTML = mensagemLoginObrigatorio("frase_galeria");
    return;
  }

  const textos = await buscarConteudos("texto_galeria");

  if (textos.length === 0) {
    areaTextoGaleria.innerHTML = `
            <p class="frase_galeria">
                Nenhuma descrição da galeria cadastrada no banco de dados.
            </p>
        `;
    return;
  }

  areaTextoGaleria.innerHTML = "";

  textos.forEach((texto) => {
    areaTextoGaleria.innerHTML += `
            <p class="frase_galeria">
                ${escaparHtml(texto.texto)}
            </p>
        `;
  });
}

async function carregarHerois() {
  const areaHerois = document.querySelector("#conteudos-herois");

  if (!areaHerois) {
    return;
  }

  if (!getToken()) {
    areaHerois.innerHTML = mensagemLoginObrigatorio("frase_galeria");
    return;
  }

  areaHerois.innerHTML = `<p class="frase_galeria">Carregando heróis...</p>`;

  const herois = await buscarConteudos("heroi");

  if (herois.length === 0) {
    areaHerois.innerHTML = `
            <p class="frase_galeria">
                Nenhum herói cadastrado no banco de dados.
            </p>
        `;
    return;
  }

  areaHerois.innerHTML = "";

  herois.forEach((heroi) => {
    areaHerois.innerHTML += criarCardGaleria(heroi);
  });
}

async function carregarSecundarios() {
  const areaSecundarios = document.querySelector("#conteudos-secundarios");

  if (!areaSecundarios) {
    return;
  }

  if (!getToken()) {
    areaSecundarios.innerHTML = mensagemLoginObrigatorio("frase_galeria");
    return;
  }

  areaSecundarios.innerHTML = `<p class="frase_galeria">Carregando personagens secundários...</p>`;

  const secundarios = await buscarConteudos("secundario");

  if (secundarios.length === 0) {
    areaSecundarios.innerHTML = `
            <p class="frase_galeria">
                Nenhum personagem secundário cadastrado no banco de dados.
            </p>
        `;
    return;
  }

  areaSecundarios.innerHTML = "";

  secundarios.forEach((personagem) => {
    areaSecundarios.innerHTML += criarCardGaleria(personagem);
  });
}

/* =========================
   MISTÉRIOS
========================= */

async function carregarTextoMisterios() {
  const areaTextoMisterios = document.querySelector(
    "#conteudos-texto-misterios",
  );

  if (!areaTextoMisterios) {
    return;
  }

  if (!getToken()) {
    areaTextoMisterios.innerHTML = mensagemLoginObrigatorio("frase_misterios");
    return;
  }

  const textos = await buscarConteudos("texto_misterio");

  if (textos.length === 0) {
    areaTextoMisterios.innerHTML = `
            <p class="frase_misterios">
                Nenhuma descrição de mistérios cadastrada no banco de dados.
            </p>
        `;
    return;
  }

  areaTextoMisterios.innerHTML = "";

  textos.forEach((texto) => {
    areaTextoMisterios.innerHTML += `
            <p class="frase_misterios">
                ${escaparHtml(texto.texto)}
            </p>
        `;
  });
}

async function carregarOrdemMisterios() {
  const listaMisterios = document.querySelector("#conteudos-ordem-misterios");

  if (!listaMisterios) {
    return;
  }

  if (!getToken()) {
    listaMisterios.innerHTML = `<li>Faça login para carregar a ordem da investigação.</li>`;
    return;
  }

  const ordem = await buscarConteudos("ordem_misterio");

  if (ordem.length === 0) {
    listaMisterios.innerHTML = `<li>Nenhuma ordem cadastrada no banco de dados.</li>`;
    return;
  }

  listaMisterios.innerHTML = "";

  ordem.forEach((item) => {
    listaMisterios.innerHTML += `
            <li>${escaparHtml(item.titulo)}</li>
        `;
  });
}

function criarCardMisterio(conteudo) {
  const numero = String(conteudo.ordem).padStart(2, "0");

  return `
        <div class="card_misterio">
            <span class="numero_misterio">${numero}</span>

            <h3>${escaparHtml(conteudo.titulo)}</h3>

            <p>
                ${escaparHtml(conteudo.texto)}
            </p>
        </div>
    `;
}

async function carregarMisterios() {
  const areaMisterios = document.querySelector("#conteudos-misterios");

  if (!areaMisterios) {
    return;
  }

  if (!getToken()) {
    areaMisterios.innerHTML = mensagemLoginObrigatorio("frase_misterios");
    return;
  }

  areaMisterios.innerHTML = `<p class="frase_misterios">Carregando mistérios...</p>`;

  const misterios = await buscarConteudos("misterio");

  if (misterios.length === 0) {
    areaMisterios.innerHTML = `
            <p class="frase_misterios">
                Nenhum mistério cadastrado no banco de dados.
            </p>
        `;
    return;
  }

  areaMisterios.innerHTML = "";

  misterios.forEach((misterio) => {
    areaMisterios.innerHTML += criarCardMisterio(misterio);
  });
}

/* =========================
   CURIOSIDADES
========================= */

async function carregarTextoCuriosidades() {
  const areaTextoCuriosidades = document.querySelector(
    "#conteudos-texto-curiosidades",
  );

  if (!areaTextoCuriosidades) {
    return;
  }

  if (!getToken()) {
    areaTextoCuriosidades.innerHTML =
      mensagemLoginObrigatorio("frase_curiosidades");
    return;
  }

  const textos = await buscarConteudos("texto_curiosidade");

  if (textos.length === 0) {
    areaTextoCuriosidades.innerHTML = `
            <p class="frase_curiosidades">
                Nenhuma descrição de curiosidades cadastrada no banco de dados.
            </p>
        `;
    return;
  }

  areaTextoCuriosidades.innerHTML = "";

  textos.forEach((texto) => {
    areaTextoCuriosidades.innerHTML += `
            <p class="frase_curiosidades">
                ${escaparHtml(texto.texto)}
            </p>
        `;
  });
}

async function carregarTabelaCuriosidades() {
  const tabelaCuriosidades = document.querySelector(
    "#conteudos-tabela-curiosidades",
  );

  if (!tabelaCuriosidades) {
    return;
  }

  if (!getToken()) {
    tabelaCuriosidades.innerHTML = `
            <tr>
                <td colspan="2">Faça login para carregar os dados rápidos.</td>
            </tr>
        `;
    return;
  }

  const dadosTabela = await buscarConteudos("tabela_curiosidade");

  if (dadosTabela.length === 0) {
    tabelaCuriosidades.innerHTML = `
            <tr>
                <td colspan="2">Nenhum dado rápido cadastrado no banco de dados.</td>
            </tr>
        `;
    return;
  }

  tabelaCuriosidades.innerHTML = "";

  dadosTabela.forEach((item) => {
    tabelaCuriosidades.innerHTML += `
            <tr>
                <td>${escaparHtml(item.titulo)}</td>
                <td>${escaparHtml(item.texto)}</td>
            </tr>
        `;
  });
}

function criarCardCuriosidade(conteudo) {
  return `
        <div class="card_curiosidade">
            <span>${escaparHtml(conteudo.titulo)}</span>

            <p>
                ${escaparHtml(conteudo.texto)}
            </p>
        </div>
    `;
}

async function carregarCuriosidades() {
  const areaCuriosidades = document.querySelector("#conteudos-curiosidades");

  if (!areaCuriosidades) {
    return;
  }

  if (!getToken()) {
    areaCuriosidades.innerHTML = mensagemLoginObrigatorio("frase_curiosidades");
    return;
  }

  areaCuriosidades.innerHTML = `<p class="frase_curiosidades">Carregando curiosidades...</p>`;

  const curiosidades = await buscarConteudos("curiosidade");

  if (curiosidades.length === 0) {
    areaCuriosidades.innerHTML = `
            <p class="frase_curiosidades">
                Nenhuma curiosidade cadastrada no banco de dados.
            </p>
        `;
    return;
  }

  areaCuriosidades.innerHTML = "";

  curiosidades.forEach((curiosidade) => {
    areaCuriosidades.innerHTML += criarCardCuriosidade(curiosidade);
  });
}

/* =========================
   CARDS EXPANSÍVEIS
========================= */

function ativarCardsExpansiveis() {
  const cardsExpansiveis = document.querySelectorAll(".card_expansivel");

  cardsExpansiveis.forEach((card) => {
    const botaoCard = card.querySelector(".botao-card");
    const conteudoCard = card.querySelector(".conteudo-card");

    if (botaoCard && conteudoCard) {
      botaoCard.onclick = (evento) => {
        evento.stopPropagation();
        conteudoCard.classList.toggle("ativo");
      };
    }
  });
}

/* =========================
   MODO INVESTIGAÇÃO
========================= */

function ativarModoInvestigacao() {
  const botaoModoInvestigacao = document.querySelector(
    "#botao_modo_investigacao",
  );
  const textoModoInvestigacao = document.querySelector(
    "#texto_modo_investigacao",
  );

  if (botaoModoInvestigacao && textoModoInvestigacao) {
    botaoModoInvestigacao.addEventListener("click", () => {
      document.body.classList.toggle("modo_investigacao");

      const modoAtivo = document.body.classList.contains("modo_investigacao");

      botaoModoInvestigacao.textContent = modoAtivo
        ? "Desativar modo investigação"
        : "Ativar modo investigação";

      textoModoInvestigacao.textContent = modoAtivo
        ? "Modo investigação ativado: os mistérios principais estão destacados."
        : "Modo investigação desativado.";
    });
  }
}

/* =========================
   CARREGAR TUDO
========================= */

async function carregarTodosConteudos() {
  await carregarSinopse();

  await carregarTemporadas();
  await carregarResumoTemporadas();

  await carregarTextoGaleria();
  await carregarHerois();
  await carregarSecundarios();

  await carregarTextoMisterios();
  await carregarOrdemMisterios();
  await carregarMisterios();

  await carregarTextoCuriosidades();
  await carregarTabelaCuriosidades();
  await carregarCuriosidades();

  ativarCardsExpansiveis();
}

function limparConteudos() {
  const areaSinopse = document.querySelector("#conteudos-sinopse");
  const areaTemporadas = document.querySelector("#conteudos-temporadas");
  const areaResumoTemporadas = document.querySelector(
    "#conteudos-resumo-temporadas",
  );
  const areaTextoGaleria = document.querySelector("#conteudos-texto-galeria");
  const areaHerois = document.querySelector("#conteudos-herois");
  const areaSecundarios = document.querySelector("#conteudos-secundarios");
  const areaTextoMisterios = document.querySelector(
    "#conteudos-texto-misterios",
  );
  const areaOrdemMisterios = document.querySelector(
    "#conteudos-ordem-misterios",
  );
  const areaMisterios = document.querySelector("#conteudos-misterios");
  const areaTextoCuriosidades = document.querySelector(
    "#conteudos-texto-curiosidades",
  );
  const areaTabelaCuriosidades = document.querySelector(
    "#conteudos-tabela-curiosidades",
  );
  const areaCuriosidades = document.querySelector("#conteudos-curiosidades");

  if (areaSinopse) {
    areaSinopse.innerHTML = mensagemLoginObrigatorio("frase_sinopse");
  }

  if (areaTemporadas) {
    areaTemporadas.innerHTML = mensagemLoginObrigatorio("frase_temporada");
  }

  if (areaResumoTemporadas) {
    areaResumoTemporadas.innerHTML = `<p>Faça login para carregar o resumo das temporadas.</p>`;
  }

  if (areaTextoGaleria) {
    areaTextoGaleria.innerHTML = mensagemLoginObrigatorio("frase_galeria");
  }

  if (areaHerois) {
    areaHerois.innerHTML = mensagemLoginObrigatorio("frase_galeria");
  }

  if (areaSecundarios) {
    areaSecundarios.innerHTML = mensagemLoginObrigatorio("frase_galeria");
  }

  if (areaTextoMisterios) {
    areaTextoMisterios.innerHTML = mensagemLoginObrigatorio("frase_misterios");
  }

  if (areaOrdemMisterios) {
    areaOrdemMisterios.innerHTML = `<li>Faça login para carregar a ordem da investigação.</li>`;
  }

  if (areaMisterios) {
    areaMisterios.innerHTML = mensagemLoginObrigatorio("frase_misterios");
  }

  if (areaTextoCuriosidades) {
    areaTextoCuriosidades.innerHTML =
      mensagemLoginObrigatorio("frase_curiosidades");
  }

  if (areaTabelaCuriosidades) {
    areaTabelaCuriosidades.innerHTML = `
            <tr>
                <td colspan="2">Faça login para carregar os dados rápidos.</td>
            </tr>
        `;
  }

  if (areaCuriosidades) {
    areaCuriosidades.innerHTML = mensagemLoginObrigatorio("frase_curiosidades");
  }
}

function controlarModalLogin() {
  const abrirLogin = document.querySelector("#abrir-login");
  const fecharLogin = document.querySelector("#fechar-login");
  const modalLogin = document.querySelector("#modal-login");

  if (abrirLogin && modalLogin) {
    abrirLogin.addEventListener("click", () => {
      modalLogin.classList.add("ativo");
    });
  }

  if (fecharLogin && modalLogin) {
    fecharLogin.addEventListener("click", () => {
      modalLogin.classList.remove("ativo");
    });
  }

  if (modalLogin) {
    modalLogin.addEventListener("click", (evento) => {
      if (evento.target === modalLogin) {
        modalLogin.classList.remove("ativo");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const botaoLogin = document.querySelector("#botao-login");
  const botaoSair = document.querySelector("#botao-sair");

  controlarModalLogin();

  if (botaoLogin) {
    botaoLogin.addEventListener("click", fazerLogin);
  }

  if (botaoSair) {
    botaoSair.addEventListener("click", sair);
  }

  if (getToken()) {
    await carregarTodosConteudos();
  } else {
    limparConteudos();
  }

  ativarModoInvestigacao();
});
