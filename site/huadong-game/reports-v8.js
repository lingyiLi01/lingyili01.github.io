(function(root){
'use strict';
const C=root.HDContent;
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const round=x=>Math.round(num(x)*10000)/10000;
const money=x=>num(x).toLocaleString('zh-CN',{maximumFractionDigits:4});
const questions={capital:'Q1(a)(ii)、Q1(b)(ii)',audit:'Q1(b)(i)、Q1(b)(ii)',case:'Q1(a)(i)、Q2(a)(i)、Q2(a)(ii)',coord:'Q1(a)(i)',dd:'Q2(b)(i)、Q2(b)(ii)',licensing:'Q3(a)(i)、Q3(a)(ii)',franchise:'Q3(b)(i)、Q3(b)(ii)',brand:'Q1(a)(ii)、Q3(b)(i)',fto:'Q1(a)(ii)、Q2(b)(ii)',data:'合作与许可的扩展练习',make:'合作与许可的扩展练习',value:'合作与许可的扩展练习',future:'知识资产组合的扩展练习',levels:'业务战略的扩展练习',invent:'知识资产组合的扩展练习'};
const simple={
 capital:['家底不只是一张专利证书','同一个产品可以同时用到代码、算法、品牌和没有公开的做法。先分清哪一部分创造价值，再选择对应的保护和共享方式。','这次真正离不开哪项技术？给对方的范围够做项目吗？'],
 audit:['先查自己的家底和缺口','审计要说清查哪些资料、什么时候查、怎么核对。找到问题之后，还要另外安排补文件或调整使用范围。','报告里的哪一项缺口会影响这次合作？'],
 dd:['先核实对方到底能给什么','先列出这笔合作依赖的技术与承诺，再查原始文件和实际人员，最后决定是否改变价格、条件或合作对象。','对方哪一项承诺最需要拿出证据？'],
 licensing:['说清能给谁用、怎么用','许可要把技术对象、用途、地区、期限、费用和新成果分别写清楚。给伙伴完成项目的使用权，也要考虑后续支持的投入。','如果对方拿去做第二个客户，原来的范围还够用吗？'],
 fto:['自己的技术，也要查当地的路障','这项检查围绕准备交付的产品和目标国家，核对可能相关的第三方专利。查出问题后，还需要选择许可、调整设计或缩小范围。','换一个国家或产品版本，哪些地方需要重新核对？'],
 brand:['客户最后会记住谁','品牌要让客户认得公司，也要让宣传内容与实际服务相符。伙伴使用品牌时，需要约好范围、责任和质量要求。','客户遇到问题时，知道由谁负责吗？'],
 franchise:['把做成的方法教给下一支团队','品牌和技术可以交给当地团队使用。要把整套服务复制过去，还需要培训、操作手册和持续的质量检查。','下一支团队离开我们的现场支持，还能稳定做成吗？'],
 case:['先说清共同的生意目标','比较合作安排时，把资源投入、控制权、分工和退出条件放在同一个业务目标下分析。主要建议还要说明放弃了什么替代方案。','这项安排怎样帮助我们拿到并完成首个项目？'],
 data:['技术能用，数据也要另说清楚','客户原始数据不会因为签了技术许可就自动归我们。实际字段、用途和访问人员要与本次安排对得上。','这项功能真的需要这些数据吗？'],
 value:['值多少钱，要看条件','重做要花多少、类似交易卖多少、未来可能赚多少，提供的是不同角度。谈判仍要看范围和对方是否愿意接受。','这个价格依赖哪个最不确定的假设？'],
 make:['自己做和买现成，都有代价','自己做需要人手和时间，买现成需要费用和相应使用权。比较时还要算以后升级和维护由谁承担。','眼前省下的时间，后面要用什么条件来交换？']
};
function knowledge(s,r){
 const ids=[...new Set((r.topics||[]).filter(id=>C.topics.some(t=>t[0]===id)))];
 return ids.map(id=>{const t=C.topics.find(t=>t[0]===id),plain=simple[id];const sources=(C.sources||[]).filter(x=>x[2]&&(id==='fto'?x[0]==='自由实施分析':id==='data'?x[0]==='数据处理':id==='licensing'||id==='franchise'?x[0]==='技术转移与协议':id==='audit'||id==='dd'?x[2].endsWith('/ip-audit'):false)).map(x=>({title:x[0],url:x[2]}));
  return {id,title:plain?.[0]||t[1],term:t[1],explanation:plain?.[1]||t[3],context:'本次可以对照「'+r.title.replace(/报告$/,'')+'」中的证据和后续安排。',question:plain?.[2]||'这项知识怎样改变你现在的选择？',course:t[2],assignment:questions[id]||'课程扩展练习',sources};});
}
function summary(s,r){
 const f=s.flags||{}, id=r.id, v=root.HDInsights.report(s,r), completed=!!s.completed?.[id];
 const configs={
 audit:['家底查过了，缺的证明还要补','团队把这次要用的技术资料翻了一遍。哪些东西重要、哪些证明还没对上，已经记在原始记录里。',f.rights?'后来补交的权利文件已经有记录。这份保留查到问题时的情况，不需要再派同一项工作。':'现在可以先补影响本次项目的证明。拿到审计报告，还不等于缺口已经处理完。'],
 ownership:['这次需要的证明补上了','团队补交了本次技术使用需要的文件，并记录了已经处理的权利状态事项。','这些记录用于本次对象和范围。去另一个国家、换一个组件，还要看新的实际情况。'],
 fto:[f.ftoClear?'查到的路障已有后续处理':'看到了专利路障，还要选处理办法',f.ftoCovered?'团队对照了新加坡这次准备交付的两个模块，发现网关会遇到需要处理的专利问题。':'这次调查还没覆盖准备交付的全部范围。没有查到的部分，不能直接当作已经放行。',f.ftoClear?'后来的处理已经记下。这里保留当时的调查，换版本或换市场时还要重新对照。':'接下来可以补查范围，或者请法务和研发比较购买许可、改设计、少做一部分。'],
 ftoresponse:['已查出的路障有了具体办法',f.ftoClear?'团队已经按这次决定，处理了本次查明的实施障碍。':'这次只处理了已经查到的部分。调查范围还不完整，剩下的仍需核对。','实际交付要使用这次对应的版本。新功能和新市场需要再检查。'],
 diligence:['对方的承诺，有一处需要再核实','团队核对了新智链的技术来路、参与人员和既有承诺，具体差异保留在原始记录里。',f.ddFixed||f.partnerReplace?'后续已经补充条件或更换相关技术，按新记录继续执行。':'可以让对方补证明、修改条件，或换掉有问题的部分。调查完成还不等于这些问题已经解决。'],
 ddresponse:['对方这次要补的条件有了交代',f.partnerReplace?'这次改用了替代连接器，并留下了本轮验证记录。':'团队补齐了本项目所需的限定授权和参与人员说明。','之后换人、加分包商或换技术，仍要重新核对。'],
 customer:['客户要什么，更清楚了',f.customer?'客户对功能、现场支持和采购条件的偏好，已经带回来了。':'团队目前拿到的是客户功能清单，采购的重点和可谈条件还没有完全问清。','这些都是谈判和产品取舍的依据。询价和意向还没有变成已经到账的钱。'],
 makebuy:['产品这次能做到哪一步，有了记录','团队已经按选定路线完成本轮模拟测试，具体产品配置留在下面的记录里。','对客户承诺时，可以对照这次实际验证的功能。后面加模块或换设备，还得再看结果。'],
 controls:['谁能接触资料，现在有安排了',f.controls?'账号、访问范围和交付记录已经按本次决定配置。':'这次先做了列名访问与保密安排，下载记录和分包核查还不完整。','交付时继续照这个范围执行。发现有人需要更多资料，再单独决定。'],
 staff:['人手和接替安排交回来了','团队已经记录了本次安排的人手、交接和资料访问责任。','这次增加的能力有明确范围。后面扩大服务，还要留意接替和支持成本。'],
 data:['这次能用哪些客户数据，说清楚了','团队已经按你的决定，整理了本期的数据用途与处理安排。','以后增加字段、换使用目的或换接触人员，都要再核对这份安排。'],
 component:['最后交出去的版本核对过了','团队对照本次软件、组件和界面素材，补了缺项，或把未确认的部分移出本期范围。','留下当前版本和清单。后面升级时，再检查改动的部分。'],
 inspection:['先对照交付，再请客户验收',root.HDEngine.risks(s).length?'当前交付还有需要负责人处理的事项，具体记录可以在下方展开。':'当前关键交付事项已有对应安排，接下来还要让客户确认实际结果。','这里是团队核对，不是客户已经签收。是否接受、是否付款，以客户验收记录为准。'],
 acceptance:[f.delivered?'客户接受了这次阶段交付':'客户还没有接受这次交付',f.delivered?'本次阶段回款 '+money(f.paidStage)+' 万元已有到账记录。':'这次尚未取得阶段回款。先对照客户反馈补交，再决定是否重新申请验收。',f.delivered?'还有条件的后续款项继续单独跟踪，先留出服务和日常支持的钱。':'现在还不能把预期回款当作可用现金。'],
 valuation:['价格有了参考，还要谈条件','团队从选定的方法估算了技术价值。下面保留所用依据与模拟参考区间。','对方是否接受，还要看地区、独占、成熟度和实际需求。参考数不是已成交价格。'],
 brand:['客户会看到谁的品牌，已有安排','团队已经按选定方向，处理这次市场的品牌展示和使用安排。','宣传要与实际功能和服务相符。换市场时，再核对当地要求。'],
 royalty:['用了多少、该付多少，有记录可查了','团队已经把实际使用、授权范围和结算口径放到一起核对。','有疑问的部署继续查。还没到付款条件的钱，不放进可用现金。'],
 marketing:['找到新线索了，还没有新增成交','团队把做成的项目整理成客户案例，并带回下一市场的线索。','接下来还要问清客户需求和当地交付条件。不要把这些线索当成已经签好的订单。'],
 marketcheck:['下一站有了初步依据',f.nextReady?'团队补查了这次下一市场所需的实施范围、品牌和交付事项。':'团队更新了下一市场的实施范围，品牌、数据或交付安排仍有待补充。','这份结果可以帮助决定是否启动，尚不能说明当地已经有客户或利润。'],
 training:['下一支团队学到哪一步，有记录了',f.quality?'这次建立了培训、操作手册、服务检查和改进安排。':'这次提供了品牌与技术使用指引，完整的服务质量体系还没建立。','后面要看团队能否按约定持续交付，培训完成不等于已经稳定运营。'],
 invention:['值得投入的方向筛出来了','团队对候选技术的实际用途、可替代程度和后续价值做了比较。','这次记录的是投入或调查方向，还没有因此取得新的专利授权。']
 };
 const eventId=r.eventId||r.event,event=eventId&&(s.events||[]).find(e=>e.id===eventId);
 const cfg=configs[id]||(event?['这件事查到这一步了',r.summary||event.result||'团队完成了本轮委派，并把查到的情况留在原始记录里。',['resolved','contained','closed'].includes(event.status)?'已经做出的处置继续保留。后面是否还要跟进，按来信状态与期限查看。':['working','settling','investigating'].includes(event.status)?'这项工作还在执行。现在只记下已经发生的投入，后续成果与到账金额等条件满足后再看。':event.status==='failed'?'这次约定的条件没有满足。已发生的投入继续留在记录里，不能把原本预计的钱算成到账。':'本轮核查已经交回，接下来是否追加投入、限制范围或继续处理，还需要你决定。']:['团队把结果交回来了','这次约定的工作已经交回，具体发现和适用范围保留在原始记录里。','先看这份结果有没有改变当前选择。已经安排的工作可以继续在首页跟进。']);
 const reviewed={...s,reports:{...s.reports,[id]:{...r,read:true}}};
 const next=(v.next||[]).filter(x=>C.taskById[x]&&root.HDEngine.available(reviewed,C.taskById[x])).slice(0,2);
 return {headline:cfg[0],paragraphs:cfg.slice(1),next,event:event&&['report','open'].includes(event.status)?event.id:null,range:v.range||null,original:r.lines||[],knowledge:knowledge(s,r),completed};
}
function receiptsBetween(s,old){return round((s.ledger||[]).slice((old.ledger||[]).length).filter(x=>num(x.amount)>0&&/首付款|阶段.*到账|回款|客户.*(?:付款|支付)|合同.*付款|尾款|项目.*收入/.test(x.why||'')&&!/融资|卖出|股票|周转|借/.test(x.why||'')).reduce((n,x)=>n+num(x.amount),0));}
function after(s,old,a){
 if(s.version<8)return s;
 s.v8Feedback=s.v8Feedback||[];
 const dayAdvanced=s.day>old.day;
 // Follow-up belongs to the same decision. It never creates a second order.
 for(const row of s.v8Feedback){
  if(!row.pending)continue;
  const job=row.jobId&&s.jobs.find(j=>j.id===row.jobId),event=row.eventId&&s.events.find(e=>e.id===row.eventId);
  const done=job&&['done','cancelled'].includes(job.status)||event&&['resolved','settled','closed','failed','cancelled'].includes(event.status);
  if(done&&!row.followups?.some(x=>x.stage==='completed')){const paid=(s.v8Events?.receipts||[]).filter(x=>x.event===event?.id&&x.kind!=='injection').reduce((sum,x)=>sum+num(x.amount),0),orders=paid>0&&event?.salesSignal?num(event.salesSignal):0;row.followups=row.followups||[];row.followups.push({day:s.day,stage:'completed',text:event?event.result||'本项处置已有结果，实际款项与客户接受情况以记录为准。':job?.status==='cancelled'?'这项排队工作已经撤回，未产生新的成交。':'团队已经交回这项工作的结果。先看报告，再决定是否把它用于客户交付。',orders,receipts:round(paid)});row.pending=false;}
  else if(dayAdvanced&&!row.followups?.length){row.followups=[{day:s.day,stage:'waiting',text:'这项决定的后续工作还在进行。当前新增成交 0，继续等待核查或客户确认。',orders:0,receipts:0}];}
 }
 if(!(s.contract||s.completed?.contract||s.flags?.signed))return s;
 if(!['task','event','acceptOffer','cancelJob','rescheduleJob','capital','investment','chairmanAid','rescue','finalizeUnresolved'].includes(a.type))return s;
 const actual=(s.actions||[]).length>(old.actions||[]).length?(s.actions||[]).length:(old.actions||[]).length+1;
 const id='decision-'+actual;
 if(s.v8Feedback.some(x=>x.id===id))return s;
 const job=s.jobs?.find(j=>!(old.jobs||[]).some(o=>o.id===j.id));
 const event=a.type==='event'&&s.events?.find(e=>e.id===a.id);
 const delta=round(num(s.trust)-num(old.trust));
 const control=round(num(s.control)-num(old.control));
 const task=C.taskById[a.id],eventDef=C.eventById[a.id];
 const label=task?.title||eventDef?.title||({acceptOffer:'签署本次合作',travel:'安排出差',visit:'查看现场',mini:'亲手核对现场资料',capital:'调整公司股权资金',investment:'调整投资持仓',chairmanAid:'申请专项支持',cancelJob:'撤回排队工作',rescheduleJob:'调整工作排期',rescue:'决定紧急周转',finalizeUnresolved:'登记本轮未处理事项'})[a.type]||'经营决定';
 let partner=delta>0?'这次安排让我们更愿意继续投入。执行时还会按已经谈好的人员和范围来。':delta<0?'这次安排与我们原先的预期有差距。我们会按新条件继续评估投入。':'这次暂未改变双方的合作安排，我们先照已经确定的范围执行。';
 if(a.type==='acceptOffer')partner='合作条件已经签下。接下来我们按合同准备人员和现场支持，交付变化再一起确认。';
 else if(job)partner='这项工作已经交给 '+(C.people[job.dept]?.name||'团队')+'。我们等实际结果，再讨论是否需要调整交付。';
 else if(control<0&&delta>0)partner='这次给了我们更多使用空间，落地更方便。接下来需要按新范围执行交接。';
 else if(event?.outcome)partner=event.outcome.immediate;
 else if(control>0&&delta<0)partner='资料开放比我们希望的更有限，现场支持会更依赖华东团队。后面要把响应时间说清楚。';
 let status='none',text='新增成交 0。这项安排暂未带来新的客户订单。',orders=0,receipts=receiptsBetween(s,old);
 if(a.type==='acceptOffer'&&!old.contract){status='confirmed';orders=1;text='确认 1 个合作项目。合同金额 '+money(s.contract?.value)+' 万元；首付款按到账记录单独列示。';}
 else if(!old.flags?.delivered&&s.flags?.delivered){status='confirmed';text='已有项目的阶段交付获得接受。本次新增订单 0，继续跟踪后续服务和付款。';}
 else if(job){status='pending';text='新增成交 0。团队工作还没交回，暂不把预期效果记成销量。';}
 else if(a.type==='task'&&['marketing','customer','marketcheck'].includes(a.id)){status='intent';text='有客户需求或市场线索需要跟进，新增成交 0，询盘还没有变成订单。';}
 else if(a.type==='task'&&a.id==='demo'){status='pending';text='演示已留下记录。新增成交 0，还要等待客户验收和付款条件。';}
 else if(event&&['investigating','working','settling','report'].includes(event.status)){status='pending';text='新增成交 0。本项后果仍在核查或履约，按约定节点继续回报。';}
 const cashDelta=round(num(s.cash)-num(old.cash)),expenses=round((s.ledger||[]).slice((old.ledger||[]).length).filter(x=>num(x.amount)<0).reduce((n,x)=>n-num(x.amount),0));
 const row={cashDelta,expenses,id,actionId:actual,day:s.day,kind:a.type,label,taskId:a.type==='task'?a.id:null,eventId:event?.id||null,jobId:job?.id||null,pending:status==='pending',partner:{tone:delta>0?'positive':delta<0?'concern':'neutral',text:partner,delta},market:{status,text,orders,receipts},followups:[]};
 s.v8Feedback.push(row);return s;
}
function latestMorning(s){return (s.investments?.morningReports||[]).filter(x=>x.day===s.day).at(-1)||null;}
function portfolio(s){const rows=Object.values(s.investments?.positions||{}).map(p=>({...p,shares:num(p.quantity??p.shares),marketValue:num(p.value??p.marketValue),unrealized:num(p.unrealized),realized:num(p.realized)}));return {rows,held:rows.filter(p=>p.shares>0),cash:num(s.cash),marketValue:round(rows.reduce((n,p)=>n+p.marketValue,0)),unrealized:round(rows.reduce((n,p)=>n+p.unrealized,0)),realized:num(s.investments?.realized)};}
root.HDV8Reports={summary,knowledge,after,portfolio,latestMorning,money,receiptsBetween};
})(typeof globalThis!=='undefined'?globalThis:window);
