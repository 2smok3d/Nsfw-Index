/* Noir Index — Wave 3 discovery engine: local index, relevance, recents, facets, recommendations. */
const Discovery=(()=>{
 const KEY='discovery',norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,''),esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let index=[],built=false;
 function build(){if(built)return index;index=SITES.map(s=>({s,text:norm([s.name,s.note,s.category,...(s.tags||[])].join(' '))}));built=true;return index}
 function rank(s,q){if(!q)return 0;const n=norm(q).trim(),name=norm(s.name),text=norm([s.name,s.note,s.category,...(s.tags||[])].join(' '));let score=0;if(name===n)score+=1200;if(name.startsWith(n))score+=700;if(name.includes(n))score+=400;if(text.includes(n))score+=180;for(const t of n.split(/\s+/)){if((s.tags||[]).some(x=>norm(x)===t))score+=260;else if(text.includes(t))score+=40}return score}
 function search(q,opts={}){build();const v=Store.getVisits();return index.filter(x=>!opts.tag||(x.s.tags||[]).includes(opts.tag)).map(x=>({...x.s,_score:rank(x.s,q),_visits:v[x.s.id]||0})).filter(x=>!q||x._score>0).sort((a,b)=>(b._score-a._score)||(b._visits-a._visits)||a.name.localeCompare(b.name))}
 function data(){return Store.get(KEY,{recent:[],queries:[]})||{recent:[],queries:[]}} function save(x){Store.set(KEY,x);return x}
 function recordQuery(q){q=String(q||'').trim();if(!q)return;const d=data();d.queries=[q,...d.queries.filter(x=>x!==q)].slice(0,12);save(d)}
 function recordOpen(id){const d=data();d.recent=[id,...d.recent.filter(x=>x!==id)].slice(0,16);save(d)}
 function recent(){const d=data(),m=new Map(SITES.map(s=>[s.id,s]));return d.recent.map(id=>m.get(id)).filter(Boolean)}
 function recentQueries(){return data().queries||[]}
 function facets(q){const o={};search(q).forEach(s=>(s.tags||[]).forEach(t=>o[t]=(o[t]||0)+1));return Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,20)}
 function recommend(id,limit=6){const seed=SITES.find(s=>s.id===id);if(!seed)return[];const tags=new Set((seed.tags||[]).map(norm)),v=Store.getVisits();return SITES.filter(s=>s.id!==id).map(s=>{let score=s.category===seed.category?3:0;(s.tags||[]).forEach(t=>{if(tags.has(norm(t)))score+=5});score+=(v[s.id]||0)*.15;return{...s,_recommend:score}}).filter(s=>s._recommend>0).sort((a,b)=>b._recommend-a._recommend).slice(0,limit)}
 return{build,search,recordQuery,recordOpen,recent,recentQueries,facets,recommend,escape:esc};
})();
