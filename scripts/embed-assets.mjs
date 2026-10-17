// Server-only embedding. Two absolute paths; output ends in server/private-assets.mjs.
import {readdir,readFile,writeFile,mkdir,lstat} from 'node:fs/promises';
import path from 'node:path';
const [input,output]=process.argv.slice(2);
if(!input||!output||!path.isAbsolute(input)||!path.isAbsolute(output)||!output.endsWith('/server/private-assets.mjs'))throw new Error('Expected absolute input and server/private-assets.mjs output');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.txt':'text/plain; charset=utf-8'};
const assets={};
async function walk(dir){for(const name of (await readdir(dir)).sort()){
 const file=path.join(dir,name),stat=await lstat(file);
 if(stat.isSymbolicLink())throw new Error('Symlink rejected');
 if(stat.isDirectory()){await walk(file);continue}
 if(!stat.isFile()||name.startsWith('.')||name.endsWith('.map'))throw new Error('Unexpected private asset');
 const type=types[path.extname(file)];if(!type)throw new Error('Review asset type '+path.extname(file));
 assets['/'+path.relative(input,file).split(path.sep).join('/')]={type,base64:(await readFile(file)).toString('base64')};
}}
await walk(input);await mkdir(path.dirname(output),{recursive:true});
await writeFile(output,'// SERVER ONLY. Never copy to public or dist/client or import from a client component.\nexport default '+JSON.stringify(assets)+';\n');
console.log(JSON.stringify({embeddedPrivateAssets:Object.keys(assets).length}));
