/* Fictional business opportunities. Cash is settled only after agreed work. */
(function(root){'use strict';
const C=root.HDContentV4||(typeof require==='function'?require('./content-v4.js'):null);if(!C.events&&typeof require==='function')require('./events-v4.js');
const extra=[
{id:'innovationdeal',title:'海岚设备想购买我们的改进成果',person:'hardware',topic:'invent',commercial:true,custom:true,when:s=>!!(s.flags.invent||s.flags.futureTech||s.flags.siteHardware||s.flags.siteAlgorithm),fact:'海岚设备希望将华东的维护改进用于它的设备产品。研发认为有复用价值，财务希望尽快回款，对方则提出了独占买断。',report:'技术与交付边界已经核对。可以提供限定用途的非独占许可，也可以转让这项改进的独占商业使用权。后者会限制华东继续向其他厂商许可同一改进。新成果尚未被视为已授权专利。',fix:'履行改进成果交易',cost:2,fx:{}},
{id:'patentclaim',title:'竞品设备疑似使用华东的专利方案',person:'legal',topic:'licensing',commercial:true,custom:true,when:s=>!!s.flags.patentReady,fact:'销售带回一台竞品网关与公开说明，怀疑其使用了华东已有的同步方案。先确认权利状态、地域、实际实施和证据，再决定如何行动。',report:'针对本案产品的模拟证据比对支持进一步交涉，但尚无司法裁判。对方愿意讨论付费和解及限定许可，也可以继续争议程序。游戏采用压缩商务时间；不会在几天内虚构一份生效判决。',fix:'争议解决与权利商业化',cost:3,fx:{}},
{id:'accessrequest',title:'签约后的第一通异常来电',person:'secretary',topic:'licensing',custom:true,when:s=>!!s.flags.signed,fact:'许知微：新智链现场组想临时开通源码目录，理由是今晚必须完成排障。申请名单里还有一位合同未列明的分包人员。陈文杰在等你的答复。',report:'核对发现申请超出了当前列名人员范围。可以让华东主持受控排障，也可以先验证人员和权限后再开放。签约不等于所有后续访问都已获授权。',fix:'安排受控排障',cost:2,fx:{}}
];
for(const e of extra)C.events.push(e);
for(const id of ['newclient','earlydemo','departure','royaltygap'])C.events.find(e=>e.id===id).custom=true;
C.events.find(e=>e.id==='newclient').commercial=true;
C.eventById=Object.fromEntries(C.events.map(e=>[e.id,e]));
const op=(id,label,desc,cost,fx)=>({id,label,desc,cost,fx});
const t=(id,title,place,brief,options,topics)=>({id,title,place,person:C.places[place].person,brief,options,needs:['strategy'],slots:1,topics,remote:false});
C.tasks.push(
 t('siteHardware','走进深圳实验台','hardware','现场能看到远程报告省略的峰值测试。选择投入复测，或追问工程师的瓶颈。',[
 op('validate','亲自看极限负载复测','验证散热与同步瓶颈，形成可交付的改进证据；后续改进许可报价提高。',3,{siteHardware:true,prototypeProof:true,control:3}),
 op('listen','与现场工程师复盘','发现隐性性能问题，取得改进交易线索；尚未完成充分验证。',1,{siteHardware:true,prototypeClue:true})],['invent','make','coord']),
 t('siteAlgorithm','参加成都模型工作坊','algorithm','算法中心把真实异常样本和访问轨迹摆上屏幕。你可以亲自确定下一轮验证的重点。',[
 op('benchmark','验证误报率与调用边界','形成可展示的改进样本和服务接口，保留新的技术许可机会。',3,{siteAlgorithm:true,modelProof:true,futureTech:true,control:2}),
 op('access','演练外部协作的访问流程','发现报告未写出的共享权限习惯，完成一次实际排障演练。',2,{siteAlgorithm:true,accessRehearsed:true,control:3})],['future','capital']),
 t('sitePartner','现场核对伙伴排班','dataroom','谈判桌上的人员承诺，需要与当天真实团队对应。到资料室核对排班与参与名单。',[
 op('roster','核对名单并与工程师交谈','取得已确认的人手证据，谈判可以争取一份额外现场支持。',2,{partnerWitness:true,trust:2})],['dd','coord'])
);
C.taskById=Object.fromEntries(C.tasks.map(t=>[t.id,t]));
C.sources.push(['WIPO：知识产权争议解决','争议可通过协商、调解与许可解决。游戏中的和解金额、公司及商务周期均为模拟；发现疑似侵权不等于胜诉或自动获赔。','https://www.wipo.int/en/web/business/settle-ip-disputes']);
root.HDContentV4=C;if(typeof module!=='undefined')module.exports=C;
})(typeof globalThis!=='undefined'?globalThis:window);
