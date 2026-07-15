# Wiki Scooby-Doo! Mistério S/A — Front-end Organizado

Projeto antigo reorganizado para facilitar a integração com o back-end do Trabalho 2.

## Estrutura

```txt
frontend/
├── index.html
├── script.js
├── styles/
└── Imagens/
```

## Como abrir

1. Abra a pasta `frontend` no VS Code.
2. Clique com o botão direito em `index.html`.
3. Escolha `Open with Live Server`.

## Observações

- O arquivo `HTML/pagina.html` foi movido para `index.html`.
- O arquivo `Java_script/script.js` foi movido para `script.js`.
- As pastas `styles` e `Imagens` ficaram no mesmo nível do `index.html`, deixando os caminhos mais simples.
- Arquivos de fonte não foram incluídos; o CSS foi ajustado para usar fontes padrão do sistema.
- O link externo com `target="_blank"` foi ajustado com `rel="noopener noreferrer"`.
- Nesta versão, o conteúdo visual antigo foi preservado. A próxima etapa é trocar partes fixas do HTML por dados vindos da API com `fetch()`.
