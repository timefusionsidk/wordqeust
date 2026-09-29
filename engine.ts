import {chapters} from './data'
export type P=[number,number]
export type Save={done:Record<string,number>;cur:{c:number;i:number;pts:number;miss:P[]}|null;weak:string[];muted:boolean;rate:number;calm:boolean}
export const fresh=():Save=>({done:{},cur:null,weak:[],muted:false,rate:1,calm:false})
const K='wordquest.save.v1'
export const norm=(t:string)=>t.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()
export const checkBuild=(w:string[],v:string[])=>v.map(norm).includes(norm(w.join(' ')))
export const gain=(wrong:number,hints:number)=>Math.max(0,3-wrong-hints*0.5)
export const stars=(p:number,m:number)=>{const r=m?p/m:0;return r>=0.85?3:r>=0.6?2:1}
export const unlocked=(s:Save,c:number)=>c===0||s.done[chapters[c-1].id]!==undefined
export const parseSave=(raw:string|null):Save=>{try{const o=JSON.parse(raw??'');return o&&typeof o==='object'&&o.done&&Array.isArray(o.weak)?{...fresh(),...o}:fresh()}catch{return fresh()}}
export const load=()=>{try{return parseSave(localStorage.getItem(K))}catch{return fresh()}}
export const store=(s:Save)=>{try{localStorage.setItem(K,JSON.stringify(s))}catch{/* storage unavailable */}}
