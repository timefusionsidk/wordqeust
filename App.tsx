import {useEffect,useState} from 'react'
import {Volume2,VolumeX,Lightbulb,Lock,Star,ArrowRight,RotateCcw,Eye} from 'lucide-react'
import {chapters,type Enc} from './data'
import {checkBuild,stars,unlocked,load,store,fresh,gain,type Save,type P} from './engine'

type V={t:'home'|'map'|'info'|'end'}|{t:'play';c:number;items:P[];practice:boolean;start?:{i:number;pts:number;miss:P[]}}|{t:'result';c:number;pts:number;max:number;miss:P[];practice:boolean}
type PV=Extract<V,{t:'play'}>
const btn='inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-4 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:opacity-50'
const pri=btn+' bg-indigo-700 text-white hover:bg-indigo-800'
const sec=btn+' border border-stone-300 bg-white hover:bg-stone-50'
const label={choose:'Choose your reply',build:'Build a sentence',listen:'Listen and respond',meaning:'Spot the meaning',convo:'Conversation challenge'}
const speak=(t:string,r:number)=>{if(!('speechSynthesis' in window))return;const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=r;speechSynthesis.cancel();speechSynthesis.speak(u)}
function useTts(){const [n,setN]=useState(0);useEffect(()=>{if(!('speechSynthesis' in window))return;const f=()=>setN(speechSynthesis.getVoices().length);f();speechSynthesis.addEventListener('voiceschanged',f);return()=>speechSynthesis.removeEventListener('voiceschanged',f)},[]);return n>0}
const Logo=()=><svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#4338ca"/><path d="M12 20l9 26 11-20 11 20 9-26" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="32" cy="12" r="4" fill="#fbbf77"/></svg>
const Scene=({n}:{n:number})=><svg viewBox="0 0 320 120" role="img" aria-label={chapters[n].place+' (illustration)'} className="w-full rounded-xl"><rect width="320" height="120" fill={`hsl(${230+n*18} 60% 94%)`}/><circle cx={60+n*35} cy="40" r="18" fill={`hsl(${30+n*10} 90% 75%)`}/><path d="M0 120V80l40-30 50 25 60-45 70 40 50-25 90 35v40z" fill={`hsl(${240+n*12} 45% 60%)`}/><rect y="100" width="320" height="20" fill="hsl(240 30% 30%)"/></svg>
const Stars=({n}:{n:number})=><span className="inline-flex items-center gap-0.5" aria-label={`${n} of 3 stars`}>{[1,2,3].map(i=><Star key={i} className={`h-4 w-4 ${i<=n?'fill-amber-400 text-amber-500':'text-stone-300'}`} aria-hidden="true"/>)}</span>

