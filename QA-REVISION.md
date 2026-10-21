# QA da revisão v17: conteúdo direto, sem exercícios

## Escopo atual, posterior à revisão anterior

O usuário retirou os exercícios e pediu explicações simples para iniciantes: o que é, para que serve, onde usar e melhores práticas. A abertura deve explicar UX, o problema, o público e os requisitos antes do trabalho visual. A versão mantém os mesmos 51 IDs de lição, 13 blocos, exemplos, progresso e a demonstração Gestalt aprovada.

As exigências anteriores de exercício, entrega obrigatória e checklist avaliativo não se aplicam à v17. Os testes foram alterados para verificar as quatro partes didáticas, objetivos claros e ausência da interface antiga de exercícios. Não foram removidas as verificações de figuras, estrutura segura, controles, contraste ou preservação de progresso.

## Estado v17

Primeira execução v17 em 21/10/2026, 21:27 UTC: build e toda a suite passaram. Resultado: 13 blocos, os mesmos 51 IDs, 12.652 palavras e 93 termos no glossário. Cada lição tem quatro seções didáticas abertas; não existem campos de exercício ou checklist avaliativo por módulo, nem os antigos rótulos de exercício/entrega na interface.

O teste de progresso agora também carrega e exporta todas as 51 lições atuais concluídas com posições distintas, além de testar o histórico de 40 IDs antigos. Todos sobrevivem; as duas lições históricas removidas continuam arquivadas sem concluir outras automaticamente.

Amostra editorial independente: abertura UX/UI, enquadramento e revisão do exemplo Rota, transparência/desfoque, kerning/curvas e acessibilidade. As explicações definem termos e usam exemplos concretos. A densidade do parágrafo de exceções de alvos acessíveis foi apontada para simplificação sem apagar a referência técnica.

Execução final após congelamento, 21/10/2026, 21:28 UTC (12.663 palavras finais): `python build.py`, `python validate-teaching.py` e os cinco `test-*.cjs` passaram novamente. O parágrafo de alvos acessíveis foi simplificado, com regra e exceções preservadas e detalhes remetidos à fonte. Nenhum bloqueio encontrado pela suite. Build de produção e gate ficam na integração. O histórico abaixo refere-se à revisão anterior.

---

# Histórico: QA da revisão anterior

## Escopo e critérios

A revisão exige 13 blocos, quatro módulos novos com 3–4 lições cada, objetivo e justificativa da posição, 3–5 critérios observáveis por módulo e por lição e 2–4 referências por módulo. A sequência de QA segue a proposta alternativa aprovada na conversa: tarefa → princípios → densidade → mobile → tipografia → cor → profundidade → óptica → identidade → caminhos → telas → acessibilidade → projeto. O DOCX permanece a fonte dos demais requisitos. A demonstração Gestalt já aprovada é preservada.

Os testes não fixam artificialmente o total em 41, não exigem um celular em todas as figuras e não pressupõem que todos os IDs antigos continuem sendo aulas ativas. Em vez disso, verificam a expansão, o conteúdo efetivamente renderizado e a preservação do progresso antigo por migração ou arquivo histórico.

## Verificações automatizadas preparadas

- `validate-teaching.py`: IDs e ordem dos 13 módulos, estrutura editorial, quatro novos módulos, critérios verificáveis, referências HTTPS, escopo curricular, HTML balanceado e ausência de elementos/atributos executáveis nos fragmentos autorais.
- `test-app.cjs`: renderização de todas as lições, presença de figuras principais abertas (complementos podem usar disclosure), ausência de `undefined`/`NaN`, HTML final balanceado, marcação/desmarcação, persistência após recarga, importação combinada, exportação JSON real via Blob, rejeição de JSON inválido/versão incompatível/arquivo excessivo, entradas com formato de XSS, cancelamento de limpeza sem mutação e busca sem distinção de acentos.
- O mesmo teste verifica os 40 IDs históricos e suas posições de leitura após carregar, exportar e importar. Progresso histórico não deve inflar o total de aulas ativas nem concluir uma substituta automaticamente.
- `test-color-contrast.cjs`: recalcula 17 pares sólidos selecionados, os quatro valores didáticos (7,13; 5,10; 2,52; 6,6869) e a fronteira #777777/#767676. O exemplo intencionalmente insuficiente requer transcrição legível. Não substitui medição de pixels ou fundos compostos.
- `test-learning-atlas.cjs`: conserva oito cartões de Gestalt, seis pontos em movimento, pausa inicial e alternância explícita reproduzir/pausar.
- `test-component-controls.cjs` e `test-realistic-scaling.cjs`: mantêm verificações de largura/tamanho de texto/grid, estados mutuamente exclusivos, zoom, dica de panorâmica e limpeza de observadores/listeners.

