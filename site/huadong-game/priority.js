(function(root){'use strict';
const E=root.HDEngine,C=root.HDContent,I=root.HDInsights,P=root.HDPlanning;
const labels={strategy:'先定这次出海怎么做',assets:'挑出这次合作要用的技术',audit:'先查自家技术的证明齐不齐',ownership:'把自家技术的证明补齐',customer:'问清客户到底要什么',makebuy:'确认设备能交付到哪一步',fto:'查在新加坡销售会碰到谁的专利',diligence:'核实伙伴有没有权开放技术',ftoresponse:'给查到的专利路障选一条路',ddresponse:'让伙伴先补好授权缺口',controls:'把谁能看、谁能拿走管起来',governance:'商定双方怎么合作',license:'决定这次开放哪些技术',negotiate:'交换条件，等伙伴正式还价',staff:'安排能上场和接替的人',data:'确定客户数据怎么用',component:'核对交付软件的来源',demo:'去港口演示真正能交付的功能',inspection:'交货前，现场查漏补缺',acceptance:'请客户验收，争取阶段回款',expansion:'决定下一站走多远',marketcheck:'先查下一站能不能落地',training:'让新团队能按同一标准服务',royalty:'把实际使用和收款对上',marketing:'把已经验证的成果带给新客户',review:'把经营结果交给董事会'};
const why={strategy:'先定目标，团队才知道该为什么花钱。',assets:'先圈定本次用得到的东西，别一上来把全公司都查一遍。',audit:'先弄清自己的底子，才知道能答应伙伴什么。',ownership:'报告指出了证明缺口。查过了还不够，要把缺的补上。',customer:'法务查材料时，市场可以同时问客户，避免做出没人要的功能。',makebuy:'让研发同时验证产品，别等合同签了才发现做不到。',fto:'自家技术归我们用，也可能碰到别人的专利。这是另一项检查。',diligence:'查的是合作伙伴，不是再查我们自己；两边的证据都要对上。',ftoresponse:'报告已经指出路障，下一步是处理，不需要反复买同一份调查。',ddresponse:'对方先补证明、换技术或改条件，我们再作承诺。',controls:'把技术交出去之前，先把人员权限和记录安排好。',governance:'先讨论双方各出什么、各管什么。还在核查的条件，要等结果齐了再定技术范围和签约。',license:'先让合作够用，再决定核心开放到哪一步。',negotiate:'用范围、人手和付款交换条件，报价提交后才能看到还价。',staff:'交付需要有人负责，也要有人能接替。',data:'只用这次真正需要的数据，把客户资料的去向说清。',component:'核对实际交付版本，不能拿旧清单替新软件作保证。',demo:'先把真正能运行的范围给客户看，别提前承诺未测试的功能。',inspection:'演示成功后再查一次实际交付，发现缺项还能补。',acceptance:'准备到位后提交，最终是否接受要等客户回应。',expansion:'首站跑通后再选下一步，也可以先守住现有业务。',marketcheck:'新国家有新的要求，首站的报告不能直接包办。',review:'这只是提交当前答卷；想继续经营到第25天，也可以先处理其他机会。'};
function priority(s){
 if(s.ending)return {label:s.ending.title,why:'本轮已结束，可以回看决定与结果。'};
 const reports=Object.values(s.reports).filter(r=>!r.read).sort((a,b)=>a.day-b.day);
 if(s.phase==='night')return reports.length?{report:reports[0].id,label:'先听完今晚的部门报告',why:reports.length+'份报告依次汇报，读完后再看经营和行情。'}:{night:true,label:s.market.lastTrade===s.day?'今晚交易已完成，可以继续复盘':'今晚先复盘，再决定是否交易',why:s.market.lastTrade===s.day?'今晚的交易已经结算，明晚再开放。可以查看经营结果，或休息进入明天。':'报告已归档。股票今晚可交易一次，不占行动，也不占紧急审批。'};
 const urgent=s.events.filter(e=>['open','report'].includes(e.status)&&e.due<=s.day+1).sort((a,b)=>a.due-b.due)[0];
 if(urgent)return {event:urgent.id,label:'先回应快到期的来信',why:C.eventById[urgent.id].title+'；最迟D'+urgent.due+'回应。'};
 if(s.offer&&!s.completed.contract)return {place:'partner',label:'去新智链审议正式还价',why:'对方已经给出条件。核对费用、人手和技术范围，再决定是否签约。'};
 const route=!s.completed.contract?['strategy','assets','audit','ownership','customer','makebuy','fto','diligence','ftoresponse','ddresponse','controls','staff','data','component','governance','license','negotiate']:!s.flags.delivered?['controls','staff','data','component','demo','inspection','acceptance']:['expansion',...(s.flags.expansion==='hold'?[]:['marketcheck']),...(s.flags.expansion==='franchise'?['training']:s.flags.expansion==='license'?['royalty']:[]),'review'];
 let choices=route.map(id=>C.taskById[id]).filter(t=>E.available(s,t)&&(t.id!=='review'||s.day>=25&&!s.jobs.some(j=>['running','queued'].includes(j.status))&&!Object.values(s.reports).some(r=>!r.read))&&(!s.completed[t.id]||t.id==='fto'&&!s.flags.ftoCovered||t.id==='ftoresponse'&&!s.flags.ftoClear||t.id==='acceptance'&&!s.flags.delivered)&&(t.id!=='governance'||s.reports.audit?.read&&s.completed.makebuy)&&(!['license','negotiate'].includes(t.id)||s.flags.ftoClear&&(s.flags.ddFixed||s.flags.partnerReplace)&&(s.flags.rights||s.flags.narrowRights)));
 // Prefer parallel work to filling a department's queue with optional checks.
 const idle=choices.filter(t=>!s.jobs.some(j=>j.dept===t.person&&['running','queued'].includes(j.status)));
 if(idle.length)choices=idle;
 const affordable=choices.filter(t=>P.options(s,t).some(x=>!x.plan.blocked&&x.plan.cost<=s.cash));
 const t=affordable[0];if(t)return {task:t.id,place:t.place,label:labels[t.id]||t.title,why:why[t.id]||'先把当前承诺需要的依据补齐，再推进下一步。',person:t.person};
 if(choices.length&&!affordable.length)return {night:true,label:'先调整预算或排期',why:'当前关键工作缺预算或赶不上排期。可在夜晚评估融资，也可撤回尚未开工的可选工作。'};
 const jobs=s.jobs.filter(j=>['running','queued'].includes(j.status));
 if(!jobs.length&&s.flags.delivered&&s.day<25)return {free:true,label:'主线准备好了，接下来由你经营',why:'可以探索现场、处理商业机会，或在夜晚调整股权。第25天董事会会审阅最终结果；也可以自行提前交卷。'};
 return {wait:true,label:'关键工作已经安排，等团队汇报',why:jobs.length?'最近一批结果在D'+Math.min(...jobs.map(j=>j.due))+'夜晚汇报。今天可以看其他机会，也可以提前结束外出。':'新报告今晚统一汇报；不用再给同一件事重复安排。'};
}
E.priority=priority;E.taskLabel=id=>labels[id]||C.taskById[id]?.title||id;
I.nextActions=s=>{const p=priority(s);return p.task||p.event||p.report||p.place?[p]:[];};
E.goal=s=>{const p=priority(s);return {title:p.label,text:p.why,ids:p.task?[p.task]:[]};};
E.secretary=(s)=>{const p=priority(s);return {text:p.why,targets:p.task||p.event||p.report||p.place?[p]:[],priority:p};};
})(globalThis);