function EncView({e,s,tts,done}:{e:Enc;s:Save;tts:boolean;done:(w:number,h:number)=>void}){
  const [sel,setSel]=useState<number|null>(null),[b,setB]=useState<number[]>([]),[fb,setFb]=useState<''|'ok'|'bad'>(''),[w,setW]=useState(0),[h,setH]=useState(0),[hint,setHint]=useState(false),[txt,setTxt]=useState(false)
  const isB=e.k==='build',listen=e.k==='listen',showLine=!!e.line&&(!listen||txt||!tts),locked=fb==='ok'
  const check=()=>{const ok=isB?checkBuild(b.map(i=>e.w![i]),e.v!):sel===e.a;if(ok)setFb('ok');else{setFb('bad');setW(x=>x+1)}}
  const retry=()=>{setFb('');setSel(null);setB([])}
  return <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{label[e.k]}</p>
    {e.line&&<div className="mt-3 flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4">
      <button className={sec} onClick={()=>speak(e.line!,s.rate)} disabled={!tts||s.muted} aria-label={s.muted?'Sound is off':'Play the spoken line'}><Volume2 className="h-5 w-5" aria-hidden="true"/></button>
      <div><p className="text-lg">{showLine?`“${e.line}”`:'Spoken line. Press play, or show the text.'}</p>
      {!tts&&<p className="mt-1 text-sm text-stone-600">Speech is not available in this browser, so the line is shown as text.</p>}
      {tts&&s.muted&&<p className="mt-1 text-sm text-stone-600">Sound is off. Show the text to read the line.</p>}
      {listen&&tts&&<button className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-indigo-700 underline" onClick={()=>setTxt(t=>!t)}><Eye className="h-4 w-4" aria-hidden="true"/>{txt?'Hide text':'Show text'}</button>}</div></div>}
    <h2 className="mt-4 text-xl font-semibold">{e.q}</h2>
    {isB?<div className="mt-4"><p className="text-sm text-stone-600">Tap words to build your sentence. Tap a chosen word to remove it.</p>
      <div className="mt-2 flex min-h-14 flex-wrap gap-2 rounded-xl border border-dashed border-stone-400 bg-white p-2" aria-label="Your sentence">{b.map(i=><button key={i} className={pri} disabled={locked} onClick={()=>setB(b.filter(x=>x!==i))}>{e.w![i]}</button>)}</div>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Word bank">{e.w!.map((x,i)=>b.includes(i)?null:<button key={i} className={sec} disabled={locked} onClick={()=>setB([...b,i])}>{x}</button>)}</div></div>
    :<div className="mt-4 grid gap-2">{e.o!.map((o,i)=><button key={i} aria-pressed={sel===i} disabled={locked||fb==='bad'} onClick={()=>setSel(i)} className={`${btn} justify-start rounded-xl border py-3 text-left ${sel===i?'border-indigo-700 bg-indigo-50 ring-2 ring-indigo-700':'border-stone-300 bg-white hover:bg-stone-50'}`}>{o}</button>)}</div>}
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {fb===''&&<button className={pri} onClick={check} disabled={isB?b.length===0:sel===null}>Check answer</button>}
      {fb==='bad'&&<button className={pri} onClick={retry}><RotateCcw className="h-4 w-4" aria-hidden="true"/>Try again</button>}
      {fb==='ok'&&<button className={pri} onClick={()=>done(w,h)}>Continue<ArrowRight className="h-4 w-4" aria-hidden="true"/></button>}
      {!locked&&<button className={sec} onClick={()=>{setHint(true);if(!hint)setH(1)}} aria-expanded={hint}><Lightbulb className="h-4 w-4" aria-hidden="true"/>Hint</button>}
    </div>
    {hint&&!locked&&<p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm">Hint: {e.h} <span className="text-stone-600">(Using a hint costs half a point. You can always continue.)</span></p>}
    <div role="status" aria-live="polite">{fb&&<p className={`mt-4 rounded-xl border p-4 ${fb==='ok'?'border-emerald-300 bg-emerald-50':'border-rose-300 bg-rose-50'}`}><strong>{fb==='ok'?'Correct. ':'Not quite. '}</strong>{e.e}</p>}</div>
  </div>
}

function Play({v,s,setS,tts,go}:{v:PV;s:Save;setS:(f:(x:Save)=>Save)=>void;tts:boolean;go:(v:V)=>void}){
  const [idx,setIdx]=useState(v.start?.i??0),[pts,setPts]=useState(v.start?.pts??0),[miss,setMiss]=useState<P[]>(v.start?.miss??[]),[intro,setIntro]=useState(!v.practice&&!v.start)
  const [c,i]=v.items[idx],ch=chapters[c],e=ch.enc[i],n=v.items.length
  const done=(w:number,h:number)=>{
    const id=c+':'+i,np=pts+gain(w,h),nm:P[]=w>0?[...miss,[c,i]]:miss,last=idx+1>=n
    setS(x=>({...x,weak:w>0?[...new Set([...x.weak,id])]:x.weak.filter(k=>k!==id),cur:v.practice?x.cur:last?null:{c:v.c,i:idx+1,pts:np,miss:nm},done:!v.practice&&last?{...x.done,[ch.id]:Math.max(x.done[ch.id]??0,stars(np,n*3))}:x.done}))
    if(last)go({t:'result',c:v.c,pts:np,max:n*3,miss:nm,practice:v.practice});else{setIdx(idx+1);setPts(np);setMiss(nm)}
  }
  return <div className="grid gap-6 md:grid-cols-[minmax(0,340px)_1fr]">
    <aside><Scene n={c}/><h1 className="mt-3 text-2xl font-semibold">{v.practice?'Practice: '+ch.t:ch.t}</h1><p className="text-sm text-stone-600">{ch.place}</p>
      {!intro&&<div className="mt-3"><div className="h-2 overflow-hidden rounded bg-stone-200" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={idx} aria-label="Chapter progress"><div className="h-full bg-indigo-700 transition-all" style={{width:`${idx/n*100}%`}}/></div><p className="mt-1 text-sm">Step {idx+1} of {n}</p></div>}</aside>
    <section className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm">
      {intro?<div><p className="text-lg">{ch.intro}</p><p className="mt-3 text-sm text-stone-600">You will practise: {ch.skills.join(', ')}. There are no timers. Mistakes are explained and you can try again.</p><button className={pri+' mt-4'} onClick={()=>setIntro(false)}>Begin chapter<ArrowRight className="h-4 w-4" aria-hidden="true"/></button></div>
      :<EncView key={idx+'-'+c} e={e} s={s} tts={tts} done={done}/>}
    </section></div>
}

const ans=(e:Enc)=>e.k==='build'?e.v![0]:e.o![e.a!]
function Result({v,s,go,start}:{v:Extract<V,{t:'result'}>;s:Save;go:(v:V)=>void;start:(c:number)=>void}){
  const st=stars(v.pts,v.max),all=chapters.every(c=>s.done[c.id]!==undefined),nxt=v.c+1
  return <div className="mx-auto max-w-2xl" role="status"><h1 className="text-3xl font-semibold">{v.practice?'Practice complete':`${chapters[v.c].t} complete`}</h1>
    {!v.practice&&<p className="mt-2 flex items-center gap-2"><Stars n={st}/> {v.pts} of {v.max} points</p>}
    <h2 className="mt-6 text-xl font-semibold">Review</h2>
    {v.miss.length===0?<p className="mt-2">No mistakes this time. Nicely done.</p>:<ul className="mt-2 grid gap-3">{v.miss.map(([c,i],k)=>{const e=chapters[c].enc[i];return <li key={k} className="rounded-xl border border-stone-200 bg-white p-4"><p className="font-medium">{e.q}</p><p className="mt-1 text-sm">Best answer: <strong>{ans(e)}</strong></p><p className="mt-1 text-sm text-stone-700">{e.e}</p></li>})}</ul>}
    <div className="mt-6 flex flex-wrap gap-2">
      {!v.practice&&nxt<6&&<button className={pri} onClick={()=>start(nxt)}>Next chapter<ArrowRight className="h-4 w-4" aria-hidden="true"/></button>}
      {!v.practice&&all&&<button className={pri} onClick={()=>go({t:'end'})}>See the ending</button>}
      {!v.practice&&<button className={sec} onClick={()=>start(v.c)}>Replay chapter</button>}
      <button className={sec} onClick={()=>go({t:'map'})}>Chapter map</button></div></div>
}

function MapView({s,setS,start,resume,practice}:{s:Save;setS:(f:(x:Save)=>Save)=>void;start:(c:number)=>void;resume:()=>void;practice:()=>void}){
  const [ask,setAsk]=useState(false)
  return <div><h1 className="text-3xl font-semibold">Chapter map</h1><p className="mt-1 text-stone-600">Finish a chapter to unlock the next. Replay any completed chapter.</p>
    <div className="mt-3 flex flex-wrap gap-2">{s.cur&&<button className={pri} onClick={resume}>Resume: {chapters[s.cur.c].t}, step {s.cur.i+1}</button>}{s.weak.length>0&&<button className={sec} onClick={practice}>Gentle practice ({s.weak.length} to review)</button>}</div>
    <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{chapters.map((c,n)=>{const open=unlocked(s,n),d=s.done[c.id]
      return <li key={c.id} className="rounded-2xl border border-stone-200 bg-white p-4"><Scene n={n}/><div className="mt-3 flex items-center justify-between gap-2"><h2 className="font-semibold">{n+1}. {c.t}</h2>{d!==undefined?<Stars n={d}/>:!open&&<Lock className="h-4 w-4" aria-label="Locked"/>}</div>
        <p className="text-sm text-stone-600">{c.skills[0]}</p><p className="mt-1 text-sm font-medium">{d!==undefined?'Completed':open?'Available':'Locked: finish the previous chapter'}</p>
        <button className={(d!==undefined?sec:pri)+' mt-3 w-full'} disabled={!open} onClick={()=>start(n)}>{d!==undefined?'Replay':'Play'}</button></li>})}</ol>
    <div className="mt-8 border-t border-stone-200 pt-4">{!ask?<button className={sec} onClick={()=>setAsk(true)}><RotateCcw className="h-4 w-4" aria-hidden="true"/>Reset progress</button>:<div role="alertdialog" aria-label="Confirm reset"><p>This deletes all saved progress on this device. Continue?</p><div className="mt-2 flex gap-2"><button className={pri} onClick={()=>{setS(()=>fresh());setAsk(false)}}>Yes, reset</button><button className={sec} onClick={()=>setAsk(false)}>Cancel</button></div></div>}</div></div>
}

const Legal=()=><div className="mx-auto max-w-2xl space-y-6"><h1 className="text-3xl font-semibold">Privacy, Terms and Contact</h1>
  <section><h2 className="text-xl font-semibold">Privacy Policy</h2><p className="mt-2">WordQuest needs no account. Your progress and settings are stored only in this browser (local storage) and can be deleted with Reset progress. This build has no analytics and no ads configured. Spoken lines use your browser’s built-in speech voices; depending on your browser and device, a voice may be provided by an online service, and this app does not control that. The game never uses your microphone.</p></section>
  <section><h2 className="text-xl font-semibold">Terms of Use</h2><p className="mt-2">WordQuest is provided free for personal learning, as is, without warranty. Content is for practice and is not a formal qualification or professional advice.</p></section>
  <section><h2 className="text-xl font-semibold">Contact</h2><p className="mt-2">Contact details placeholder: hello@example.com (replace before launch).</p></section></div>

export default function App(){
  const [s,setS]=useState<Save>(load),[v,setV]=useState<V>({t:'home'}),tts=useTts()
  useEffect(()=>{store(s)},[s]);useEffect(()=>{document.documentElement.classList.toggle('calm',s.calm)},[s.calm])
  const upd=(p:Partial<Save>)=>setS(x=>({...x,...p}))
  const go=(x:V)=>{setV(x);window.scrollTo(0,0)}
  const start=(c:number)=>go({t:'play',c,practice:false,items:chapters[c].enc.map((_,i)=>[c,i] as P)})
  const resume=()=>s.cur&&go({t:'play',c:s.cur.c,practice:false,items:chapters[s.cur.c].enc.map((_,i)=>[s.cur!.c,i] as P),start:{i:s.cur.i,pts:s.cur.pts,miss:s.cur.miss}})
  const practice=()=>go({t:'play',c:-1,practice:true,items:s.weak.map(k=>k.split(':').map(Number) as P)})
  const skills=[...new Set(chapters.flatMap(c=>c.skills))]
  return <div className="min-h-screen bg-[#faf8f4] text-[#23232b]">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-white focus:p-2">Skip to content</a>
    <header className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-2 md:px-8">
      <button className="inline-flex min-h-11 items-center gap-2 font-semibold" onClick={()=>go({t:'home'})}><Logo/>WordQuest</button>
      <nav className="flex items-center gap-2" aria-label="Settings and navigation">
        <button className={sec} aria-pressed={s.muted} aria-label={s.muted?'Turn sound on':'Turn sound off'} onClick={()=>upd({muted:!s.muted})}>{s.muted?<VolumeX className="h-5 w-5"/>:<Volume2 className="h-5 w-5"/>}</button>
        {tts&&<select aria-label="Speech speed" className={sec+' px-2'} value={s.rate} onChange={ev=>upd({rate:Number(ev.target.value)})}><option value={0.7}>Slow</option><option value={1}>Normal</option><option value={1.2}>Fast</option></select>}
        <button className={sec} aria-pressed={s.calm} onClick={()=>upd({calm:!s.calm})}>Calm<span className="hidden sm:inline"> motion</span></button>
        <button className={sec} onClick={()=>go({t:'map'})}>Map</button></nav></header>
    <main id="main" className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      {v.t==='home'&&<div><section className="grid items-center gap-8 py-6 md:grid-cols-2"><div><h1 className="text-4xl font-semibold leading-tight md:text-5xl">Learn practical English by living the story.</h1><p className="mt-4 text-lg text-stone-700">Arrive in a new city and get by in English: introductions, cafés, directions, markets, plans and a job interview. Free, no account, no timers.</p><div className="mt-6 flex flex-wrap gap-2"><button className={pri} onClick={()=>go({t:'map'})}>Play Free<ArrowRight className="h-4 w-4" aria-hidden="true"/></button>{s.cur&&<button className={sec} onClick={resume}>Resume</button>}</div></div><Scene n={0}/></section>
        <section className="mt-8"><h2 className="text-2xl font-semibold">How it works</h2><ol className="mt-3 grid gap-3 md:grid-cols-3">{['Pick a chapter on the map and read its short story.','Choose replies, build sentences, listen and work out meanings. Hints are optional.','Wrong answers are explained and you can try again. Finish to earn stars and unlock the next chapter.'].map((t,i)=><li key={i} className="rounded-xl border border-stone-200 bg-white p-4"><strong>{i+1}.</strong> {t}</li>)}</ol></section>
        <section className="mt-8"><h2 className="text-2xl font-semibold">FAQ</h2>{[['Is it really free?','Yes. There are no accounts, lives or paywalls.'],['Where is my progress saved?','Only in this browser on this device. Clearing site data or using Reset progress removes it.'],['Do I need sound?','No. Every spoken line can be read as text. If your browser has no speech voices, text appears automatically.']].map(([q,a])=><details key={q} className="mt-2 rounded-xl border border-stone-200 bg-white p-3"><summary className="min-h-11 cursor-pointer font-medium">{q}</summary><p className="mt-1">{a}</p></details>)}</section></div>}
      {v.t==='map'&&<MapView s={s} setS={setS} start={start} resume={resume} practice={practice}/>}
      {v.t==='play'&&<Play v={v} s={s} setS={setS} tts={tts} go={go}/>}
      {v.t==='result'&&<Result v={v} s={s} go={go} start={start}/>}
      {v.t==='end'&&<div className="mx-auto max-w-2xl"><h1 className="text-3xl font-semibold">Your quest is complete</h1><p className="mt-3 text-lg">You arrived as a stranger and now you introduce yourself, order food, find your way, shop, make plans and hold an interview in English. Well done.</p><h2 className="mt-6 text-xl font-semibold">Skills you practised</h2><ul className="mt-2 list-disc pl-6">{skills.map(k=><li key={k}>{k}</li>)}</ul><div className="mt-6 flex gap-2"><button className={pri} onClick={()=>go({t:'map'})}>Replay chapters</button>{s.weak.length>0&&<button className={sec} onClick={practice}>Gentle practice</button>}</div></div>}
      {v.t==='info'&&<Legal/>}
    </main>
    <footer className="border-t border-stone-200 px-4 py-6 text-sm text-stone-600 md:px-8"><button className="min-h-11 underline" onClick={()=>go({t:'info'})}>Privacy, Terms and Contact</button> · All illustrations and the logo are original to this project.</footer></div>
}
