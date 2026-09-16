// First experience repair: presentation only; all decisions still use E.dispatch.
let experienceResult = null;
function experienceSummary(old, a) {
 const cash = Math.round((S.cash-old.cash)*100)/100;
 const job = S.jobs.find(j=>!old.jobs.some(o=>o.id===j.id));
 const event = a.type==='event' ? S.events.find(e=>e.id===a.id) : null;
 const row = (S.v8Feedback||[]).find(r=>!(old.v8Feedback||[]).some(o=>o.id===r.id));
 const entry = S.log.slice(old.log.length).find(r=>r.title===(C.taskById[a.id]?.title||C.eventById[a.id]?.title));
 const receipts = R8.receiptsBetween(S,old);
 const expenses = Math.round(S.ledger.slice(old.ledger.length).filter(r=>r.amount<0).reduce((sum,r)=>sum-r.amount,0)*100)/100;
 const changes = ['现金 '+r8Signed(cash)+' 万'];
 for(const [key,label] of [['trust','合作信任'],['reputation','商誉'],['control','技术控制']]) {
  const delta=Math.round((S[key]-old[key])*100)/100;if(delta)changes.push(label+' '+r8Signed(delta));
 }
 if(old.phase==='day')changes.push('行动 −'+(old.slots-S.slots));
 const title=(C.taskById[a.id]?E.taskLabel(a.id):null)||C.eventById[a.id]?.title||({acceptOffer:'合作已签署',mini:'现场互动已完成',cancelJob:'排队工作已撤回',rescheduleJob:'排期已调整'})[a.type]||'安排已完成';
 return {title,changes,cash,receipts,expenses,detail:event?.result|| (job?(C.people[job.dept]?.name||'团队')+'已接手，预计第 '+job.due+' 天夜晚汇报。':entry?.text)||row?.market?.text||'结果已保存，可在决策记录中回看。',partner:event?null:row?.partner?.text};
}
function paintExperienceResult(){
 document.querySelector('.experience-result')?.remove();
 if(!experienceResult||!started||S.ending)return;
 const r=experienceResult,anchor=document.querySelector('.shell .stage')||document.querySelector('.shell');
 if(!anchor)return;
 const card=document.createElement('section');card.className='experience-result';card.setAttribute('role','status');card.setAttribute('aria-live','polite');
 card.innerHTML=`<strong>${esc(r.title)}</strong><div class="experience-changes">${r.changes.map(x=>'<span>'+esc(x)+'</span>').join('')}</div>${r.receipts?`<p class="experience-cash">实际回款 ${r8Money(r.receipts)} 万 · 本次支出 ${r8Money(r.expenses)} 万 · 现金净变化 ${r8Signed(r.cash)} 万</p>`:''}<p>${esc(r.detail)}</p>${r.partner?`<details><summary>查看伙伴回应</summary><p>${esc(r.partner)}</p></details>`:''}`;
 if(anchor.classList.contains('stage'))anchor.before(card);else anchor.append(card);
}
const experienceRun=run;
run=function(a,feedback=true){const previous=experienceResult;experienceResult=null;const ok=experienceRun(a,feedback);if(!ok){experienceResult=previous;paintExperienceResult();}return ok;};
// Replace both automatic feedback and the repeated signing film. No timers or extra clicks.
afterAction=function(old,a){
 if(S.rescuePending){rescuePrompt();return;}if(S.ending)return;
 const decisions=['task','event','acceptOffer','mini','cancelJob','rescheduleJob','capital','investment','chairmanAid','rescue'];
 if(decisions.includes(a.type)){
  clearTimeout(toastTimer);$('#toast').className='toast';
  experienceResult=experienceSummary(old,a);paintExperienceResult();
  return;
 }
 if(!['visit','travel','readReport','readEvent','readMessage'].includes(a.type))maybePriority();
};
const experienceRender=render;
render=function(){experienceRender();paintExperienceResult();
 // Scene decorations and department information get separate rows below the artwork.
 const art=document.querySelector('.scene-art');if(!art)return;
 const nodes=[...art.querySelectorAll('.dept-live,.scene-seal,.business-trace')];
 if(nodes.length){const panel=document.createElement('div');panel.className='experience-scene-status';art.after(panel);nodes.forEach(n=>panel.append(n));}
};
const experienceModal=modal;
modal=function(title,body,opts={}){experienceModal(title,body,opts);
 if(['report','nightReports','knowledge','decisionFeedback','feedbackArchive','morningPortfolio','capital','chairmanAid','chairmanConfirm','reschedule','rescheduleConfirm'].includes(opts.kind))dialog.classList.add('experience-paper');
};
const experienceChoose=chooseDecision;
chooseDecision=function(el,selected=false){experienceChoose(el,selected);const footer=$('#decision-confirm');if(footer){dialog.querySelector('.dialog-body').after(footer);dialog.classList.add('experience-has-confirm');}};
const experiencePriority=maybePriority;
maybePriority=function(){
 // No empty stock briefing on days without holdings or trades. It remains in the archive.
 const b=S&&R8.latestMorning(S);
 if(started&&S&&!S.ending&&!S.rescuePending&&!dialog.open&&S.phase==='day'&&b&&!b.acknowledged){
  const holdings=Object.values(S.investments?.positions||{}).some(p=>Number(p.quantity??p.shares)>0);
  const trades=[...(S.investments?.history||[]),...(S.market?.trades||[])].some(t=>t.day===S.day-1);
  if(!holdings&&!trades){S=E.dispatch(S,{type:'investment_report_read',id:b.id});persist();}
 }
 experiencePriority();
};
