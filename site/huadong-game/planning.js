(function(root){'use strict';
const C=root.HDContent||(typeof require==='function'?require('./content.js'):null);
const V8_COSTS={strategy:{direct:2,partner:2,network:2},customer:{interview:3,quick:1},audit:{business:5,wide:8,limited:3},ownership:{core:4,complete:7,narrow:2},ftoresponse:{license:7,around:5,cross:4,hold:0},invention:{gateway:3,algorithm:5,defer:0},makebuy:{hybrid:4,local:6,cloud:2},secrecy:{layer:2,broad:0},valuation:{income:2,market:2,cost:1},brand:{own:3,co:2,tech:1},diligence:{target:4,deep:7},ddresponse:{condition:2,replace:4,accept:0},governance:{alliance:1,joint:2,venture:3,equity:2},controls:{full:5,basic:3,none:0},staff:{deploy:5,train:3,stretch:0},data:{minimal:2,review:4,local:3},component:{verify:3,replace:2},demo:{scoped:2,full:4,promise:0},inspection:{check:2,narrow:3},acceptance:{submit:0,settle:3},royalty:{verify:2,fixed:1},marketing:{case:3,channel:2},expansion:{direct:9,partner:6,license:4,franchise:7,brand:4,hold:0},marketcheck:{target:5,fto:3},training:{system:4,brand:2},financing:{bridge:0,stage:0},divest:{sell:1,retain:1},disclosure:{secret:1,assess:3,publish:1},siteHardware:{validate:2,listen:0},siteAlgorithm:{benchmark:2,access:1},sitePartner:{roster:1}};
for(const t of C.tasks)for(const o of t.options||[])if(V8_COSTS[t.id]?.[o.id]!==undefined)o.cost=V8_COSTS[t.id][o.id];
for(const o of C.taskById.governance.options)o.fx.governanceCost=({alliance:2,joint:3,venture:9,equity:7})[o.id];
C.taskById.financing.options=C.taskById.financing.options.filter(o=>o.id!=='bridge');
function cost(s,t,p={}){if(t.type==='finish')return 0;if(t.type==='fto')return ({quick:2,focused:5,full:8}[p.depth]||5)+(p.countries?.includes('my')?2:0);if(t.type==='assets'||t.type==='license'||t.type==='terms')return 1;return t.options?.find(o=>o.id===p.option)?.cost||0;}
function stageReason(s,t){const id=t.id,f=s.flags;if(id==='review')return '第25天夜间读完报告并完成复盘后自动收束';if(['customer','assets','audit','ownership','fto','makebuy','siteHardware','siteAlgorithm'].includes(id))return '';if(['diligence','sitePartner','governance'].includes(id)&&(!s.reports.customer?.read||!s.reports.makebuy?.read))return '先看客户需求和产品方案报告，再确定合作对象与分工';if(['license','negotiate'].includes(id)&&(!s.reports.diligence?.read||!s.reports.audit?.read))return '先看资产核对与伙伴调查报告，再谈技术开放';if(['controls','staff','data','component'].includes(id)&&!s.completed.governance)return '先明确合作分工，再安排交付权限、人员和数据';if(['invention','secrecy','valuation','brand'].includes(id)&&!s.reports.audit?.read)return '先看资产核对报告，明确本轮资产再投入';if(id==='financing'&&(!s.contract||!s.completed.demo))return '先有正式合同和已完成的客户演示，再申请提前收取部分阶段款';if(['royalty','training','marketing'].includes(id)&&!f.delivered)return '先完成首站交付，再组织持续收费与复制';if(['sitePartner'].includes(id)&&!s.completed.diligence)return '先完成伙伴调查，再现场核对团队';return '';}
const active=j=>['running','queued'].includes(j.status);
function plan(s,a){let duration=0,dept='secretary',cost=0,deadline=25,followup=false,label='',t;
 if(a.type==='task'){
  t=C.taskById[a.id];if(!t)return null;label=t.title;dept=t.person;
  const o=t.options?.find(x=>x.id===a.payload?.option);duration=o?.duration||0;dept=o?.dept||dept;cost=root.HDPlanning.cost(s,t,a.payload||{});
  if(t.type==='fto'){duration=a.payload?.depth==='full'?2:1;dept='legal';cost=root.HDPlanning.cost(s,t,a.payload||{});}
  if(['assets','audit','ownership','customer','makebuy','fto','ftoresponse','diligence','ddresponse','controls'].includes(t.id)&&!s.completed.demo){deadline=15;followup=['fto','diligence','audit'].includes(t.id);}
  if(['staff','data','component','inspection'].includes(t.id)&&!s.flags.delivered)deadline=19;
  if(['marketcheck','training','royalty','marketing'].includes(t.id))deadline=24;
  if(t.type==='finish')cost=0;
 }else if(a.type==='event'){
  const e=s.events.find(e=>e.id===a.id),d=C.eventById[a.id];if(!e||!d)return null;if(d.v8&&root.HDV8Events){const o=root.HDV8Events.options(s,e)?.find(o=>o.id===a.option);if(!o)return null;const jobs=s.jobs.filter(j=>active(j)&&j.dept===o.dept),start=Math.max(s.day,...jobs.map(j=>j.due)),due=o.due??s.day;return {label:d.title,dept:o.dept||d.person,start,due,duration:o.duration||0,cost:o.cost,deadline:e.due,followup:!!(o.duration||o.later),blocked:!!o.disabled,warn:false,queued:!!o.duration&&jobs.length>0,message:o.reason||''};}label=d.title;dept=['partner','client','secretary'].includes(d.person)?'legal':d.person;
  if(d.v5){const o=d.options.find(x=>x.id===a.option);if(!o)return null;duration=o.duration||0;dept=o.dept||dept;cost=o.cost;}
  else if(['newclient','innovationdeal'].includes(e.id)){if(!['decline','retain'].includes(a.option)){duration=1;dept=d.person;}}
  else if(e.id==='patentclaim'){duration=['evidence','settlement','license'].includes(a.option)?1:0;dept='legal';followup=a.option==='evidence';}
  else if(e.id==='accessrequest'&&a.option==='verify'){duration=1;dept='legal';followup=true;}
  else if(e.id==='royaltygap'&&a.option==='reconcile'){duration=1;dept='finance';}
  else if(e.status==='open'&&['investigate','contain'].includes(a.option)){duration=1;followup=true;}
  deadline=Math.min(25,e.due);if(followup)deadline=Math.min(deadline,24);
 }else return null;
 const jobs=s.jobs.filter(j=>active(j)&&j.dept===dept),start=duration?Math.max(s.day,...jobs.map(j=>j.due)):s.day,due=start+duration;
 const blocked=due>25||(s.version>=8&&duration>0&&jobs.length>=2);const late=due>deadline;const tight=duration&&due===25;
 let message='';if(s.version>=8&&duration>0&&jobs.length>=2)message='这个部门已有1项执行、1项等待，需先撤回未开工任务，或等工作完成后再委派。';else if(blocked)message=`这项工作排到第${start}天才能开始，第${due}天完成，赶不上第25天结局。先换短方案，或把这个部门还没开始的工作撤回。`;
 else if(late||tight)message=`这项工作预计第${due}天完成。${deadline<25?'建议第'+deadline+'天前准备好，才有余地做'+(deadline===15?'演示':deadline===19?'验收':'后续决定')+'。':'结局当天才拿到结果，留给后续处理的时间很少。'}${followup?'拿到报告后还要决定怎么处理，调查完成不等于事情解决。':''}`;
 return {label,dept,start,due,duration,cost,deadline,followup,blocked,warn:!blocked&&!!(late||tight),queued:!!duration&&start>s.day,message};
}
function options(s,t){if(t.type==='fto')return ['quick','focused','full'].map(depth=>({option:depth,plan:plan(s,{type:'task',id:t.id,payload:{depth,countries:['sg'],modules:['gateway','predict']}})}));return (t.options?.length?t.options:[{id:null}]).filter(o=>!o.requireFlag||s.flags[o.requireFlag]).map(o=>({option:o.id,plan:plan(s,{type:'task',id:t.id,payload:{option:o.id}})}));}
function warnings(s){return s.jobs.filter(j=>active(j)&&j.due>25).map(j=>({id:j.id,due:j.due,label:C.taskById[j.task]?.title||C.eventById[j.data?.event||j.data?.business]?.title||'已安排工作'}));}
root.HDPlanning={plan,options,warnings,cost,stageReason,V8_COSTS};if(typeof module!=='undefined')module.exports=root.HDPlanning;
})(typeof globalThis!=='undefined'?globalThis:window);
