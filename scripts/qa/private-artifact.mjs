import {readFileSync,readdirSync,statSync} from 'node:fs';
import assert from 'node:assert/strict';
import assets from '../../server/private-assets.mjs';
const files=readdirSync('dist/client',{recursive:true}).filter(p=>statSync('dist/client/'+p).isFile());
const course=JSON.parse(Buffer.from(assets['/course.json'].base64,'base64').toString('utf8'));
const contentMarkers=course.chapters.flatMap(c=>[c.subtitle,c.callout,'"id":"'+c.id+'"']);
const forbidden=[...contentMarkers,'gilberto@insany.com.br','password_hash','course_config','scrypt$32768','PRIVATE COURSE',...Object.values(assets).map(a=>a.base64.slice(0,120))];
for(const file of files){const body=readFileSync('dist/client/'+file,'utf8');for(const marker of forbidden)assert(!body.includes(marker),'Private marker in '+file);assert(!Object.hasOwn(assets,'/'+file),'Private file in client '+file)}
assert(!JSON.parse(readFileSync('dist/.openai/hosting.json','utf8')).static);
console.log(JSON.stringify({clientFilesChecked:files.length,privateAssetsCompared:Object.keys(assets).length,privateMarkersFound:0,staticManifestRemoved:true}));
