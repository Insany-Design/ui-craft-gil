import {createPublicGuide} from '../../server/public-guide.mjs';
import assets from '../../server/private-assets.mjs';
export const dynamic='force-dynamic';
const route=createPublicGuide(assets);
export {route as GET,route as POST,route as HEAD,route as PUT,route as PATCH,route as DELETE,route as OPTIONS};
