# Mudanças integradas e conferência final

17/10/2026. Esta é uma revisão editorial e de conteúdo do frontend. Não inclui publicação nem alterações no gate de senha.

**Fechamento:** o QA Mac foi aprovado no snapshot de 04:33 UTC. A conferência bibliográfica posterior resultou em nove correções de referências, sem alterar o conteúdo didático ou os visuais. Consulte o relatório final de referências e QA deste pacote para cobertura, correções e limites. O checklist abaixo documenta o protocolo usado, não uma etapa ainda pendente.

## Resultado editorial

- 41 lições: os 40 IDs anteriores mais `icones-imagens-significado`.
- Uma sequência real no índice e em Próxima/Anterior: tarefa → princípios visuais → tipografia → cor → pessoas/conteúdo/caminhos → mobile → tipos de tela → avaliação → consolidação.
- A abertura contém seis marcos cumulativos. Os seis fundamentos são explicitamente atalhos de consulta, não outra sequência concorrente.
- As 41 lições têm 4–5 seções abertas; nenhuma usa acordeão para esconder o núcleo. Cada prática tem passos curtos e critérios observáveis, com material inicial ou links para a base.
- Pesquisa e modelos mentais foram agrupados com IA depois da primeira prática visual. O Rota continua único; Descobrir é o nome do destino mostrado nas telas. Explorar agora continua sendo o comando do onboarding.
- A biblioteca deixa claro que consulta não é lista obrigatória. Os títulos falam com iniciantes em UI, com foco mobile e referências web/nativas contextualizadas.
- A contagem de prosa do build caiu de 32.411 para cerca de 18 mil palavras. Essa métrica não inclui toda a interface, os exercícios ou o tempo de prática e não é, sozinha, evidência de aprendizagem.
- O calendário opcional de oito semanas continua apenas como sugestão no plano editorial, sem promessa de formação profissional.

## Exemplos: preservação e mudanças pontuais

36 dos 40 `visualHtml` antigos permanecem byte a byte iguais ao snapshot aprovado. As quatro diferenças existentes são localizadas:

1. Hierarquia: anotação do botão descreve o preenchimento azul, em vez de insinuar a maior razão de contraste; rótulo externo usa prioridades, sem prometer ordem ocular.
2. Gestalt: “evita atribuir” passou a “reduz o risco de atribuir”, fora do aparelho.
3. Cor/paleta: texto de produto “Confira o horário antes de salvar” substitui a nota didática interna “Cada cor tem uma função nesta tela”.
4. Escala tipográfica: “Dado em destaque” substitui “Subtítulo confirma”, preservando o horário como dado e o título de seção como título.

A nova aula de ícones/imagens reaproveita a ficha de visita existente. As anotações explicam propósito e alternativas; a arte decorativa fica ocultada da leitura assistiva nessa composição, sem esconder os textos. Não há novo cenário, recurso externo copiado ou comportamento de botão fictício.

O atlas Gestalt é separado da interface do Rota. Oito diagramas originais demonstram proximidade, semelhança, região comum, continuidade, fechamento, figura-fundo, conexão uniforme e destino comum. Prägnanz recebe contexto geral; ponto focal remete a hierarquia. Skeleton e sublinhado de aba não são tratados como equivalentes automáticos de princípios perceptivos.

## Correções encontradas pelas revisões independentes

- Piloto: prática autossuficiente, custos/restrições explícitos, peso definido e sumário na mesma ordem do exemplo.
- Atlas: reconstrução do vaso/perfis; SVG sem stroke herdado indevido; pontos inicialmente em grade, sem deslocamento no primeiro keyframe; comando Reproduzir/Pausar sem aria-pressed; explicação de que imagem parada não demonstra destino comum.
- Painel: prática agora descreve a tela real Alterar horário, com plano às 14h e rascunho às 15h; Aplicar confirma, Cancelar preserva o anterior.
- Navegação/projeto: nome Descobrir alinhado às telas.
- Header e lista: tarefa não exige título dentro da barra nem ação Salvar ausente da lista.
- Responsividade: “300 CSSpx ou menos” corresponde a max-width:300px.
- Pesquisa: pergunta inicial neutra sobre o significado das duas horas, antes de investigar retorno.
- Contraste: prática refere horário/última entrada presentes na tela; registro de cor fornece 16/25px e peso400 como especificação, sem alegar nova medição computada.
- Projeto: links de entrada direta para os artefatos-base e para o plano de acessibilidade.
- Tipografia: Ampliar tela desfaz a redução da moldura; a amostra ampliada externa é outro recurso.
- Objetivos ajustados à aplicação efetiva, sem acrescentar exercícios para manter promessas antigas.

