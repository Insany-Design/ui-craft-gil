# Revisão editorial Craft de UI

Cobertura: 14 de 14 capítulos, 120 de 120 conceitos. Leitura completa de context, observation, application e visualHtml. IDs, ordem, estrutura e fontes preservados. Não houve redesenho do layout; apenas correções locais nas demonstrações.

38 conceitos receberam alterações; os demais foram revisados e mantidos.

## Cobertura por capítulo
- Antes da tela: 8/8 revisados; 3 ajustados.
- Princípios visuais: 8/8 revisados; 1 ajustados.
- Leis de UX: 8/8 revisados; 2 ajustados.
- Gestalt: 8/8 revisados; 1 ajustados.
- Heurísticas de Nielsen: 11/11 revisados; 3 ajustados.
- Marca na interface: 9/9 revisados; 2 ajustados.
- Cor: 8/8 revisados; 4 ajustados.
- Tipografia: 10/10 revisados; 5 ajustados.
- Espaçamento e grid: 8/8 revisados; 3 ajustados.
- Profundidade e superfícies: 9/9 revisados; 3 ajustados.
- Iconografia: 8/8 revisados; 3 ajustados.
- Refinamento óptico: 8/8 revisados; 2 ajustados.
- Estados de componentes: 8/8 revisados; 3 ajustados.
- Navegação: 9/9 revisados; 3 ajustados.

## Alterações por conceito
- antes-da-tela/conceito-01 — UI ≠ UX: visualHtml.
- antes-da-tela/conceito-02 — As perguntas certas: application.
- antes-da-tela/conceito-03 — Usuário, objetivo, contexto: application.
- principios-visuais/conceito-02 — Contraste: visualHtml.
- leis-de-ux/conceito-02 — Lei de Fitts: visualHtml.
- leis-de-ux/conceito-08 — Efeito estética-usabilidade: observation, visualHtml.
- gestalt/conceito-08 — Simetria e boa forma (Prägnanz): title.
- heuristicas/conceito-03 — Controle e liberdade: visualHtml.
- heuristicas/conceito-06 — Reconhecimento > memória: observation, application.
- heuristicas/conceito-10 — Ajuda e documentação: visualHtml.
- marca-na-interface/conceito-01 — UI como ponto de contato: observation.
- marca-na-interface/conceito-06 — Momentos de marca: visualHtml.
- cor/conceito-01 — Por que HSL engana: observation, visualHtml.
- cor/conceito-05 — Contraste WCAG (calculado ao vivo): context.
- cor/conceito-07 — Dark mode não é inverter: visualHtml.
- cor/conceito-08 — Tokens e escalas: visualHtml.
- tipografia/conceito-01 — Anatomia: observation, visualHtml.
- tipografia/conceito-03 — Text vs display: visualHtml.
- tipografia/conceito-06 — Line-height: observation, visualHtml.
- tipografia/conceito-08 — Peso e cor de texto: visualHtml.
- tipografia/conceito-10 — Telas pequenas vs grandes: visualHtml.
- espacamento-grid/conceito-02 — O grid de 8pt: context.
- espacamento-grid/conceito-03 — Padding vs margin: observation.
- espacamento-grid/conceito-06 — Breakpoints: visualHtml.
- profundidade/conceito-05 — Sobreposição (z-index): context, application.
- profundidade/conceito-07 — Gradiente e volume: visualHtml.
- profundidade/conceito-08 — Motion como profundidade: visualHtml.
- iconografia/conceito-02 — Grid e formas-base: observation.
- iconografia/conceito-03 — Peso de traço consistente: observation.
- iconografia/conceito-06 — Ícone + label: observation.
- refinamento-optico/conceito-03 — Centro geométrico e centro percebido: observation, visualHtml.
- refinamento-optico/conceito-07 — Kerning em títulos: visualHtml.
- estados/conceito-01 — Cinco estados básicos de interação: title, context, observation, visualHtml.
- estados/conceito-06 — Disabled legível: context, visualHtml.
- estados/conceito-08 — Documentar estados: visualHtml.
- navegacao/conceito-01 — Wayfinding: application.
- navegacao/conceito-03 — Fitts: alvos de toque: observation, application, visualHtml.
- navegacao/conceito-08 — Estados de navegação: observation, visualHtml.

## Principais correções
- Comparações de contraste, entrelinha e estética agora preservam o conteúdo comparado.
- Breakpoints mostram efetivamente os mesmos seis blocos em uma, duas e três colunas.
- Alvos de toque mantêm três ícones e separam desenho visível de região interativa.
- Anatomia distingue altura de capitais de ascendentes; simetria não é apresentada como sinônimo de Prägnanz.
- Exemplos removem frases absolutas sobre desfazer, branco no tema escuro, 16 px no mobile e suposta documentação completa de componentes.
- Legenda tipográfica ganha contraste; HSL mantém também saturação constante para isolar a mudança de matiz.
- Estado vazio agora orienta salvar visitas e oferece caminho para explorar; código de convite explica origem e opcionalidade.
- Complementos sobre foco em modal, contextos de empilhamento, indisponibilidade, retorno com filtros e contraste/tamanho de alvo WCAG.

## Verificação técnica consultada
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

## Limites
Revisão de conteúdo e HTML, não auditoria visual renderizada de todas as telas. As miniaturas são didáticas e não representam medidas de produção. A verificação do layout final e interações deve usar o build publicado.
