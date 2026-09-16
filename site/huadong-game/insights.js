/* Readable, evidence-based summaries. No hidden event outcomes are exposed. */
(function(root){
'use strict';
const C=root.HDContent||(typeof require==='function'?require('./content.js'):null);
const E=root.HDEngine||(typeof require==='function'?require('./engine.js'):null);
const round=n=>Math.round(n*10)/10;
function finances(s){
 const f=s.flags,c=s.contract;
 const delivery=c&&!f.delivered?24+c.partnerFee+c.support:0;
 const debt=f.bridge&&!f.debtPaid?22:0;
 const daily=Math.max(0,25-s.day);
 const businessPending=(s.events||[]).filter(e=>e.status==='settling').reduce((n,e)=>n+(e.expected||0),0);
 const receivable=c?Math.max(0,round(c.value-c.deposit-(f.paidStage||0)-(f.earlyPay?10:0)-(f.delivered&&f.deliveryNarrow?18:0)-(f.delivered&&f.overpromise?6:0)-(f.delivered?Math.max(0,f.acceptanceDay-20)*2:0))):0;
 return {cash:s.cash,delivery:round(delivery),debt,daily,committed:round(delivery+debt),buffer:round(s.cash-delivery-debt-daily),receivable:round(receivable+businessPending),businessPending,today:round(s.ledger.filter(x=>x.day===s.day).reduce((a,x)=>a+x.amount,0))};
}
function readiness(s){const f=s.flags;return [
 ['rights','技术归谁、是否有效',f.rights||f.narrowRights,!!s.reports.audit,'ownership','audit'],
 ['fto','有没有碰到别人专利',f.ftoClear,!!s.reports.fto,'ftoresponse','fto'],
 ['partner','伙伴有没有权让我们用',f.ddFixed||f.partnerReplace,!!s.reports.diligence,'ddresponse','diligence'],
 ['data','哪些数据可以用',f.dataReady,false,'data','data'],
 ['component','实际交付版本',f.component,false,'component','component'],
 ['controls','谁能接触交付资料',f.controls,false,'controls','controls']
 ].map(([id,label,done,known,fix,investigate])=>{const job=s.jobs.find(j=>[fix,investigate].includes(j.task)&&['running','queued'].includes(j.status));return {id,label,status:done?'done':job?'watch':known?'attention':'unknown',text:done?'本轮已落实':job?'已委派 · D'+job.due+'夜晚反馈':known?'已发现缺口 · 待补齐':'尚未安排',task:known?fix:investigate};});}
function forecast(s){
 const f=s.flags,b=finances(s),items=[];
 const add=(id,label,detail,level,target)=>items.push({id,label,detail,level,target});
 const urgent=s.events.filter(e=>['open','report'].includes(e.status)).sort((a,b)=>a.due-b.due);
 for(const e of urgent)add(e.id,C.eventById[e.id].title,`第${e.due}天前回复；${e.status==='report'?'调查已到，等待你的决定':'需要先回应并安排处理'}。`,e.due<=s.day+1?'high':'watch',{event:e.id});
 if(s.cash<10)add('liquidity','立即留意可用现金','当前可用'+s.cash+'万元；不足周转资金时先检查一次紧急融资，仍不能周转才会结束经营。不能用尚未到账的交易款支付当前费用。','high',{task:'financing'});
 if(b.buffer<15)add('cash','现金缓冲偏薄',`扣除已知承诺与剩余日常支出后约余${b.buffer}万元；未到账尾款不计入可用现金。`,b.buffer<0?'high':'watch',{task:'financing'});
 if(!f.delivered){
  const milestone=f.demo?20:16;
  const delayed=s.jobs.filter(j=>['running','queued'].includes(j.status)&&j.due>milestone&&['makebuy','ftoresponse','controls','staff','component'].includes(j.task));
  if(s.day>=milestone-2||delayed.length)add('schedule',f.demo?'留意阶段验收排期':'留意现场演示排期',delayed.length?`有${delayed.length}项交付相关工作预计晚于第${milestone}天，请核对部门日程。`:`目标第${milestone}天；${s.day>milestone?'已超过目标日期，后续付款可能受影响':'检查准备情况并留出现场行动'}。`,'watch',{task:f.demo?'inspection':'demo'});
 }
 if((s.license.includes('core')||s.license.includes('weights')||f.coreAccessOpen)&&!f.controls)add('exposure','核心已计划开放，控制仍待落实','需要核对访问权限、下载留痕和分包对象；这是一项预警，不代表已发生泄密。','high',{task:'controls'});
 if(s.reports.diligence&&!f.ddFixed&&!f.partnerReplace)add('partner','伙伴调查还有未决条件','先看授权与技术承诺缺口，决定补证、替代或调整交易范围。','watch',s.reports.diligence.read?{task:'ddresponse'}:{report:'diligence'});
 if(s.contract&&!f.hrReady)add('people','人员交接仍依赖个别工程师','安排备份和交接，可降低离职或临时缺席对交付的影响。','watch',{task:'staff'});
 if(f.sideExclusive)add('sideExclusive','新订单带来区域独占约束','虽然能回款，但独占可能限制自主客户路线。决定下一站前核对这些承诺。','watch',{task:'expansion'});
 if(f.soldImprovement)add('soldImprovement','改进的独占商业使用权已转出','同一改进不能继续向其他厂商许可，下一市场的技术组合需要重新评估。','watch',{task:'expansion'});
 if(f.expansion&&f.expansion!=='hold'&&!f.nextReady)add('next','新市场结论尚未更新','本轮新加坡证据不能直接覆盖马来西亚新增接口与当地要求。','watch',{task:'marketcheck'});
 if(!items.length){const gap=readiness(s).find(x=>x.status!=='done');if(gap)add('prepare','下一步补齐一项准备',`${gap.label}：${gap.text}。${gap.text.includes('已委派')?'等团队按排期汇报，不用重复安排。':gap.status==='attention'?'报告已圈出疑点，下一步处理缺口。':'按秘书推荐的顺序安排，其他检查可以稍后。'}`,'info',{task:gap.task});else add('steady','当前已知安排可继续推进','明天留意新报告与版本变化；目前没有发现必须立即处理的新缺口。','good',null);}
 return items.slice(0,4);
}
function nextActions(s){
 const g=E.goal(s),unread=Object.values(s.reports).filter(r=>!r.read);
 const result=unread.slice(0,2).map(r=>({report:r.id,label:r.title}));
 for(const id of g.ids){if(result.length>=3)break;const t=C.taskById[id];if(t&&E.available(s,t))result.push({task:id,label:t.title,place:t.place});}
 return result;
}
function report(s,r){
 const id=r.id,f=s.flags;
 const base={headline:r.lines[0]||'本轮工作已完成',rows:[],next:[],steps:['取得证据','判断影响','安排下一步']};
 if(id==='audit')return {...base,headline:'发现缺项，先按重要性补齐',rows:r.lines.filter(l=>!l.startsWith('状态：')).map(l=>{const x=l.indexOf('：');return {label:l.slice(0,x),detail:l.slice(x+1),status:'attention'};}),next:['ownership']};
 if(id==='fto')return {...base,headline:f.ftoCovered?'两处实施障碍需要处理':'调查范围仍有缺口',rows:[{label:'SIM-A + SIM-D',detail:'两项模拟有效范围重叠影响网关；项目许可报价合计11万元。',status:'attention'},{label:'SIM-B',detail:'记录显示届满；不能推及其他国家或整个专利族。',status:'info'},{label:'SIM-C',detail:'已公开待审，后续持续跟踪。',status:'watch'}],next:[f.ftoCovered?'ftoresponse':'fto']};
 if(id==='diligence')return {...base,headline:'伙伴的承诺需要重新确认',rows:[{label:'识别',detail:'连接器、声称专利、人员、分包及既有承诺',status:'done'},{label:'调查',detail:r.lines[1].replace(/^调查：/,''),status:'attention'},{label:'评估',detail:'补授权、修改对价或替换技术；调查不等于问题已解决。',status:'watch'}],next:['ddresponse']};
 if(id==='customer')return {...base,headline:f.customer?'客户更看重什么，已经有线索':'目前只拿到功能清单',rows:[{label:'订单上限',detail:'160万元原始询价；最终金额仍待谈判。',status:'info'},{label:'采购偏好',detail:r.lines[1].replace('偏好线索：',''),status:f.customer?'done':'unknown'},{label:'两个时间节点',detail:'第16天演示 → 第20天阶段验收',status:'watch'}],next:['makebuy','governance']};
 if(id==='valuation')return {...base,headline:'估值是区间，成交仍取决于条件',range:{min:18,max:35,label:'模拟许可价值参考 / 万元'},rows:[{label:'主要依据',detail:r.lines[1].replace('本轮主要依据：',''),status:'info'},{label:'影响价格',detail:'地域、独占、成熟度、可检测性与对方使用需求',status:'watch'}],next:['negotiate','divest']};
 if(id==='inspection')return {...base,headline:r.lines.some(l=>l.startsWith('尚未关闭'))?'验收前仍有待办':'关键范围已有对应安排',rows:r.lines.map(l=>({label:l.startsWith('尚未关闭')?'待关闭':'核对记录',detail:l.replace('尚未关闭：',''),status:l.startsWith('尚未关闭')?'attention':'done'})),next:readiness(s).filter(x=>x.status!=='done').map(x=>x.task).concat('acceptance')};
 if(id==='acceptance')return {...base,headline:f.delivered?'阶段交付已获接受':'先补救，再申请验收',rows:[{label:'阶段到账',detail:f.delivered?`${f.paidStage}万元已到账`:'本轮尚未取得阶段回款',status:f.delivered?'done':'attention'},{label:'后续款项',detail:`${finances(s).receivable}万元仍有条件，尚不能使用。`,status:'watch'}],next:f.delivered?['expansion']:readiness(s).filter(x=>x.status!=='done').map(x=>x.task).concat('acceptance')};
 const labels={ownership:['权属与维护已按本轮范围处理',['fto','diligence']],ftoresponse:['已查实施障碍有了对应安排',['governance','demo']],makebuy:['产品路线已完成本轮验证',['license']],ddresponse:['交易条件已经落实到本轮范围',['governance','license']],controls:['权限与记录开始进入实际交付',['demo']],staff:['人员与交接安排已就绪',['demo']],data:['数据边界已经明确',['inspection']],component:['最终交付版本已核对',['acceptance']],marketcheck:['下一市场已有启动依据',['training','review']],training:['服务复制有了组织安排',['review']],brand:['品牌与责任安排已形成',['marketing']],royalty:['收费与使用安排已形成',['expansion','review']],marketing:['形成新线索，尚未形成收入',['expansion']],invention:['保留未来选择，未视为新授权',['disclosure']]};
 const cfg=labels[id];base.headline=cfg?.[0]||'工作结果已送达';base.next=cfg?.[1]||[];
 base.rows=r.lines.slice(0,3).map((l,i)=>({label:i===0?'本轮结果':i===1?'适用边界':'持续关注',detail:l,status:i===0?'done':'info'}));
 return base;
}
const I={finances,readiness,forecast,nextActions,report};root.HDInsights=I;if(typeof module!=='undefined')module.exports=I;
})(typeof globalThis!=='undefined'?globalThis:window);