## Progresso e artefato

- Mantida a chave `ui-mobile-study-v2`, schemaVersion2 e curso `ui-mobile` dos arquivos de progresso.
- A importação continua mesclando IDs válidos, sem remover marcações atuais.
- O teste de atualização carrega todos os 40 IDs antigos e confirma 40 de 41 estudadas. A nova lição não é marcada automaticamente.
- Mudanças na sequência e no comprimento do texto não equivalem a preservar a mesma posição visual de uma leitura antiga. Os IDs de lição, a última lição e os dados de progresso permanecem; não se promete estabilidade de todos os subtítulos numerados antigos.
- O build continua seletivo: 12 arquivos públicos, incluindo somente logo, duas fontes Inter e suas licenças necessárias. Pesquisa e PDFs não entram no dist.
- Os novos scripts de curadoria não são parte do aplicativo; o pacote de fonte final deve conter somente fonte, build, testes ativos e documentação necessária.

## Testes locais executáveis

- `python build.py`
- `python validate-teaching.py`: 41 lições, 41 aparelhos, 4 exemplos com controles de componente; IDs antigos, markup e cenários.
- `node test-app.cjs`: rotas, ausência de acordeões, progresso, recarga, importação mesclada, JSON inválido e atualização dos 40 IDs antigos.
- `node test-component-controls.cjs`: ligação dos controles de largura/texto/grid em DOM-stub.
- `node test-realistic-scaling.cjs`: zoom externo, pan e limpeza dos observadores em DOM-stub.
- `node test-learning-atlas.cjs`: oito cartões, seis pontos, início em zero, comando de movimento e sequência única.
- `node --check source/app.js`

Os testes de DOM-stub são estruturais, não medições de layout. O Chromium da nuvem encerra ao iniciar com `socket() failed: Operation not permitted`. Não houve contorno dessa restrição. A inspeção isolada do SVG de figura-fundo foi feita por rasterização com Inkscape, sem alegar QA integrado de navegador.

## Checklist focal para o QA autorizado em navegador

### Amostra e navegação

- Conferir as 45 rotas: início, 41 lições, biblioteca, glossário e progresso, nas larguras estreita/média/ampla do protocolo; incluir 320 CSSpx para as partes novas.
- Sem erro JS, overflow global, texto cortado ou sobreposição de foco/ações.
- Índice, número da aula, anterior/próxima e sumário interno seguem a ordem efetiva. A primeira Próxima leva de problema para hierarquia.
- Títulos/metadados e biblioteca identificam UI para iniciantes com foco mobile. Não restam contagens antigas de 37/40 aulas.
- Tempos são de leitura; prática aparece separada. Nenhuma promessa de certificação, emprego ou domínio em oito semanas.
- Logo, busca, marcação, recarga, exportação/importação e progresso antigo continuam funcionando.

### Partes novas

- Início: seis marcos e seis atalhos legíveis, sem caminho concorrente implícito.
- Ícones/imagens: arte e símbolos correspondem às notas; fonte/tamanhos mantêm o acabamento; dados essenciais continuam presentes.
- Atlas: oito cartões sem corte; proximidade e região comum têm as distâncias descritas; fechamento tem lacunas reais; conexão uniforme é uma região contínua.
- Figura-fundo: reconhecer vaso e dois perfis em tamanho real do cartão, apontando nariz, boca e queixo compartilhados.
- Destino comum: começa parado; grupos não nascem deslocados; 1,3,5 compartilham movimento e 2,4,6 seguem sentido oposto; números legíveis; botão alcançável por teclado; reproduzir, pausar e retomar funcionam. Em preferência de movimento reduzido continua parado até escolha explícita. A pausa conserva a posição atual.
- SVGs não herdam contorno nos números e formas preenchidas; linhas com stroke explícito permanecem visíveis.

### Valores e controles que não podem regredir

- Grid interno340=4×73+3×16, spans340/162 e guias alinhadas.
- Hierarquia30/38/500 e22/30/500; “Sua visita” título, horário dado.
- Largura340/260; mudança em300CSSpx; quatro combinações340/260×100/130% nas lições de adaptação, entrega e onde existentes.
- Todos os papéis tipográficos crescem; ação no fluxo e alcançável por rolagem.
- Zoom da moldura permanece externo ao produto; não confundir com escala de texto.
- Contraste dos textos/fundos efetivos e scrollbar corrigida; nenhum rótulo de baixo contraste reapareceu na arte.

Esse QA não equivale a teste com iniciantes, dispositivo físico, tecnologia assistiva, certificação WCAG ou aprovação de segurança do gate. Registre ambiente, versão e evidência do que de fato for executado.
