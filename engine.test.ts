import {describe,it,expect} from 'vitest'
import {chapters} from './data'
import {checkBuild,fresh,parseSave,stars,unlocked,gain,norm} from './engine'
describe('engine',()=>{
it('unlocks the next chapter only after completion',()=>{const s=fresh();expect(unlocked(s,0)).toBe(true);expect(unlocked(s,1)).toBe(false);s.done[chapters[0].id]=2;expect(unlocked(s,1)).toBe(true)})
it('accepts every authored build order, ignoring case and punctuation',()=>{expect(checkBuild(['Could','I','have','a','large','tea','please'],['could i have a large tea please','can i have a large tea please'])).toBe(true);expect(checkBuild(['Can','I','have','a','large','tea','please'],['could i have a large tea please','can i have a large tea please'])).toBe(true);expect(checkBuild(['tea','Could'],['could i have a large tea please'])).toBe(false)})
it('scores and awards stars',()=>{expect(gain(0,0)).toBe(3);expect(gain(3,0)).toBe(0);expect(gain(0,1)).toBe(2.5);expect(stars(12,12)).toBe(3);expect(stars(6,12)).toBe(1)})
it('recovers from a corrupt save and keeps a valid one',()=>{expect(parseSave('{bad')).toEqual(fresh());expect(parseSave(null)).toEqual(fresh());expect(parseSave(JSON.stringify({...fresh(),done:{a:3}})).done.a).toBe(3)})
it('content is well formed',()=>{expect(chapters.length).toBe(6);chapters.forEach(c=>c.enc.forEach(e=>{if(e.k==='build')expect(norm(e.v![0]).split(' ').sort()).toEqual(e.w!.map(norm).sort());else expect(e.a!).toBeLessThan(e.o!.length)}))})
})
