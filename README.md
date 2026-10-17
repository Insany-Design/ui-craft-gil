# Fundamentos de UI — Do fundamento à interface

Trilha autoral em português para iniciantes em UI, com foco mobile e referências web/nativas contextualizadas. A edição editorial de 17/10/2026 tem 9 módulos, 41 lições e um único projeto fictício, Rota.

## Aprendizagem

Uma sequência no índice e em Anterior/Próxima: tarefa, fundamentos visuais, tipografia, cor, pessoas/arquitetura, mobile, padrões de tela, avaliação e consolidação. A entrada oferece seis marcos cumulativos e atalhos temáticos claramente identificados como consulta.

O núcleo permanece aberto. Explicação vem antes de uma tela correta anotada; comparações só aparecem quando necessárias à variável ensinada. As telas mobile usam uma moldura ilustrativa de 390 × 844. Controles do produto são representações estáticas; controles externos de largura/texto/grid/zoom e a animação perceptiva são demonstrações realmente operáveis.

Ícones/imagens têm uma aula própria. O atlas Gestalt usa diagramas originais separados do produto, com movimento iniciado voluntariamente e controle de pausa. Nenhuma pesquisa com participantes ou certificação é alegada pela existência dos exemplos.

## Fonte e build

- `source/content/part-*.json`: conteúdo das lições.
- `source/index.html`, `source/styles.css`, `source/examples.css`, `source/realistic-examples.css`, `source/app.js`: frontend sem dependências de execução.
- `source/real-assets/`: logo, fontes e licenças utilizadas; materiais antigos eventualmente presentes na fonte não são publicados automaticamente.
- `python build.py`: gera exatamente 12 arquivos em `dist/`, calcula prosa/estimativa de leitura e copia somente assets referenciados e licenças necessárias.

Testes ativos:

- `python validate-teaching.py`
- `node test-app.cjs`
- `node test-component-controls.cjs`
- `node test-realistic-scaling.cjs`
- `node test-learning-atlas.cjs`
- `node --check source/app.js`

O QA do snapshot editorial foi aprovado em Chromium local no Mac: 135 estados (45 rotas × 1440/393/320 CSSpx) e 224 critérios de regressão. A conferência focal de 31 citações em 11 livros gerou somente correções bibliográficas posteriores, com testes reexecutados e preservação dos visuais verificada por comparação de arquivos. Consulte `FINAL-REFERENCE-AUDIT.md` e `EDITORIAL-CHANGES-AND-QA.md`. Não houve dispositivo físico, Safari, leitor de tela ou certificação WCAG. O Chromium desta nuvem foi impedido de iniciar por restrição de socket; testes DOM-stub não substituem esses ambientes.

`verify-snapshot.py` e `RESTORATION-*.json/md` documentam a recuperação anterior de 40 lições. Não são a expectativa de hash da nova edição. `validate.py`, `build-samples.cjs` e `QA-DIDACTIC.md`, quando presentes no repositório histórico, não pertencem ao protocolo ativo desta revisão.

## Progresso

Mantida a chave `ui-mobile-study-v2`, com marcações manuais por ID, última lição, posições e exportação/importação JSON local. Os 40 IDs antigos continuam válidos; a nova lição aumenta o denominador para 41, sem apagar marcações. A importação mescla marcações válidas. Limpar dados do navegador pode apagar progresso; não existe sincronização de progresso por IP ou conta.

## Direitos e limites

Teoria, análises e diagramas são sínteses autorais. Livros e PDFs protegidos são referenciados sem reprodução de capítulos. Os visuais do Rota são próprios; AlignUI Base Components é referência de acabamento, com licença MIT pertinente. Inter mantém a licença OFL. O build não redistribui PDFs, anexos, capturas antigas nem arquivos de pesquisa.

O gate de acesso é um projeto separado. Esta revisão não publica, altera sua segurança ou configura senhas. Preserve o projeto de hospedagem e a URL existentes ao integrar a versão aprovada; não registre um novo site para esta atualização.
