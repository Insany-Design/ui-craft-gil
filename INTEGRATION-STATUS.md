# Integração local da proteção — etapa 1

Concluída em 2026-10-17 às 04:53 UTC no checkout existente, depois da reconciliação de fonte feita pelo root. Sem chamadas Sites, provisão remota, publicação, senha real ou configuração administrativa persistente.

## Conteúdo preservado

41 lições,9 módulos,18.005 palavras,57 arquivos source e12 arquivos frontend. Fonte e frontend byte-idênticos à versão aprovada imediatamente antes da integração, incluindo as referências finais de livros.

SHA256 agregado frontend antes/depois:
f221275fa705861b739a37c59b680bfe6fe27fd2b0fb46f157ebe932338e225c

SHA256 agregado source antes/depois:
8287acaf895284623a40d1e88d3a0e7e25da3af34f361192f6e64b278eb69c2d

Manifesto de hashes por arquivo e método em INTEGRATION-FRONTEND-HASHES.json. Agregado é SHA256 do JSON dos hashes ordenados por chave, sem espaços. Assets privados embutidos foram decodificados e comparados individualmente ao frontend aprovado.

## Build e testes executados

- Installer oficial concluído sem paralelismo; lockfile preservado.
- Build oficial Sites executa build-guide e depois Vinext.
- validate-teaching.py: passou para41lições; mantém40IDs legados e nova lição aprovada.
- test-app.cjs, test-learning-atlas.cjs, test-component-controls.cjs e test-realistic-scaling.cjs: passaram.
- 13/13 testes gate: passaram.
- tsc --noEmit: passou.
- Bundle real em workerd/Miniflare+D1 local em memória: conteúdo anônimo401/no-store, /303, /login200, admin anônimo303, POST administrador503, zero registros de configuração.
- dist/client:13 arquivos inspecionados contra12assets privados, IDs/títulos41lições e marcadores administrativos; nenhum encontrado.
- Nenhuma fonte de pesquisa foi copiada para public/dist/client. Fonte existente permanece preservada sob source, fora do conteúdo público entregue pelo Worker.

## Manifesto final

project_id: appgprj_6ad2b6dae9d48191b21e4280c8370584
d1: DB
r2: null
static: removido

ADMIN_SETUP_ENABLED=false. É configuração de código; não existe toggle público. O manifesto declara D1, mas não provisiona recurso até o root executar fluxo remoto autorizado. Testes locais não provam quotas, custos nem fronteira do dispatch hospedado.

## Operação do projeto

build.py gera guide-dist; scripts/build-guide.mjs valida todos os testes frontend e reembute os arquivos atuais em server/private-assets.mjs. Framework gera dist final. Não copiar guide-dist nem fontes para dist/client/public. Backups pré-migração estão apenas em .sites-runtime ignorado. Mantidos validadores históricos com caminhos migrados; não os usar para aprovar a edição41 porque preservam expectativas antigas.

Comandos locais:
- node --test tests/password-gate/gate.test.mjs
- node /home/agent/.codex/plugins/cache/openai-curated-remote/sites/1.0.0/scripts/build-site.mjs
- ./node_modules/.bin/tsc --noEmit
- CLOUDFLARE_CF_FETCH_ENABLED=false node scripts/qa/built-gate.mjs
- node scripts/qa/private-artifact.mjs

## Smoke hospedado para root

Somente após confirmar deploy da versão pretendida:
node scripts/smoke-hosted-stage1.mjs

Esse script faz apenas GET/HEAD no domínio fixo existente, sem credentials/cookies nem POST. Verifica assets/HEAD/chunk privado, redirect/login e rejeição de identidade forjada. Não imprime bodies/cookies. Falha imediatamente se dados privados ou diagnóstico administrativo forem acessíveis anonimamente. Ainda NÃO foi executado contra produção.

Completar separadamente: dono real e conta diferente em browser top-level; setup false/DB sem configuração anterior; inexistência de hostname alternativo que evite dispatch; URLs de versões anteriores/caches; recursos/custos/throughput. Só após isso habilitar etapa2 em nova versão e entregar ao usuário o preenchimento/submissão da senha. false impede mutação administrativa, não revoga sessões de configuração antiga; confirmar DB inicialmente vazio.

ZIP de recuperação integrado não substitui archive de publicação oficial. Root faz packaging/commit/push/save/deploy pelo helper do mesmo Site. Não fazer rollback silencioso para versão estática pública.
