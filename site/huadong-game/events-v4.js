(function(root){
'use strict';const C=root.HDContentV4||require('./content-v4.js');
const E=(id,title,person,when,fact,report,fix,fx,topic='dd',cost=6)=>({id,title,person,when,fact,report,fix,fx,topic,cost});
C.events=[
E('partnerpatent','伙伴的专利说明对不上','secretary',s=>s.flags.signed&&!s.flags.diligence&&s.seed%2===0,'新智链提交的专利说明与一份状态记录不一致。先确认具体权利和时间，不能直接断言项目侵权。','核查发现，对方计入技术对价的旧权利已失效。这影响估值与承诺；项目是否涉及第三方权利需要另一项FTO分析。','重谈对价，补齐承诺与责任',{ddFixed:true,discount:4},'dd',4),
E('thirdpatent','项目收到第三方权利函','legal',s=>s.flags.signed&&!s.flags.ftoClear,'另一家公司主张港区网关涉及其有效专利。来函是主张，尚不是裁判结论。','针对实际同步步骤的比对发现需要处理的范围。可协商项目许可或替换相关步骤，不能靠自有专利抗辩全部问题。','针对比对范围取得项目许可',{ftoClear:true,thirdLicense:true},'fto',10),
E('sublicense','连接器再许可受到质疑','partner',s=>s.flags.signed&&!s.flags.ddFixed&&!s.flags.partnerReplace,'原技术提供方询问新智链是否有权将连接器用于客户部署。授权链仍待查证。','原条款未覆盖新增分包和本次部署。取得补充许可并核对交付对象后，可以继续限定项目。','补齐本项目及列名分包授权',{ddFixed:true},'licensing',7),
E('oldpatent','早期展会材料被翻出','legal',s=>s.flags.signed&&s.license.includes('patent')&&!s.flags.patentReady,'对方发来一份旧展会演示，质疑某项自有专利的稳定性。需要区分不同权利要求与证据。','顾问认为旧结构部分存在值得专题处理的疑点。当前产品可以减少对该结构的依赖；不能花钱就宣称专利恢复稳定。','调整产品依赖并重估旧资产',{oldRelianceReduced:true,around:true},'audit',6),
E('copy','凌晨出现异常资料下载','algorithm',s=>s.flags.signed&&(s.license.includes('core')||s.license.includes('weights')||s.flags.coreAccessOpen)&&!s.flags.controls,'共享目录出现不寻常下载，访问可能涉及分包人员。尚不能证明对方复制或使用了技术。','现有记录不足以完整回溯。可以固定已有证据、缩小访问权限，并在受控环境维持必要服务；已暴露的信息无法简单收回。','限制权限、保全材料并受控协作',{controls:true,logs:true,control:-5},'capital',8),
E('improvements','新市场卡在共同模块上','partner',s=>s.flags.signed&&s.terms&&s.terms.improvements==='partner','新智链认为本地适配改进归其控制，不同意华东直接用于另一个市场。','已签的新成果条件给了伙伴较大控制空间。原有华东技术仍归原权利人，但新模块的使用需补充约定。','购买下一市场限定使用权',{improvementAccess:true},'licensing',8),
E('brandconflict','当地品牌使用收到异议','market',s=>s.flags.signed&&s.license.includes('brand')&&!s.flags.brandClear,'渠道收到品牌相近的异议。先核查地域、类别、权利及实际使用，不能只凭名称相似定性。','当地检索与商业评估提示原宣传方案有冲突风险。调整当地识别方式并核查范围，可以降低本期市场阻力。','调整品牌物料并核实使用范围',{brandClear:true,reputation:-2},'brand',6),
E('domain','客户入口的续费提醒失联','market',s=>s.flags.signed&&s.license.includes('domain')&&!s.assets.includes('domain'),'客户反馈部分链接无法正常访问，域名续费与个人账户管理需要马上确认。','域名在销售旧账户下，续费与交接没有纳入公司流程。恢复入口并移交公司账户，可避免继续影响客户。','恢复入口并完成公司账户交接',{domainReady:true},'capital',3),
E('datachange','客户临时增加司机字段','client',s=>s.flags.signed&&!s.flags.dataReady,'新验收表增加司机身份与操作记录。原本的设备数据说明不能自动覆盖新增处理。','新增字段改变数据用途、访问与保存安排。可以本期不收身份字段，保留设备维护，并约定后续变更评估。','限制本期字段并更新客户约定',{dataReady:true,dataMode:'minimal'},'data',5),
E('component','上线包里多了一个组件','algorithm',s=>s.flags.signed&&!s.flags.component,'交付工程师发现最终版本加入了未在早期清单中记录的软件组件。需要核对具体许可条件。','版本记录和对应许可证需要补齐；不同组件义务不同。针对这个模块替换并验证，可维持限定交付。','替换该模块并验证最终软件包',{component:true},'audit',6),
E('departure','核心工程师提出离职','hr',s=>s.flags.signed&&!s.flags.hrReady,'负责现场适配的工程师提出离职。交接、成果记录和访问权限需要安排，不能只口头挽留。','已有文档不足以支持其他人接手。补充交接、安排备份和回收权限，可以维持服务，但需要投入人手。','组织交接与备份，回收权限',{hrReady:true,staff:2},'capital',7),
E('royaltygap','部署增加，许可费没有增加','finance',s=>s.flags.signed&&s.flags.route==='network'&&!s.flags.royalty,'伙伴的项目进度和许可结算记录不一致。先核对范围和计费条件，不直接认定隐瞒收入。','部分新增部署没有对应的结算记录。双方需要核对合同口径、使用量、争议及付款节点。','核查部署并建立结算机制',{royalty:true},'licensing',4),
E('exclusive','独占伙伴没有兑现推广','market',s=>s.flags.signed&&s.terms&&s.terms.exclusive==='open','其他渠道有意接触，但现有区域独占承诺限制了进入空间，新智链推广未达预期。','合同没有清晰的业绩退出条件，不能单方面当作已解除。补充协商可以恢复部分市场空间，也要作出商业让步。','协商缩小独占并加入业绩节点',{exclusiveAdjusted:true,trust:-2},'licensing',8),
E('quality','当地交付出现服务投诉','client',s=>s.flags.signed&&s.flags.route==='network'&&!s.flags.quality,'伙伴能够运行产品，但服务响应和培训没有跟上。客户投诉正在影响品牌。','问题集中在响应、交接和培训，并非单靠品牌授权即可解决。建立服务标准和纠正机制有助于恢复信任。','培训、抽查并完成客户补救',{quality:true,trained:true,reputation:2},'franchise',7),
E('payment','客户要求说明付款条件','finance',s=>s.flags.signed&&!s.flags.inspected,'客户认为最终交付边界尚不清楚，询问能否把付款与已验证功能分别对应。','当前验收条目存在范围分歧。先写清阶段功能与凭证可以减少回款争议，但不等于款项已经到账。','补充阶段条件与交付证据',{paymentClear:true},'coord',3),
E('earlydemo','客户希望提前看到成果','market',s=>!!s.flags.route,'采购委员会临时提前讨论，希望获得可信的产品材料。我们可以限定范围，也可以投入加速。','客户更看重已验证的维护响应，而非展示所有源码。限定资料、功能与受众可以争取后续采购机会。','展示有证据的能力并管理预期',{opportunity:true,reputation:3},'brand',3),
E('newclient','另一家物流企业来询价','market',s=>s.flags.customer||s.flags.demo,'一位区域客户通过现有联系表达兴趣，需要确认其需求是否适合通用方案。','对方需求可用既有接口服务满足，不需要移交核心资料。若当前交付能按期完成，可以形成下一市场线索。','接入限定需求，保留本期交付优先',{pipeline:true,opportunity:true},'make',3),
E('competitor','竞争者报出了更低的价格','market',s=>s.flags.ftoClear||s.flags.tested,'客户转来竞争报价。低价会影响选择，但目前没有证据表明对方复制或侵权。','客户访谈显示，稳定运行和明确服务责任仍有价值。已有测试、授权及交付记录可支持有依据的差异化报价。','用实际服务与证据回应竞争',{reputation:4,opportunity:true},'coord',3)
];
C.eventById=Object.fromEntries(C.events.map(e=>[e.id,e]));
if(typeof module!=='undefined')module.exports=C.events;
})(typeof globalThis!=='undefined'?globalThis:window);
