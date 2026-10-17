# UI mobile — Do fundamento à interface

Trilha educacional estática, autoral, em português. 9 módulos e 40 lições completas. Índice com busca, navegação sequencial, biblioteca por módulo, glossário e imagens reais de fontes oficiais com crédito/licença.

## Fonte e build
- `source/content/part-*.json`: conteúdo estruturado, independente do frontend.
- `source/index.html`, `source/styles.css`, `source/app.js`: interface sem dependências.
- `source/real-assets/`: capturas e figuras oficiais, licenças e créditos.
- `python build.py`: gera `dist/` e calcula o tempo de leitura estimado.
- `node test-app.cjs`: testa renderização e lógica de progresso com DOM simulado. Não substitui QA visual no navegador.
- `node --check dist/app.js`: valida sintaxe.

O conteúdo de cada lição fica integralmente aberto. Não há accordions ou modais que escondam explicações. Em telas compactas, exemplos aparecem antes do exercício; em telas amplas, ficam à direita.

## Progresso e privacidade
Apenas localStorage neste navegador, chave `ui-mobile-study-v2`. Sem conta, backend, analytics próprios, identificação por IP ou sincronização. Marcação manual por lição, porcentagem por módulo e total, última lição e posição de leitura, exportação/importação JSON local. Importação mescla lições concluídas e filtra identificadores desconhecidos. Limpar dados do site pode apagar o progresso.

## Referências e direitos
As análises são autorais. Livros e fontes protegidas são indicados por links sem reprodução de capítulos. Imagens Android usam as licenças identificadas na documentação ou no repositório; veja arquivos de licença em `source/real-assets/`. Capturas GOV.UK são creditadas sob Open Government Licence v3.0. Marcas pertencem aos respectivos titulares; não há afiliação ou endosso. As capturas são de exemplos públicos com dados demonstrativos.

Preservar o project_id de `.openai/hosting.json` e o público atual do site. Nunca registrar novo site para uma atualização.
