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

O build executa as verificações de conteúdo, navegação, progresso e acesso público antes de gerar o Worker. A publicação no ChatGPT Sites usa a configuração existente em `.openai/hosting.json`.

## Publicação na Vercel

Conecte este repositório à Vercel usando a raiz do repositório como **Root Directory**. O `vercel.json` versionado define:

- **Framework Preset:** Other (`framework: null`).
- **Build Command:** `npm run build:guide`.
- **Output Directory:** `guide-dist`.
- **Install Command:** vazio, para pular a instalação de dependências.

O guia público é HTML, CSS e JavaScript com progresso salvo no navegador. Esse build usa apenas Node.js e Python 3, disponíveis no ambiente de build da Vercel; não precisa instalar os pacotes do Worker. Ele executa as mesmas verificações de conteúdo, navegação, progresso e acesso público, e publica somente os arquivos gerados em `guide-dist/`. Os redirecionamentos de `/login` e `/logout` e os cabeçalhos do guia público também estão no `vercel.json`.

Para verificar o build da Vercel localmente, sem instalar dependências:

```sh
npm run build:guide
```

O comando `npm run build` continua dedicado ao Worker do ChatGPT Sites/Cloudflare. Não use o adaptador Next.js na Vercel com esse comando: Vinext não gera `.next/routes-manifest.json`. As opções do `vercel.json` substituem as configurações de build do painel; após integrar a alteração, faça um novo deploy do commit atualizado, sem reutilizar o cache do build anterior.

Referências: [configuração da Vercel](https://vercel.com/docs/project-configuration/vercel-json) e [ambiente de build](https://vercel.com/docs/builds/build-image).

## Estrutura atual

- `source/content/craft.json`: capítulos e demonstrações.
- `source/content/videos.json`: referências em vídeo.
- `source/index.html`, `app.js`, `styles.css`, `atlas.js` e `atlas.css`: guia e interações.
- `source/real-assets/`: logo oficial, fontes e licenças.
- `server/public-guide.mjs`: entrega pública dos arquivos do guia, sem login ou consulta ao banco.
- `tests/public-guide.test.mjs`: testes de acesso público. `tests/password-gate/` guarda os testes do gate anterior, hoje desativado.

A edição atual é gerada por `build.py` em `guide-dist/`, que é um intermediário ignorado pelo Git. Materiais de edições anteriores permanecem no histórico e nos arquivos editoriais; não são publicados automaticamente.

## Progresso e acesso

Leituras e tamanho de texto são salvos no navegador, sem conta pessoal. O progresso pode ser exportado e importado na página Meu progresso. Limpar os dados do navegador pode apagar essas preferências.

O guia abre diretamente, sem senha ou login. Links antigos de entrada e saída redirecionam ao início. As rotas administrativas anteriores estão desativadas. Não inclua senhas, tokens ou arquivos `.env` em commits.

## Identidade e direitos

Logo e identidade Insany: consulte `source/BRANDING.md`. Inter é distribuída sob OFL. Os exemplos autorais usam aplicativos fictícios para demonstrar decisões visuais.
