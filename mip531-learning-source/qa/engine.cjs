const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'site/course.js'),'utf8'),ctx);
const C=JSON.parse(JSON.stringify(ctx.window.COURSE)),E=require('../site/engine.js');
let checks=0;function test(label,f){f();checks++;console.log('PASS '+label);}
const right=q=>q.options.filter(o=>o.correct).map(o=>o.id),wrong=q=>[q.options.find(o=>!o.correct).id];
function round(s,id,score){const qs=E.questions(C,id),a=E.start(s,C,id,true);qs.forEach((q,i)=>{a.index=i;E.submit(s,C,id,i<score?right(q):wrong(q),1000);});return E.finish(s,C,id,2000);}
test('40 lessons, 220 unique scenario questions, source ranges and multi-select choices',()=>{
 assert.equal(C.lessons.length,40);assert.equal(C.finalQuestions.length,20);
 const qs=[...C.lessons.flatMap(l=>l.questions),...C.finalQuestions];assert.equal(new Set(qs.map(q=>q.id)).size,220);assert.equal(new Set(qs.map(q=>q.stem)).size,220);
 for(const l of C.lessons){assert.equal(l.questions.length,5);assert.equal(l.nodes.length,3);assert.ok(l.scope&&l.pages&&l.scenario&&l.worked);assert.equal(l.variation.results.length,2);}
 for(const q of qs){assert.ok(q.stem.length>10);assert.ok(right(q).length>=2&&right(q).length<q.options.length);for(const o of q.options)assert.ok(o.text&&o.why);}
});
test('Exact-set marking rejects omissions, extra choices, and repeated choices',()=>{for(const q of C.lessons.flatMap(l=>l.questions)){const r=right(q);assert.ok(E.exact(q,r));assert.ok(!E.exact(q,r.slice(1)));assert.ok(!E.exact(q,[...r,...wrong(q)]));assert.ok(!E.exact(q,[...r,r[0]]));}});
test('Five-question threshold, first/last/best and reward accounting',()=>{
 const s=E.fresh();assert.equal(round(s,'C01',3).passed,false);assert.equal(E.balance(s),30);
 const q=C.lessons[0].questions[3];E.review(s,q,right(q));assert.equal(E.balance(s),40);assert.equal(s.records.C01.passed,false);assert.equal(s.records.C01.last.score,3);
 assert.equal(round(s,'C01',4).passed,true);assert.equal(E.balance(s),60);assert.equal(s.records.C01.first.score,3);assert.equal(s.records.C01.last.score,4);assert.equal(s.records.C01.best,4);
 round(s,'C01',5);assert.equal(E.balance(s),70);round(s,'C01',2);assert.equal(E.balance(s),70);assert.equal(s.records.C01.passed,true);assert.equal(s.records.C01.best,5);assert.equal(s.records.C01.count,4);
});
test('Incomplete rounds and duplicate submissions cannot produce extra rewards',()=>{
 const s=E.fresh();E.start(s,C,'C01');assert.throws(()=>E.finish(s,C,'C01'));assert.throws(()=>E.submit(s,C,'C01',[]));assert.throws(()=>E.submit(s,C,'C01',['bad']));const r=right(C.lessons[0].questions[0]);E.submit(s,C,'C01',r);assert.equal(E.submit(s,C,'C01',r).locked,true);assert.equal(E.balance(s),10);round(s,'C01',5);assert.throws(()=>E.finish(s,C,'C01'));assert.equal(E.balance(s),70);
});
test('Final locked until 40 levels pass; 15 fails, 16 passes, coins deferred',()=>{
 const s=E.fresh();assert.throws(()=>E.start(s,C,'FINAL'));for(const l of C.lessons)round(s,l.id,4);assert.ok(E.allPassed(s,C));assert.equal(E.balance(s),2400);
 const a=E.start(s,C,'FINAL');E.submit(s,C,'FINAL',right(C.finalQuestions[0]));assert.equal(E.balance(s),2400);
 assert.equal(round(s,'FINAL',15).passed,false);assert.equal(E.balance(s),2550);assert.equal(round(s,'FINAL',16).passed,true);assert.equal(E.balance(s),2580);assert.equal(round(s,'FINAL',16).reward,0);
 fs.writeFileSync(path.join(__dirname,'complete-record-fixture.json'),JSON.stringify(s,null,2));
});
test('Purchases and themes survive save/restore and cannot overspend',()=>{
 const s=E.fresh();assert.throws(()=>E.buy(s,'teal'));for(const l of C.lessons.slice(0,3))round(s,l.id,5);assert.equal(E.balance(s),210);assert.ok(E.buy(s,'teal'));assert.equal(E.balance(s),90);assert.equal(E.buy(s,'teal'),false);assert.equal(E.balance(s),90);assert.throws(()=>E.buy(s,'violet'));s.theme='teal';const saved=E.normalise(JSON.parse(JSON.stringify(s)),C);assert.deepEqual(saved,s);
});
test('Draft and locked answers restore; malformed import rejected without mutation',()=>{
 const s=E.fresh(),a=E.start(s,C,'C01');a.draft=right(C.lessons[0].questions[0]);assert.deepEqual(E.normalise(s,C).active.C01.draft,a.draft);E.submit(s,C,'C01',a.draft);assert.equal(E.submit(E.normalise(s,C),C,'C01',a.draft).locked,true);
 const original=JSON.stringify(s);for(const mutate of [x=>x.schema=9,x=>x.earnedQuestions=['fake'],x=>x.active.C01.index=99,x=>x.active.C01.draft=['<script>'],x=>x.purchases=['teal'],x=>x.theme='red']){const x=JSON.parse(original);mutate(x);assert.throws(()=>E.normalise(x,C));}assert.equal(JSON.stringify(s),original);
});
console.log(`All ${checks} engine and content checks passed.`);
