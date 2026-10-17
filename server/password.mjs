// Server-only; never import into a client component.
import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
const PARAMS = {N:32768,r:8,p:3,maxmem:48*1024*1024};
export const randomToken=()=>randomBytes(32).toString('hex');
export const digest=value=>createHash('sha256').update(value).digest('hex');
export const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
export const validPassword=value=>typeof value==='string'&&value.length>=8&&Buffer.byteLength(value)<=256;
const derive=(password,salt)=>new Promise((resolve,reject)=>scrypt(password,salt,32,PARAMS,(error,result)=>error?reject(error):resolve(result)));
export async function hashPassword(password){
 if(!validPassword(password))throw new Error('Password policy');
 const salt=randomBytes(16).toString('hex');
 return `scrypt$32768$8$3$${salt}$${(await derive(password,salt)).toString('hex')}`;
}
export async function verifyPassword(password,record){
 if(!validPassword(password)||typeof record!=='string')return false;
 const match=/^scrypt\$32768\$8\$3\$([a-f0-9]{32})\$([a-f0-9]{64})$/.exec(record);
 return !!match&&equal((await derive(password,match[1])).toString('hex'),match[2]);
}