## Limites obrigatórios

Os testes de interface usam um DOM simulado e não equivalem a QA visual, teste em navegador real, certificação de contraste AA, leitor de tela ou comprovação de legibilidade em celulares. A inspeção de XSS cobre entradas e pontos de interpolação conhecidos; não é uma auditoria de segurança integral. Não houve deploy, modificação de autenticação/CSRF/gate nem limpeza do armazenamento do usuário.

## Resultado

Execução final em 21/10/2026, 21:00 UTC, após confirmação de conteúdo e figuras estáveis:

- `python build.py`: PASS. 13 módulos, 51 lições, 18.285 palavras de leitura e 12 arquivos públicos.
- `python validate-teaching.py`: PASS. 51 exemplos, estrutura/editorial/escopo/HTML conforme os checks descritos.
- `node test-app.cjs`: PASS. 51 lições renderizadas; 40 IDs legados e posições preservados; as duas aulas retiradas ficam no arquivo histórico e não concluem substitutas; importação desse histórico em perfil simulado novo funciona. Também passam exportação com armazenamento indisponível, rejeição de importações inválidas, links internos, ausência de links vazios e fallback textual não duplicado quando há figura principal real.
- `node test-color-contrast.cjs`: PASS. 17 pares sólidos de texto comum ≥4,5:1 e quatro razões didáticas recalculadas. Menor razão entre os pares aprovados auditados: ação branca/azul, 5,1025:1. O espécime 2,52:1 é intencionalmente insuficiente e tem transcrição legível.
- `node test-component-controls.cjs`: PASS.
- `node test-learning-atlas.cjs`: PASS.
- `node test-realistic-scaling.cjs`: PASS.
- `git diff --name-only -- app lib server scripts tests/password-gate`: nenhuma alteração no momento da auditoria.

Comando reprodutível: executar `python build.py`, `python validate-teaching.py` e cada arquivo `test-*.cjs` com Node, interrompendo no primeiro erro. `scripts/build-guide.mjs` já descobre automaticamente o novo teste de contraste.

Sem bloqueio funcional encontrado pela suite. O build de produção completo e os testes do gate permanecem sob responsabilidade da integração; este relatório não afirma que já passaram. Nenhum teste de socket/browser foi contornado ou escalado.

## Achados encaminhados durante a revisão

- Legenda de hierarquia descrevia somente tamanho/peso/espaço, mas a comparação também alterava contraste. Corrigida pelo responsável pelas figuras.
- Rótulos/cotas de figuras novas em 12–14 CSSpx: solicitado ajuste a 16 CSSpx para equivaler a 12pt.
- A legenda de ilustração em três escalas mencionava duas marcas: corrigida para tratar de geometria, escala e redução de detalhes.
- A preservação de histórico das duas lições removidas foi explicitada antes dos testes; sem aprovação automática das substitutas.

## Inspeção de XSS e limites de segurança

Os fragmentos autorais foram analisados para tags executáveis, atributos de evento e esquemas perigosos. O HTML de todas as 51 lições gerado em runtime foi novamente analisado quanto a equilíbrio de tags e atributos executáveis. Valores de título, navegação, referências e progresso passam pelo escape de strings do aplicativo; as figuras novas são templates autorais locais. A importação aceita somente identificadores reconhecidos, incluindo a lista explícita de IDs históricos, e posições finitas dentro do intervalo permitido. Uma entrada de progresso com payload `<img ... onerror>` foi rejeitada como ID e não foi persistida.

Isso não transforma o validador em sanitizador geral e não certifica o aplicativo contra todas as classes de XSS. O conteúdo de seções/análises continua sendo HTML autoral confiável por arquitetura. Links externos foram validados sintaticamente como HTTPS; disponibilidade, gratuidade de cada destino e alterações futuras da documentação não foram rechecadas nesta etapa.

## Achados corrigidos antes do fechamento

O título da aula de grid agora segue conceito + propósito. As análises das 12 lições novas foram harmonizadas com as figuras efetivamente geradas. A atribuição de exemplo autoral não cria URL fictícia nem link vazio; aprofundamento continua nas fontes reais da lição. A demonstração de expressividade usa três intensidades do mesmo Rota e não repete a comparação de duas marcas.
