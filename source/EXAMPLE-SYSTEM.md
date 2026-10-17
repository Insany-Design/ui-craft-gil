# Rota · sistema dos exemplos didáticos

Amostra autoral criada em 17/10/2026. Referência de acabamento escolhida pelo usuário: AlignUI. Não reproduzir os templates PRO nem redistribuir o arquivo Figma. Aplicar este sistema apenas aos exemplos; preservar o shell branco/cinza/azul e a tipografia de sistema do curso.

## Fontes verificadas
- Markdown: https://raw.githubusercontent.com/alignui/cli/master/README.md (CLI; não é documentação completa dos componentes).
- Markdown: https://raw.githubusercontent.com/alignui/alignui-nextjs-typescript-starter/master/README.md (starter).
- Tokens públicos: https://raw.githubusercontent.com/alignui/cli/master/src/utils/tokens.ts
- Alteração verificada dos tokens: https://github.com/alignui/cli/commit/07f37c8346138b2f8324c437eb401194cf156ddd (07/06/2026).
- Documentação HTML v1.2: https://alignui.com/docs/v1.2/foundation/color e https://alignui.com/docs/v1.2/foundation/typography
- Componentes: /docs/v1.2/ui/button, /input, /modal, /popover, /fancy-button no domínio alignui.com.
- Licença Base Components: https://www.alignui.com/license (MIT, 02/12/2024). Não atribuir essa licença a PRO ou a fotos de terceiros.
- Figma fornecido: WXbrQ8TUIpivPVaQHO2y2C. Conector lista apenas Cover (0:1) e Brand (2771:1469). Contexto e variáveis do cartão 2798:1154 confirmam Inter/Inter Display, #171717, #5C5C5C, #EBEBEB, #F7F7F7 e raio16. Original não editado.
- llms.txt, llms-full.txt e rotas Markdown de componentes não ficaram acessíveis. Não alegar que foram lidas.

## Tokens, não valores avulsos
- Texto principal #171717, apoio #5C5C5C. Não usar #A3A3A3 para texto necessário pequeno.
- Fundo #FFFFFF; superfície #F7F7F7; divisória decorativa #EBEBEB.
- Ação #335CFF; texto tonal #2547D0 sobre #EBEFFF. #335CFF sobre esse fundo não alcança 4,5:1; preservar o par corrigido.
- Inter local, SIL OFL1.1. Títulos 24/32 e 20/28 peso500; corpo16/24 peso400; rótulos14/20 peso500; apoio12/16 apenas complementar. Não impor um mínimo universal.
- Raios:8/10 em controles,16 em cards e popovers,20 em modais. Bordas1px. Regular-xs:0 1px 2px #0a0d1408. Reservar elevação maior para sobreposição.
- Layout: grupos24px; componentes12/16px; rótulo→controle8px; ícone→texto8px. Esta é uma escolha deste projeto, não uma lei universal do AlignUI.
- Mobile: área interativa dos controles principais48 CSSpx no exemplo web; demonstrar diferenças CSSpx/pt/dp no texto quando necessário. Alturas web nativas28–40px não são automaticamente alvos adequados no mobile.
- Acessibilidade: quando o limite do controle for necessário para reconhecê-lo, usar contorno com contraste suficiente (neutral500 #7B7B7B ou mais forte), não a divisória decorativa #EBEBEB. Foco com contorno escuro + halo e sem depender apenas da cor. Erro com mensagem, ícone e borda. Estados desabilitados acompanhados de explicação, nunca usados para esconder o motivo.

## Contrato editorial e técnico
- Cada lição recebe composição própria pertinente ao conceito, com o mesmo sistema. Não repetir uma tela sem mudar o recorte/estado e a análise.
- Rota é fictício: descobrir visita cultural, comparar, salvar plano. Salvar não compra nem reserva. Lugares, conteúdo e resultados de pesquisa demonstrativos devem ser identificados como fictícios.
- Exemplos serão HTML responsivo quando a interação ou adaptação fizer diferença; imagens vetoriais originais apenas para conteúdo visual ou diagramas pertinentes.
- Nenhum contato real, conta, pagamento, analytics, localização ou serviço externo nas demonstrações. Exemplos estáticos não armazenam dados. O progresso do curso é mantido separadamente no navegador.
- Não transformar toda demonstração em tela com ações falsas. Quando estático, dizer claramente que é uma composição demonstrativa; quando interativo, só mostrar botões com comportamento implementado.
- Análise: o que observar, decisão, benefício esperado, limite/tradeoff, como testar. Não inventar evidência de resultado.
- Preservar IDs, ordem, conteúdo teórico, progresso ui-mobile-study-v2 e exemplos inline. Alterar rótulo “Exemplos reais analisados” para “Exemplos aplicados” ao integrar as composições autorais.
