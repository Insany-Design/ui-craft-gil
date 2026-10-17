# UX do gate sem alterar o curso — 2026-10-17 05:01 UTC

Alterações locais, ainda não publicadas:
- Administração: aviso explícito “Crie uma senha exclusiva para este material. Não use a senha da sua conta ChatGPT.”
- Campo “Nova senha compartilhada”; confirmação nomeada de modo correspondente.
- GET/login sem course_config mostra “Acesso em preparação”, aguarda senha do professor e oferece verificar novamente; não mostra formulário impossível nem cria cookie CSRF.
- Erros de senha, confirmação, CSRF, rate e indisponibilidade usam layout do gate e link fixo de retorno, sem interpolar valores enviados.
- Validação de tamanho/igualdade, rate, CSRF, sessões e bootstrap inalterados. ADMIN_SETUP_ENABLED=false.

Validação nova:16/16 testes gate passaram; quatro testes frontend e validação41lições passaram no build completo oficial; TypeScript, probe workerd/D1 e inspeção client/privateassets passaram. Smoke hospedado atualizado para estado sem configuração, mas não executado por este agente contra a versão nova. Resultado hospedado da v11 foi informado pelo root e pertence à versão anterior.

57 arquivos source e12 arquivos frontend permanecem byte-idênticos ao baseline aprovado. O próprio server/private-assets.mjs e guide-dist/course.json mantêm os mesmos SHA256 pré-ajuste. Hash agregado frontend inalterado:
f221275fa705861b739a37c59b680bfe6fe27fd2b0fb46f157ebe932338e225c

A melhoria não habilita setup ou cria senha. Ainda cabe ao root decidir publicação/handoff e verificar condições operacionais restantes.
