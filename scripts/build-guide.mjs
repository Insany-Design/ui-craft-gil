// Course output is guide-dist; Vinext output is dist. Never mix them.
import {spawnSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tests=readdirSync(root).filter(name=>/^test-.*\.cjs$/.test(name)).sort();
for(const required of ['test-app.cjs','test-learning-atlas.cjs','test-component-controls.cjs','test-realistic-scaling.cjs'])if(!tests.includes(required))throw new Error('Missing course QA test: '+required);
const commands=[['python3',['build.py']],['python3',['validate-teaching.py']],...tests.map(name=>['node',[name]]),['node',['scripts/embed-assets.mjs',path.join(root,'guide-dist'),path.join(root,'server/private-assets.mjs')]]];
for(const [command,args] of commands){const result=spawnSync(command,args,{cwd:root,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
