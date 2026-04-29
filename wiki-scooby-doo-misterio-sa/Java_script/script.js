const cardsExpansiveis = document.querySelectorAll(".card_expansivel");

cardsExpansiveis.forEach((card) => {
    const botaoCard = card.querySelector(".botao-card");
    const conteudoCard = Array.from(card.children).find((elemento) =>
        elemento.classList.contains("conteudo-card")
    );

    if (botaoCard && conteudoCard) {
        botaoCard.addEventListener("click", (evento) => {
            evento.stopPropagation();
            conteudoCard.classList.toggle("ativo");
        });
    }
});

const botaoModoInvestigacao = document.querySelector("#botao_modo_investigacao");
const textoModoInvestigacao = document.querySelector("#texto_modo_investigacao");

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
