# Insany · Craft de UI

Guia em português para desenvolver o olhar e o acabamento de interfaces: 14 capítulos e 120 exemplos visuais, com contexto, aplicação e referências.

Site: https://fundamentos-ui-mobile.insany-team-1573.chatgpt.site/

## Desenvolvimento

Requer Node.js 22.13 ou superior e Python 3.

```sh
npm ci
npm run dev
```

```sh
npm run build
```

O build executa as verificações de conteúdo, navegação, progresso e proteção de acesso antes de gerar o Worker. A publicação usa a configuração existente em `.openai/hosting.json`.

## Estrutura atual

- `source/content/craft.json`: capítulos e demonstrações.
- `source/content/videos.json`: referências em vídeo.
- `source/index.html`, `app.js`, `styles.css`, `atlas.js` e `atlas.css`: guia e interações.
- `source/real-assets/`: logo oficial, fontes e licenças.
- `server/`: acesso por senha compartilhada e entrega dos arquivos protegidos.
- `tests/password-gate/`: testes de acesso.

A edição atual é gerada por `build.py` em `guide-dist/`, que é um intermediário ignorado pelo Git. Materiais de edições anteriores permanecem no histórico e nos arquivos editoriais; não são publicados automaticamente.

## Progresso e acesso

Leituras e tamanho de texto são salvos no navegador, sem conta pessoal. O progresso pode ser exportado e importado na página Meu progresso. Limpar os dados do navegador pode apagar essas preferências.

A senha compartilhada é configurada no armazenamento do serviço, fora do código. Não inclua senhas, tokens ou arquivos `.env` em commits.

## Identidade e direitos

Logo e identidade Insany: consulte `source/BRANDING.md`. Inter é distribuída sob OFL. Os exemplos autorais usam aplicativos fictícios para demonstrar decisões visuais.
