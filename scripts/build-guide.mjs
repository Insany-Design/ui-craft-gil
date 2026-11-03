// The craft edition replaces the earlier 54-lesson curriculum and its layout checks.
// Keep the password gate and asset embedding in the production build.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const [command,args] of [
 ['python3',['build.py']],
 ['node',['test-craft.cjs']],
 ['node',['--test','tests/password-gate/gate.test.mjs']],
 ['node',['scripts/embed-assets.mjs',path.join(root,'guide-dist'),path.join(root,'server/private-assets.mjs')]]
]){const result=spawnSync(command,args,{cwd:root,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
