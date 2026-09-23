(function(root){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x));
  function questions(course,id){return id==='FINAL'?course.finalQuestions:course.lessons.find(l=>l.id===id)?.questions||[];}
  function fresh(){return {schema:1,courseVersion:'1.0.0',learned:[],earnedQuestions:[],earnedLevels:[],records:{},active:{},reviews:{},purchases:[],theme:'blue',lastLesson:'C01'};}
  const goods={teal:{cost:120,label:'湖绿档案夹'},violet:{cost:180,label:'紫色档案夹'},scholar:{cost:160,label:'研究员徽章'}};
  function balance(s){return s.earnedQuestions.length*10+s.earnedLevels.length*20-s.purchases.reduce((n,k)=>n+goods[k].cost,0);}
  function exact(q,answer){const target=q.options.filter(o=>o.correct).map(o=>o.id).sort();return Array.isArray(answer)&&new Set(answer).size===answer.length&&JSON.stringify([...answer].sort())===JSON.stringify(target);}
  function allPassed(s,c){return c.lessons.every(l=>s.records[l.id]?.passed);}
  function normalise(raw,c){
    if(!raw||raw.schema!==1||raw.courseVersion!==c.version)throw Error('存档版本与本课程不一致');
    const ids=c.lessons.map(l=>l.id),levels=[...ids,'FINAL'],qids=[...c.lessons.flatMap(l=>l.questions),...c.finalQuestions].map(q=>q.id);
    const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
    const list=(x,allowed)=>{if(!Array.isArray(x)||x.length>allowed.length||x.some(v=>typeof v!=='string'||!allowed.includes(v))||new Set(x).size!==x.length)throw Error('存档包含无效项目');return [...x];};
    const n=fresh();n.learned=list(raw.learned,ids);n.earnedQuestions=list(raw.earnedQuestions,qids);n.earnedLevels=list(raw.earnedLevels,levels);n.purchases=list(raw.purchases,Object.keys(goods));
    if(balance(n)<0)throw Error('存档金币不足以对应已兑换物品');
    if(!['blue','teal','violet'].includes(raw.theme)||(raw.theme!=='blue'&&!n.purchases.includes(raw.theme)))throw Error('存档主题无效');n.theme=raw.theme;
    n.lastLesson=ids.includes(raw.lastLesson)?raw.lastLesson:ids[0];
    function answers(a,qs,nullable){if(!Array.isArray(a)||a.length!==qs.length)throw Error('答题记录长度不正确');return a.map((x,i)=>x===null&&nullable?null:list(x,qs[i].options.map(o=>o.id)));}
    if(!obj(raw.records)||!obj(raw.active)||!obj(raw.reviews))throw Error('存档结构不正确');
    for(const [id,r] of Object.entries(raw.records)){
      if(!levels.includes(id)||!obj(r))throw Error('关卡记录无效');const qs=questions(c,id);
      const attempt=a=>{if(!obj(a)||!Number.isFinite(a.at)||a.at<0)throw Error('测验时间无效');const aa=answers(a.answers,qs,false);return {at:a.at,answers:aa,score:aa.filter((v,i)=>exact(qs[i],v)).length};};
      const first=attempt(r.first),last=attempt(r.last);
      if(!Number.isInteger(r.best)||r.best<Math.max(first.score,last.score)||r.best>qs.length||!Number.isInteger(r.count)||r.count<1||r.count>100000)throw Error('测验成绩无效');
      n.records[id]={first,last,best:r.best,count:r.count,passed:r.best>=Math.ceil(qs.length*.8)};
    }
    for(const [id,a] of Object.entries(raw.active)){
      if(!levels.includes(id)||!obj(a))throw Error('进行中记录无效');const qs=questions(c,id),aa=answers(a.answers,qs,true);
      if(!Number.isInteger(a.index)||a.index<0||a.index>=qs.length)throw Error('当前题号无效');
      n.active[id]={index:a.index,answers:aa,draft:list(a.draft,qs[a.index].options.map(o=>o.id))};
    }
    for(const [id,r] of Object.entries(raw.reviews)){
      if(!qids.includes(id)||!obj(r)||!Number.isFinite(r.at)||r.at<0||!Number.isInteger(r.streak)||r.streak<0||r.streak>100000||typeof r.ok!=='boolean')throw Error('复习记录无效');
      n.reviews[id]={at:r.at,streak:r.streak,ok:r.ok};
    }
    return n;
  }
  function start(s,c,id,restart=false){
    const qs=questions(c,id);if(!qs.length)throw Error('找不到关卡');
    if(id==='FINAL'&&!allPassed(s,c))throw Error('请先通过全部 40 个核心关卡');
    if(restart||!s.active[id])s.active[id]={index:0,answers:qs.map(()=>null),draft:[]};
    return s.active[id];
  }
  function submit(s,c,id,selected,at=Date.now()){
    const a=start(s,c,id),qs=questions(c,id),q=qs[a.index];
    if(a.answers[a.index]!==null)return {locked:true,correct:exact(q,a.answers[a.index]),reward:0};
    if(!selected.length)throw Error('请先勾选你认为正确的选项');
    if(new Set(selected).size!==selected.length||selected.some(k=>!q.options.some(o=>o.id===k)))throw Error('选项无效');
    a.answers[a.index]=[...selected];a.draft=[...selected];
    let reward=0;const correct=exact(q,selected);
    if(id!=='FINAL'&&correct&&!s.earnedQuestions.includes(q.id)){s.earnedQuestions.push(q.id);reward=10;}
    return {correct,reward,locked:false};
  }
  function finish(s,c,id,at=Date.now()){
    const a=s.active[id],qs=questions(c,id);if(!a||a.answers.some(x=>x===null))throw Error('请完成本轮全部题目后结算');
    const score=a.answers.filter((x,i)=>exact(qs[i],x)).length,passed=score>=Math.ceil(qs.length*.8);let reward=0;
    if(id==='FINAL')for(let i=0;i<qs.length;i++)if(exact(qs[i],a.answers[i])&&!s.earnedQuestions.includes(qs[i].id)){s.earnedQuestions.push(qs[i].id);reward+=10;}
    if(passed&&!s.earnedLevels.includes(id)){s.earnedLevels.push(id);reward+=20;}
    const attempt={answers:clone(a.answers),score,at},old=s.records[id];
    s.records[id]={first:old?.first||clone(attempt),last:attempt,best:Math.max(old?.best||0,score),passed:passed||!!old?.passed,count:(old?.count||0)+1};
    qs.forEach((q,i)=>{const ok=exact(q,a.answers[i]),old=s.reviews[q.id];s.reviews[q.id]={at,ok,streak:ok?(old?.streak||0)+1:0};});
    delete s.active[id];return {score,passed,reward};
  }
  function buy(s,key){if(!goods[key])throw Error('物品不存在');if(s.purchases.includes(key))return false;if(balance(s)<goods[key].cost)throw Error('金币不足，先完成几道新题吧');s.purchases.push(key);return true;}
  function review(s,q,answer,at=Date.now()){const ok=exact(q,answer),prev=s.reviews[q.id];s.reviews[q.id]={at,ok,streak:ok?(prev?.streak||0)+1:0};let reward=0;if(ok&&!s.earnedQuestions.includes(q.id)){s.earnedQuestions.push(q.id);reward=10;}return {ok,reward};}
  const api={fresh,normalise,questions,exact,allPassed,start,submit,finish,balance,buy,review,goods};
  if(typeof module!=='undefined')module.exports=api;else root.IP_ENGINE=api;
})(typeof window==='undefined'?globalThis:window);
