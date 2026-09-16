(function(root){'use strict';
const C=root.HDContent||(typeof require==='function'?require('./content.js'):null);
const active=j=>['running','queued'].includes(j.status);
function plan(s,a){let duration=0,dept='secretary',cost=0,deadline=14,followup=false,label='',t;
 if(a.type==='task'){
  t=C.taskById[a.id];if(!t)return null;label=t.title;dept=t.person;
  const o=t.options?.find(x=>x.id===a.payload?.option);duration=o?.duration||0;dept=o?.dept||dept;cost=Math.max(1,o?.cost||0);
  if(t.type==='fto'){duration=a.payload?.depth==='full'?2:1;dept='legal';cost=({quick:3,focused:8,full:13}[a.payload?.depth]||8)+(a.payload?.countries?.includes('my')?4:0);}
  if(['assets','audit','ownership','customer','makebuy','fto','ftoresponse','diligence','ddresponse','controls'].includes(t.id)&&!s.completed.demo){deadline=8;followup=['fto','diligence','audit'].includes(t.id);}
  if(['staff','data','component','inspection'].includes(t.id)&&!s.flags.delivered)deadline=10;
  if(['marketcheck','training','royalty','marketing'].includes(t.id))deadline=13;
  if(t.type==='finish')cost=0;
 }else if(a.type==='event'){
  const e=s.events.find(e=>e.id===a.id),d=C.eventById[a.id];if(!e||!d)return null;label=d.title;dept=['partner','client','secretary'].includes(d.person)?'legal':d.person;
  if(d.v5){const o=d.options.find(x=>x.id===a.option);if(!o)return null;duration=o.duration||0;dept=o.dept||dept;cost=o.cost;}
  else if(['newclient','innovationdeal'].includes(e.id)){if(!['decline','retain'].includes(a.option)){duration=1;dept=d.person;}}
  else if(e.id==='patentclaim'){duration=['evidence','settlement','license'].includes(a.option)?1:0;dept='legal';followup=a.option==='evidence';}
  else if(e.id==='accessrequest'&&a.option==='verify'){duration=1;dept='legal';followup=true;}
  else if(e.id==='royaltygap'&&a.option==='reconcile'){duration=1;dept='finance';}
  else if(e.status==='open'&&['investigate','contain'].includes(a.option)){duration=1;followup=true;}
  deadline=Math.min(14,e.due);if(followup)deadline=Math.min(deadline,13);
 }else return null;
 const jobs=s.jobs.filter(j=>active(j)&&j.dept===dept),start=duration?Math.max(s.day,...jobs.map(j=>j.due)):s.day,due=start+duration;
 const blocked=due>14;const late=due>deadline;const tight=duration&&due===14;
 let message='';if(blocked)message=`这项工作排到第${start}天才能开始，第${due}天完成，赶不上第14天结局。先换短方案，或把这个部门还没开始的工作撤回。`;
 else if(late||tight)message=`这项工作预计第${due}天完成。${deadline<14?'建议第'+deadline+'天前准备好，才有余地做'+(deadline===8?'演示':deadline===10?'验收':'后续决定')+'。':'结局当天才拿到结果，留给后续处理的时间很少。'}${followup?'拿到报告后还要决定怎么处理，调查完成不等于事情解决。':''}`;
 return {label,dept,start,due,duration,cost,deadline,followup,blocked,warn:!blocked&&!!(late||tight),queued:!!duration&&start>s.day,message};
}
function options(s,t){if(t.type==='fto')return ['quick','focused','full'].map(depth=>({option:depth,plan:plan(s,{type:'task',id:t.id,payload:{depth,countries:['sg'],modules:['gateway','predict']}})}));return (t.options?.length?t.options:[{id:null}]).filter(o=>!o.requireFlag||s.flags[o.requireFlag]).map(o=>({option:o.id,plan:plan(s,{type:'task',id:t.id,payload:{option:o.id}})}));}
function warnings(s){return s.jobs.filter(j=>active(j)&&j.due>14).map(j=>({id:j.id,due:j.due,label:C.taskById[j.task]?.title||C.eventById[j.data?.event||j.data?.business]?.title||'已安排工作'}));}
root.HDPlanning={plan,options,warnings};if(typeof module!=='undefined')module.exports=root.HDPlanning;
})(typeof globalThis!=='undefined'?globalThis:window);
