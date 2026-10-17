// Place in app/[[...path]]/route.ts. Remove starter app/page.tsx and public assets.
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../chatgpt-auth';
import {createGate} from '../../server/gate.mjs';
import {ADMIN_SETUP_ENABLED} from '../../server/config.mjs';
import assets from '../../server/private-assets.mjs';
export const dynamic='force-dynamic';
async function route(request:Request){
 const db=env.DB?.withSession('first-primary');
 return createGate({db,assets,getIdentity:getChatGPTUser,setupEnabled:ADMIN_SETUP_ENABLED})(request);
}
export {route as GET,route as POST,route as HEAD,route as PUT,route as PATCH,route as DELETE,route as OPTIONS};
