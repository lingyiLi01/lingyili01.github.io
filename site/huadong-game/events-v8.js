/* V8 fictional teaching events. Facts below are scenario records, never allegations about real firms. */
(function(root){'use strict';
const C=root.HDContent,DAY_LAST=25,active=j=>['running','queued'].includes(j.status),round=n=>Math.round(n*10000)/10000;
const done=(s,k)=>!!s.completed?.[k],flag=(s,k)=>!!s.flags?.[k],has=(s,k)=>(s.assets||[]).includes(k),signed=s=>flag(s,'signed'),draft=s=>done(s,'governance')||!!s.terms||!!s.offer;
const worked=(s,k)=>done(s,k)||(s.jobs||[]).some(j=>j.task===k&&j.status!=='cancelled');
const controlled=s=>flag(s,'controls'),proven=s=>flag(s,'tested'),delivered=s=>flag(s,'delivered');
const dispute=s=>['codeDisputeOpen','publicClaim','litigationPending','v8DisputeOpen','v8RegionDispute'].some(k=>flag(s,k));
const choice=(id,label,cost,desc,fx={},extra={})=>({id,label,cost,desc,fx,slots:1,duration:0,...extra,thought:{good:desc,bad:extra.tradeoff||'这次选择的成本和后续安排会留下记录，还要看团队能不能兑现。'}});
const Q=choice,pool=[];
function add(n,title,person,place,topic,when,source,fact,defense,defenseText,choices,tags=[]){
 topic=({diligence:'dd',secrets:'levels'})[topic]||topic;const group=n<=20?'partner':n<=30?'public':n<=40?'internal':'opportunity';
 const d={id:'v8e'+String(n).padStart(2,'0'),number:n,v8:true,v5:true,custom:true,commercial:group==='opportunity',group,title,person,place,city:C.places[place]?.city||'suzhou',topic,when,source,fact,defense,defenseText,options:choices,tags,public:group==='public'||n===17,responseDays:2,expiryPenalty:group==='public'?8:0,report:'处理记录已按这次实际选择保存。',fix:'按本次约定完成后续',cost:0,fx:{}};
 choices.forEach(o=>{o.dept=o.dept||(['partner','client','secretary'].includes(person)?'legal':person);});pool.push(d);return d;
}

add(1,'签字前，对方想换一家公司','partner','partner','diligence',s=>draft(s)&&!signed(s),'你已经决定与新智链讨论合作，合同草案已建立。','陈文杰发来一份新草案，说换成集团另一家公司签字，付款会更方便。新名字和之前查过的主体不同，旧调查不能直接套用。法务把两份文件并排放好，等你决定由谁承担交付和付款责任。',s=>flag(s,'ddDeep'),'已保存的主体核查表指出变更位置，核对费用减少。',[
 Q('verify','核对新主体，再要母公司承诺',2,'新主体通过核对后再签，付款责任另写清楚。',{v8EntityChecked:true,control:2},{duration:1,defenseDiscount:1}),
 Q('retain','仍由原来查过的公司签',0,'草案恢复原主体，对方要重新协调内部流程。',{v8EntityRetained:true,trust:-1}),
 Q('switch','接受新主体，先推进签字',0,'签字更快，新的付款责任仍未核实。',{v8EntityUnverified:true,v8DisputeOpen:true,control:-3,trust:2},{later:{days:2,text:'财务催款时发现，新主体仍需要另行确认付款责任。',fx:{trust:-2}}})]);
add(2,'伙伴希望关联公司也能用技术','partner','partner','licensing',s=>done(s,'license'),'你已选择过交付资产和使用范围。','新智链又送来一张关联公司名单，希望这些公司都能直接使用同一套技术。现有报价和人员安排只覆盖原项目。名单里的每家公司需要做什么还没写清楚，你要决定这次许可是否扩大。',controlled,'列名使用规则已落地，可以直接对照新增名单。',[
 Q('listed','逐家公司核实，并另谈价格',1,'新增使用方先列清楚，价格和人员投入另行确认。',{v8AffiliateListed:true,control:2}),
 Q('project','这次仍只供原项目使用',0,'保留原来的报价和范围，新增项目以后再谈。',{trust:-1,v8AffiliateRestricted:true}),
 Q('all','同意整个集团直接使用',0,'对方更容易推广，但使用范围扩大，尚未增加收费。',{trust:3,control:-5,v8AffiliateOpen:true},{later:{days:2,text:'又有一家关联公司申请上线，本次许可没有对应追加收费约定。',fx:{control:-2}}})]);
add(3,'伙伴新稿要求东盟独占','partner','partner','licensing',s=>!!s.terms,'你已经提交地区和独占条件。','伙伴的新稿把原来讨论的新加坡改成整个东盟，仍沿用本次项目的人手和投入。销售担心以后遇到其他国家客户也要先找这家伙伴。你可以改回地区，也可以用更多投入交换更宽的承诺。',s=>s.terms?.exclusive==='none'||flag(s,'exclusiveAdjusted'),'地区对照记录完整，改动已在签字前被标出。',[
 Q('sg','限定新加坡，其他市场另谈',0,'先把首站做好，其他国家暂不承诺独占。',{v8RegionalBoundary:true,control:3,trust:-1}),
 Q('milestone','扩大范围，但逐国考核投入',1,'每个市场必须达到人员和业务门槛，没做到就释放。',{v8RegionalMilestones:true,trust:2}),
 Q('asean','同意东盟独占，尽快推进',0,'伙伴愿意优先投入，但其他渠道会受限制。',{v8RegionDispute:true,channelLocked:true,control:-7,trust:4},{later:{days:2,text:'另一家区域渠道询问合作，市场部发现独占范围会限制新谈判。',fx:{reputation:-2}}})],['regional-control']);
add(4,'对方以保交付为由索要整套源码','partner','partner','secrets',s=>done(s,'license')||flag(s,'coreAccessOpen'),'你已确定本次技术交付包。','现场组说，担心华东人员临时联系不上，希望保留整套源码自己排障。交付负责人确认，日常问题也可以通过接口支持处理。你现在要决定给出什么，以及紧急情况下谁能打开更深一层资料。',controlled,'权限和交付清单已经分层，普通排障不用开放核心。',[
 Q('service','接口支持，加紧急响应安排',1,'保留核心实现，华东承诺明确的排障响应时间。',{control:3,v8CoreService:true}),
 Q('escrow','设有条件的第三方托管',2,'托管资料只在约定情形下释放，对方得到连续服务安排。',{v8CoreEscrow:true,trust:2},{duration:1}),
 Q('source','直接给源码，让伙伴自行维护',0,'当前配合更顺，但副本交出去后，访问撤销不能收回全部副本。',{coreAccessOpen:true,control:-10,trust:4},{later:{days:2,text:'排障团队已持有核心副本。后续退出仍要核对副本和用途，不能只关闭账号。',fx:{v8CoreCopies:true}}})],['core-control']);
add(5,'测试账号申请管理员权限','algorithm','algorithm','secrets',s=>done(s,'controls')||signed(s),'你已发出项目账号或批准项目访问。','现场测试人员说当前权限不够，申请把项目账号改成管理员。申请单没有说明具体要操作哪个目录。系统保留了这次请求，研发也能安排一次监督演示。需要开放到哪一层，由你来定。',controlled,'现有审批规则已挡住自动提权，没有新增下载记录。',[
 Q('temporary','只开任务需要的临时权限',1,'列明目录和时限，到时回收这次授权。',{v8AccessLimited:true,control:2}),
 Q('demo','由华东操作，现场共同确认',0,'伙伴说明故障，华东在屏幕上完成操作。',{v8Supervised:true,trust:1}),
 Q('admin','开放管理员，先赶进度',0,'操作更方便，账号能够接触原来未开放的目录。',{v8AdminOpen:true,accessOverreach:true,control:-7,trust:2},{later:{days:1,text:'权限检查发现管理员可导出更多文件，团队需要补查实际访问范围。',fx:{v8AccessReview:true}}})]);
add(6,'现场出现名单之外的分包人员','partner','partner','diligence',signed,'你已经签下合作，并确定参与团队。','港口门禁发来的名单比伙伴承诺的多了两个人。陈文杰说这是临时增加的施工帮手，还没来得及补文件。现场缺人是真事，但身份、工作范围和接触资料也需要说清楚，不能只凭一句介绍放行。',controlled,'访客权限仍停在外围，没有自动接触核心目录。',[
 Q('limited','先做外围工作，暂不接触资料',0,'先补现场人手，敏感操作仍由列名团队完成。',{v8SubLimited:true,control:2,trust:-1}),
 Q('register','补身份、任务与保密记录再进场',1,'确认这两人的职责和责任，之后按任务开放。',{v8SubRegistered:true,trust:1},{duration:1}),
 Q('allow','相信伙伴，先全部放行',0,'现场暂时更快，但分包责任和访问范围没有落实。',{v8SubOpen:true,control:-6,trust:3},{later:{days:2,text:'出现资料查询时，旧名单不能说明这两位分包人员具体承担什么责任。',fx:{trust:-2}}})]);
add(7,'压测要用全量训练样本吗','algorithm','algorithm','data',s=>worked(s,'data')||done(s,'secrecy'),'你已准备数据方案或划分技术层级。','伙伴想把全部训练样本带到自己的环境做压力测试。研发说，一部分设备样本已经足够测本期负载，完整数据还包含未公开标签和处理细节。客户给过的授权也要按用途看，测试要求需要重新拆开。',s=>flag(s,'dataReady')&&controlled(s),'已有样本清单和受控环境可以继续使用。',[
 Q('sandbox','用脱敏样本，在受控环境测试',1,'本次只验证约定负载，完整样本留在现有环境。',{v8DataScoped:true,control:3}),
 Q('paid','另谈限定用途的数据服务',1,'扩大测试另签范围和价格，本次不自动计入新收入。',{v8DataService:true,trust:1}),
 Q('full','全量移交，压测尽快完成',0,'测试安排方便了，但样本和标签的外部接触面扩大。',{v8SamplesOpen:true,control:-8},{later:{days:2,text:'数据清单显示，移交范围超过原来本期压测需要的部分。',fx:{reputation:-2}}})]);
add(8,'品牌和域名，登记在谁名下','market','market','brand',s=>done(s,'brand'),'你已决定当地品牌入口。','伙伴提议由他们代办当地品牌和域名，说会更省时间。申请表上的持有人却写成了伙伴公司。市场部提醒，这个入口以后会积累客户联系和宣传价值。代办工作可以交出去，账号和持有人仍需要你确认。',s=>flag(s,'brandClear'),'品牌和域名清单已整理好，可以直接核对申请人。',[
 Q('own','华东持有，自己管账号',1,'品牌和域名都由公司控制，伙伴按授权开展宣传。',{v8BrandHeld:true,control:3}),
 Q('agent','让伙伴代办，持有人仍是华东',0,'利用对方办事经验，登记和账户控制权写清楚。',{v8BrandHeld:true,trust:1}),
 Q('partner','登记在伙伴名下，先上线',0,'上线方便，但客户入口和账户控制交到对方手里。',{brandAgentHeld:true,control:-6,trust:3},{later:{days:2,text:'市场部要改联系方式，需要先向伙伴申请品牌入口的管理权限。',fx:{channelLocked:true}}})]);
add(9,'本地改进，合作方想全部拿走','partner','partner','invent',s=>worked(s,'invention')||flag(s,'futureTech')||flag(s,'siteHardware'),'你已投入改进或现场适配。','联合团队做了一个本地适配，伙伴希望以后所有类似改进都归他们。研发指出，有些部分能够用于其他客户，有些确实来自伙伴的现场经验。现在需要把成果拆开谈，不能用一句话包下未来全部改动。',s=>s.terms?.improvements&&s.terms.improvements!=='partner','原合同保留了改进分类，可以按这次投入继续核对。',[
 Q('split','按贡献分清归属，再互相许可',1,'通用核心和本地工具分别处理，项目仍可继续使用。',{v8ImprovementSplit:true,control:3,trust:1}),
 Q('joint','共同持有，并写清再次许可规则',1,'双方都参与后续使用决策，也要接受协调成本。',{v8ImprovementJoint:true,trust:2}),
 Q('give','全部让给伙伴，换当前配合',0,'本期配合更顺，但华东复用同类改进时会受限制。',{soldImprovement:true,control:-6,trust:3})]);
add(10,'伙伴不希望华东直接见客户','partner','partner','coord',s=>flag(s,'customer'),'你已取得并核实客户需求和联系人。','新智链说，为了让客户沟通更统一，之后所有问题都由他们转达。市场部手上已有真实客户联系人，技术团队也需要确认现场细节。你要决定谁来参加下一次会面，以及重要需求如何留下双方都能看到的记录。',s=>flag(s,'partnerWitness'),'已有联合客户会议记录，需求可以互相对照。',[
 Q('joint','一起见客户，共同留会议记录',0,'伙伴继续主导本地关系，华东也能直接核对需求。',{v8ClientDirect:true,trust:1}),
 Q('interface','约定技术联系人和定期客户会',1,'日常由伙伴协调，技术和验收问题保留直接沟通。',{v8ClientDirect:true,control:2}),
 Q('relay','全部交给伙伴转达',0,'减少华东沟通投入，也更依赖伙伴解释客户需求。',{channelLocked:true,trust:3},{later:{days:2,text:'客户提出新需求，华东只能等伙伴转述，直接澄清的时间变长。',fx:{v8ClientDependent:true}}})]);
add(11,'下一笔付款想往后放，技术却要先交','finance','finance','value',s=>!!s.contract,'你已签下合同和付款里程碑。','伙伴说采购付款流程变慢，希望下一批技术继续按原计划交出。财务对照合同，确认这次要求会让交付走在约定付款前面。你可以调整交付批次、要求增信，也可以继续全量投入，但现金缺口要自己承担。',s=>flag(s,'paymentMilestones'),'已签里程碑能说明原付款节点，谈判有明确依据。',[
 Q('staged','按付款进度分批交付',0,'本次先交已付款对应部分，后续资料等付款条件落实。',{v8PaymentProtected:true,trust:-1}),
 Q('guarantee','先落实担保，再继续交付',1,'确认付款保障后继续原排期，尚未到账的款不当现金。',{v8PaymentProtected:true,trust:1},{duration:1}),
 Q('deliver','先全交，等待后续付款',0,'交付不暂停，但财务要承担更长的等待。',{v8PaymentExposure:true,trust:2},{later:{days:2,text:'付款仍在对方流程中，本次没有新增到账，现金等待期延长。',fx:{trust:-2}}})]);
add(12,'演示前，客户又加了免费功能','client','port','coord',s=>!flag(s,'demo')&&(worked(s,'demo')||(proven(s)&&flag(s,'customer'))),'你已安排演示或准备经过验证的演示版本。','客户希望演示时再加两项功能，伙伴答应得很快，却还没有问研发排期。原来的演示范围有记录，新功能还没走完验证。今天需要决定演示什么、什么时候补什么，免费承诺也会占用团队时间。',s=>flag(s,'changeControlManaged'),'已有变更记录和确认办法，可以直接列出新增范围。',[
 Q('change','补变更单，新增功能另报价排期',1,'按原计划演示已验证部分，新增内容另行确认。',{v8ChangePriced:true,trust:-1}),
 Q('trim','缩小这次演示，集中展示成熟功能',0,'少展示一点，保留团队准备和解释空间。',{v8DemoScoped:true,reputation:1}),
 Q('free','全部免费加上，照常演示',2,'对方期待提高，未经验证的功能仍存在兑现压力。',{overpromise:true,trust:3},{later:{days:1,text:'新增功能占用了准备时间，团队提示原测试结论不能覆盖全部新功能。',fx:{reputation:-3}}})]);
add(13,'有人建议删掉异常访问日志','legal','legal','secrets',s=>done(s,'controls'),'你已建立访问控制或日志记录。','伙伴认为访问日志里包含员工信息，建议把异常记录直接清掉。法务同意要控制谁能看、保存多久，但这些记录也可能解释文件何时被访问。你要决定如何减少不必要信息，同时留下本次项目需要的记录。',controlled,'已有日志权限和用途说明，可以在原规则上收窄。',[
 Q('minimal','保留必要记录，限制查看与期限',1,'减少不必要个人信息，保留本次访问事实。',{v8LogsKept:true,control:3}),
 Q('audit','交给受约束的审计方保管',2,'项目团队减少日常接触，后续按约定调取。',{v8LogsKept:true,trust:1},{duration:1}),
 Q('delete','直接清空，结束争论',0,'当前沟通轻松了，但对应访问线索无法靠口头承诺补回。',{v8LogsDeleted:true,control:-8,trust:2})]);
add(14,'采购想换一个便宜的封闭组件','hardware','hardware','fto',s=>!!s.flags.product,'你已确定产品架构和组件路线。','采购拿到一个更便宜的连接组件，伙伴说它和原来的差不多。研发还没有拿到完整版本说明，也没验证替换后的运行情况。已有调查对应旧组合，你需要把价格、来源、性能和重新核查的时间一起考虑。',s=>flag(s,'component'),'原物料清单和版本记录完整，可以明确比较差异。',[
 Q('verify','核对来源，复测后再决定替换',2,'先确认具体版本和权利安排，再看节省是否值得。',{v8ReplacementChecked:true},{duration:1}),
 Q('keep','这次继续用原来的组件',0,'保持已验证版本，暂不取得这笔采购节省。',{v8ComponentKept:true}),
 Q('cheap','先换便宜组件，后补验证',0,'采购报价下降，但新组合不能继续借用旧测试结论。',{v8UnverifiedComponent:true,control:-3},{later:{days:1,text:'新组件的兼容性和使用范围仍待核查，原报告不能覆盖新版本。',fx:{v8DisputeOpen:true}}})]);
add(15,'第三方指出伙伴的许可链缺一段','legal','legal','diligence',s=>done(s,'diligence')&&!flag(s,'partnerReplace'),'你已调查伙伴，仍计划使用对方引进的技术。','第三方发来原许可文件，指出其中没有列出本次参与的新团队。伙伴曾说自己有权安排这些使用方，现在需要对照原文补证。这说明许可范围有缺项，还不能直接把全部产品认定为侵权，更不能把旧专利状态混在一起。',s=>flag(s,'ddFixed'),'已补过的项目授权可以对照本次名单；若完全覆盖，显示已核清版本。',[
 Q('pause','暂停有疑问的模块，其他工作继续',0,'控制本次交付范围，等待对应许可被确认。',{v8RightsPaused:true,control:2,trust:-1}),
 Q('license','补本项目许可，再继续使用',2,'把参与人和用途补进文件，其他第三方权利仍另查。',{v8ChainFixed:true,ddFixed:true},{duration:1,defenseDiscount:2}),
 Q('replace','改用已能核对来源的替代方案',3,'减少这段许可依赖，团队承担一次适配与复测。',{v8ChainAlternative:true},{duration:1})],['rights-gap']);
add(16,'核心工程师收到伙伴的顾问邀请','hr','hr','capital',s=>signed(s)&&(flag(s,'staff')||done(s,'staff')||has(s,'people')),'你已确定伙伴团队，并安排过关键人员或识别人员依赖。','一位工程师主动转来新智链的兼职邀请，说还没有接受。人力部门提醒，邀请本身不代表谁做错事，关键是时间冲突、资料使用和项目交接。你要在留人、尊重个人选择和维持项目连续性之间做安排。',s=>flag(s,'hrReady'),'已有交接清单和备用人员，项目不只依赖一个人。',[
 Q('declare','先聊意愿，明确冲突和资料边界',0,'核对具体工作内容，再决定能否接受兼任。',{v8ConflictDeclared:true,trust:1}),
 Q('retain','调整岗位与留任安排',2,'用明确职责和发展安排留人，同时保留交接计划。',{v8TalentRetained:true,staffVacancy:false}),
 Q('ignore','暂不谈，先让项目继续',0,'眼下少一次沟通，兼任和交接问题仍未说明。',{v8PeopleBoundaryOpen:true},{later:{days:2,text:'工程师再次询问兼职安排，项目仍没有明确冲突和交接记录。',fx:{control:-2}}})]);
add(17,'合作还没说清，对方先公开宣布了','market','market','brand',s=>done(s,'license')||signed(s),'你已给出合作范围，已有可核对的草案或合同。','记者来问，华东是不是已经把整个东盟交给新智链。市场部找到伙伴刚发的宣传稿，其中有部分说法超过双方确认的范围。客户也在等回复。你需要根据已签和未签的内容说明事实，不能让宣传替代合同。',s=>flag(s,'brandClear'),'已有对外口径和范围记录，能够给出简短更正。',[
 Q('facts','只说明已确认内容，标清未定条件',0,'用可核对的事实回应，客户知道哪些事情还在谈。',{reputation:3,v8PublicFacts:true}),
 Q('correct','与伙伴一起发布更正',1,'保留合作关系，同时把过宽表述改回来。',{reputation:3,trust:1,v8PublicFacts:true}),
 Q('silent','暂不回应，默认沿用宣传稿',0,'减少眼前争论，但未确认承诺会继续影响市场期待。',{reputation:-4,v8RegionDispute:true},{later:{days:1,text:'客户把宣传中的独占说法当成承诺，市场部需要补做说明。',fx:{reputation:-3}}})],['public-response']);
add(18,'验收款被提议改成长时间质保金','finance','finance','value',s=>signed(s)&&flag(s,'demo')&&!delivered(s),'你已签付款条款，并完成客户演示。','临近验收，客户希望把原定阶段付款留作质保金。财务说，按原合同验收和后续质保是两件事，全部压到以后会拉长现金等待。你可以分别确认，也可以谈分期释放，但要看未来服务投入能否承受。',s=>flag(s,'paymentMilestones'),'原付款和验收记录能直接支持本次对照。',[
 Q('separate','验收款照约付，质保另约范围',0,'按已完成工作确认付款，质保单独说明责任。',{v8AcceptancePaymentProtected:true,trust:-1}),
 Q('stages','接受小部分留存，约定分期释放',1,'给客户持续服务安排，同时避免全部款项被长期压住。',{v8WarrantyStaged:true,trust:2}),
 Q('retain','接受全额留存，先维持关系',0,'客户更放心，华东继续承担资金等待。',{v8WarrantyHeld:true,trust:3},{later:{days:2,text:'质保金仍未到释放日，财务只记应收，不计现金。',fx:{v8CashDelayed:true}}})]);
add(19,'退出合作后，账号和副本还没交回','legal','legal','licensing',s=>flag(s,'partnerReplace')||s.flags.expansion==='hold'||flag(s,'v8ExitChosen'),'你已决定缩减、替换或退出一部分合作。','华东发出退出安排后，对方说还要支持旧客户，暂时不能交回全部账号和资料。法务已经列出原来的返还和继续服务要求。账号可以撤销，但已经形成的副本还需要单独核对，退出工作不会在点一下按钮后结束。',s=>controlled(s)&&s.terms?.exit!=='later','账号和交付记录完整，可以按清单逐项处理。',[
 Q('revoke','先撤多余权限，核对必要服务账号',1,'保留有明确用途的过渡服务账号，逐项跟进副本。',{v8ExitAccessClosed:true,control:3}),
 Q('return','按清单约定返还、删除和核验',2,'形成可对照的退出记录，已外流部分仍单独处理。',{v8ExitRecorded:true},{duration:1}),
 Q('dispute','启动争议处理，分开安排客户支持',3,'将拒不履行的事项交给法务，现有客户服务另外接续。',{litigationPending:true,v8ExitChosen:true},{duration:1})],['exit']);
add(20,'发生争议后，伙伴要求华东全部兜底','partner','partner','licensing',dispute,'本轮已经留下真实的范围、技术来源或公开承诺争议。','伙伴发来索赔分担建议，希望所有外部要求都由华东承担。法务找到了争议发生前双方的操作和披露记录，有些内容需要继续核对。责任应当结合谁控制、谁承诺、谁造成影响讨论，不能只看谁更想赶快继续做生意。',controlled,'操作和交付记录可以帮助区分双方实际控制的部分。',[
 Q('responsibility','对照各自责任，再谈分担',1,'先厘清已知事实，对未核实部分保留意见。',{v8LiabilityScoped:true,control:2}),
 Q('cap','约定分担上限，保留关键例外',2,'双方承担可估计的范围，未来变化再处理。',{v8LiabilityCapped:true,trust:2}),
 Q('all','先承担全部要求，维持项目',0,'合作暂时继续，但现金责任没有清楚上限。',{v8LiabilityOpen:true,trust:3},{later:{days:2,text:'新的索赔要求仍在核对，华东已作宽泛承担承诺，尚无确定赔偿数额。',fx:{control:-4}}})]);

add(21,'记者报道项目涉嫌侵权','market','market','fto',s=>flag(s,'publicClaim')||flag(s,'v8PublicAccusation')||flag(s,'codeDisputeOpen'),'本轮已出现公开指控或代码来源争议。','记者根据现有投诉写了一篇报道，客户开始询问项目还能不能继续。报道使用了涉嫌字样，目前没有法院结论。市场部需要一份可以公开说的事实说明，也要让正在合作的客户知道哪些工作照常、哪些还在核实。',s=>flag(s,'ftoCovered')&&flag(s,'component'),'已有范围和版本记录，可公开说明核查到哪一步。',[
 Q('facts','公布核实过的事实与下一步',1,'说明已知范围，不把调查写成判决。',{reputation:4,v8CrisisAnswered:true}),
 Q('clients','先直接沟通客户，再给统一说明',1,'让客户知道实际影响，公开回复同时保留事实边界。',{reputation:3,trust:1,v8CrisisAnswered:true}),
 Q('silence','暂时保持沉默',0,'暂不作新表态，客户疑问和公开压力继续存在。',{reputation:-5},{later:{days:1,text:'客户没有得到项目影响说明，暂停了下一轮业务讨论。',fx:{reputation:-4}}})],['public-crisis']);
add(22,'竞品在公开演示里说我们抄袭','market','market','fto',s=>!!s.flags.product&&flag(s,'demo'),'你已确定产品，并进行对外演示。','竞品放出一段对比视频，认为两款产品某些功能很像。视频是公开材料，但相似功能本身还不能说明技术来源。研发拿出了版本记录，你要决定怎样回应市场，同时避免把未经核对的争论越说越大。',s=>flag(s,'component')&&done(s,'ownership'),'已有组件来源和开发文件，能具体回应来源问题。',[
 Q('evidence','拿可公开的开发证据回应',1,'只展示与本次质疑有关的记录，保留敏感实现。',{reputation:4,v8SourceResponse:true}),
 Q('test','请独立团队比对并公开结论范围',2,'先核对具体技术点，再公布本次检测能说明的内容。',{reputation:2},{duration:1,defenseDiscount:1}),
 Q('adjust','调整争议展示部分，继续交付',1,'先减少展示争论，也要解释调整不等于承认全部指控。',{reputation:1,v8DemoAdjusted:true})]);
add(23,'经销商群里流传一张合同截图','market','market','licensing',s=>flag(s,'v8RegionDispute')||flag(s,'sideExclusive'),'本轮已存在地区或独占范围争议。','有人在经销商群里转发半页合同，说华东以后不能再谈其他渠道。截图没有完整条件，市场部已经收到几次询问。你需要说明与当前客户有关的范围，也要守住合同中未获准公开的内容，不能整份发出去解释。',s=>flag(s,'v8RegionalBoundary')||flag(s,'exclusiveAdjusted'),'地区和条件已被写清，公开说明可以更短。',[
 Q('summary','只公开必要的范围说明',0,'解释这次合作覆盖哪里，其他保密条款继续保留。',{reputation:3,v8RumorAnswered:true}),
 Q('joint','让双方共同澄清截图遗漏',1,'共同说明适用条件，减少渠道重复询问。',{reputation:4,trust:1}),
 Q('full','把整份合同公开证明自己',0,'信息更完整，但未经确认公开了保密条款。',{reputation:-5,control:-3,v8ConfidentialPublic:true})]);
add(24,'投标方追加了技术证明要求','client','port','audit',s=>flag(s,'customer')&&!delivered(s),'你已核实目标采购机会并决定争取客户。','采购方更新了本轮材料清单，要求说明技术来源、版本和持续服务能力。原来的产品介绍还不够。已经整理好的资产记录能直接用上，缺的部分则需要补充，你要判断这次机会是否值得继续投入。',s=>flag(s,'auditWide')&&flag(s,'component'),'资产和版本文件已齐，可减少补件投入。',[
 Q('documents','补齐本次需要的证明',2,'按采购清单补材料，不扩大对未核实能力的承诺。',{v8BidProof:true,reputation:2},{duration:1,defenseDiscount:2}),
 Q('joint','找能力互补的团队联合投标',1,'明确各方提供什么证据，再共同响应要求。',{v8JointBid:true,trust:1}),
 Q('withdraw','退出这次新增要求的机会',0,'释放团队，不影响已经签下的其他项目范围。',{v8BidWithdrawn:true})]);
add(25,'客户提出新的数据采购要求','legal','legal','data',s=>flag(s,'dataReady')||done(s,'data'),'你已接触客户数据并决定本次处理方式。','客户转来更新的数据采购清单，要求说明部署位置、访问人员和保存期限。法务先对照这次项目，不把新清单自动解释成旧合同违法。需要改多少、是否影响演示和费用，都要按实际字段和处理方式判断。',s=>s.flags.dataMode==='minimal'||s.flags.dataMode==='local','现有最小化或本地处理方案已满足部分要求。',[
 Q('scope','核对适用要求，补本项目说明',1,'按实际字段和用途补充，不替客户作过宽承诺。',{v8DataPurchaseChecked:true,reputation:2},{defenseDiscount:1}),
 Q('local','改本地处理，并重新验证范围',2,'调整部署后重新核查访问和保存安排。',{v8DataLocalChange:true},{duration:1}),
 Q('delay','说明缺口，延期数据功能',0,'暂不交付还没说清的字段，保留已能开展的功能。',{v8DataDeferred:true,trust:-1})]);
add(26,'行业整体估值下调','finance','finance','value',s=>(flag(s,'demo')||done(s,'marketing')||flag(s,'v8PublicFacts'))&&!pool.some(d=>d.number>=21&&d.number<=30&&d.number!==26&&!(s.events||[]).some(e=>e.id===d.id)&&d.when(s)),'本项目已有公开签约或公开演示，行业行情是公开信息。','行业公开交易信息显示，市场愿意给同类企业的估值普遍下降。财务说明，这是外部市场变化，不是内部未公开材料突然传到了市场。今天需要看现金和扩张节奏，股价变化、持仓市值和可用现金会分别列出。',s=>s.cash>=20,'专项现金仍有缓冲，不必因为单日估值调整立即改变全部计划。',[
 Q('cash','保留现金，按已有里程碑推进',0,'把当前交付做完，暂缓新增的非必要投入。',{v8CashConserved:true}),
 Q('fund','仍按原计划评估融资',1,'重算融资条件，未成交前不把预计融资计入现金。',{v8FundingReviewed:true}),
 Q('slow','收缩下一站投入，先稳首站',0,'减少本轮扩张承诺，等待已签项目兑现。',{v8ExpansionSlowed:true,reputation:1})]);
add(27,'媒体质疑伙伴的付款能力','finance','finance','diligence',signed,'你已选择新智链并签下含付款安排的合作。','一篇公开报道质疑伙伴的回款情况，财务还没拿到与本项目直接有关的证明。传闻不能当成违约结论，但现有信用判断需要更新。你要决定先查什么，以及是否调整后续交付与收款安排。',s=>flag(s,'ddDeep')&&flag(s,'v8PaymentProtected'),'既有核查和付款保障可用来核对本次影响。',[
 Q('verify','先核实本项目付款能力',1,'区分报道、对方说明和可核对的付款证明。',{v8CreditVerified:true,reputation:1},{duration:1}),
 Q('security','要求对应担保，再追加交付',1,'不把传闻当定论，也不给新的无保障敞口。',{v8PaymentProtected:true,trust:-1}),
 Q('milestone','改小交付批次，付款逐段确认',0,'减少后续垫付，伙伴需要配合更细的结算。',{v8PaymentProtected:true,trust:-2})]);
add(28,'披露日临近，订单该怎么说','finance','finance','value',signed,'你已完成一项重大合作签约。','财务在整理本轮对外说明，市场部希望把合同金额写得更醒目。合同里还有未完成的条件、待验收部分和未来付款。你要决定公开到什么程度，已签金额、已交付收入和已到账现金不能混成一个数字。',s=>flag(s,'paymentMilestones'),'合同与回款记录已分开，披露核对更快。',[
 Q('review','财务法务对照合同逐项核对',1,'分别列明已签、待履约和已到账的部分。',{reputation:3,v8DisclosureChecked:true}),
 Q('conditions','简要说明进展，保留未定条件',0,'用简短文字说明合作到哪一步，不夸大订单。',{reputation:2,v8DisclosureChecked:true}),
 Q('headline','把意向和未来款都写成销售成果',0,'短期标题更好看，但把条件性金额当成已经兑现。',{reputation:-7,v8DisclosureInflated:true},{later:{days:1,text:'客户和财务指出，公开数字含未完成条件，市场要求更正。',fx:{reputation:-4}}})]);
add(29,'展会事故视频被转发','hardware','hardware','coord',s=>flag(s,'demo'),'你已经做过对外演示，存在可追溯的演示配置。','有人转发演示设备停顿的短视频，片段没有展示当时设置。研发已经找到对应配置和现场记录，需要确认是设备问题、临时改动还是操作不当。准备充分时也可以拿记录澄清，你先决定如何把事情说清和处理好。',s=>proven(s)&&!flag(s,'overpromise'),'版本和操作记录显示已验证配置稳定，本次先核对视频中的临时设置。',[
 Q('facts','核对配置和现场记录，再回应',1,'先说可核实的原因，不用猜测替代故障调查。',{reputation:2,v8DemoIncidentChecked:true},{duration:1,defenseDiscount:1}),
 Q('retest','公开更正演示条件，安排复测',2,'承认实际需要改的部分，用复测说明能兑现的能力。',{reputation:3,v8DemoRetested:true},{duration:1}),
 Q('deny','直接否认，把视频说成造假',0,'没有完成事实核对就公开定性，可能扩大争议。',{reputation:-6,v8PublicAccusation:true},{later:{days:1,text:'现场记录仍未公开核对，客户要求解释否认依据。',fx:{reputation:-3}}})]);
add(30,'第三方测评肯定了这次交付','market','market','brand',s=>delivered(s)&&proven(s),'你已经完成经过测试的稳定交付。','一份第三方测评认可了本次已交付版本的稳定运行。市场部想借机推广，客户也来问能否扩大使用。测评针对的是具体设备和场景，你要决定如何用好这份材料，同时给团队留出兑现新承诺的能力。',s=>flag(s,'trained')||flag(s,'quality'),'已有服务与支持安排，可以承接更多询问。',[
 Q('market','按测评实际范围做宣传',1,'把验证过的能力讲明白，新增询价仍单独核实。',{reputation:4,v8VerifiedMarketing:true},{sales:1}),
 Q('price','提高新订单报价，先核对需求',0,'认可有助于谈价，但报价没有直接变成收入。',{reputation:2,v8PremiumQuote:true}),
 Q('stable','先稳住现有客户，再逐步推广',0,'把好评留作案例，现有交付和服务仍优先。',{reputation:3,trust:1})]);

add(31,'一项专利的维护日期快到了','legal','legal','audit',s=>has(s,'patent')&&done(s,'audit'),'你把专利列为关键资产，审计已找到维护节点。','法务把维护清单送到桌上，其中一项权利的下一次办理日期接近了。研发说明了它和当前产品的关系，财务也列出费用。你可以继续维护，也可以有依据地放弃不再需要的范围，资产多并不自动等于价值高。',s=>done(s,'ownership'),'这项维护已随权属整改安排，团队交回核清记录。',[
 Q('maintain','维护仍用于本项目的权利',1,'按确认后的用途办理，保留维护记录。',{v8MaintenanceDone:true},{defenseDiscount:1}),
 Q('review','复核业务用途，再决定保留范围',1,'结合本轮和后续用途评估，不默认所有权利都保留。',{v8MaintenanceReviewed:true}),
 Q('abandon','放弃不用的范围，并记下依据',0,'放弃后不再把该范围写入后续交易筹码。',{v8RightsAbandoned:true})]);
add(32,'早期外包合同少写了一项权利','legal','legal','audit',s=>has(s,'code')&&done(s,'audit'),'你审计了平台资产，原委托文件存在再许可表述缺项。','档案室找到了早期委托开发合同，使用和再许可的表述不完整。开发记录能说明一部分工作，仍要核对当时约定。如果前面已经补齐文件，这次就交回核清结果；没有补齐时，需要在补证、补约和替代之间决定。',s=>done(s,'ownership'),'前序整改已补齐本次范围，本事件作为核清回报，不再次制造缺口。',[
 Q('evidence','补开发和交付证据，核对原约定',1,'先把已有证据整理齐，不把单方说明当完整授权。',{v8OutsourceEvidence:true},{defenseDiscount:1}),
 Q('contract','与原开发方补清本次使用约定',2,'把本期交付和再许可范围写进补充文件。',{v8OutsourceFixed:true},{duration:1,defenseDiscount:2}),
 Q('replace','本期换用能说明来源的模块',2,'减少对旧模块的依赖，并给替代版本做验证。',{v8OutsourceAlternative:true},{duration:1})]);
add(33,'外包软件的来源和许可还要对一下','algorithm','algorithm','audit',s=>!!s.flags.product,'你已确定采用连接组件的产品路线。','研发整理实际打包文件时，发现需要核对一个组件的具体许可证和版本。不同软件有不同要求，不能一句话说所有开源都要公开整套代码。如果前面已核清这一版本，就直接复用记录；换过版本的部分仍要再看。',s=>flag(s,'component')&&!flag(s,'v8UnverifiedComponent'),'实际版本与已核查记录一致，没有新增许可缺项。',[
 Q('license','核对具体许可证与交付义务',1,'按本次版本列清要履行什么，不扩大到无关代码。',{v8OpenSourceChecked:true},{defenseDiscount:1}),
 Q('comply','完成确认需要的告知与提供安排',1,'只落实该许可证对应的要求，留存本次交付记录。',{v8LicenseDutiesDone:true}),
 Q('replace','换用来源明确且义务可承受的组件',2,'承担适配工作，替代方案仍要核对性能和范围。',{v8OpenSourceAlternative:true},{duration:1})]);
add(34,'测试资料要流向个人设备','algorithm','algorithm','secrets',s=>flag(s,'coreAccessOpen')||flag(s,'v8AdminOpen')||controlled(s),'你已经开放技术访问或部署访问控制。','访问检查发现，有人尝试把测试资料同步到个人设备。团队正在核对哪些文件实际离开了项目环境。若原有限制已经挡住操作，本次就是一次拦截记录；若已经发生传输，删除设备文件也不能直接恢复原来的保密状态。',s=>controlled(s)&&!flag(s,'v8AdminOpen'),'既有策略拦截了同步，本次记录为未完成传输。',[
 Q('isolate','暂停这条访问路径，核对实际范围',1,'把发生和未发生的传输分开列明，再决定补救。',{v8TransferChecked:true,control:2},{duration:1,defenseDiscount:1}),
 Q('handover','核对设备与交接，补项目访问安排',2,'确认设备、人员和资料范围，后续按记录跟进。',{v8DeviceHandover:true},{duration:1}),
 Q('delete','让员工删掉文件，就结束处理',0,'删除要求已发出，但实际外流和副本范围仍未知。',{v8TransferUnverified:true,control:-5},{later:{days:1,text:'团队没有形成实际传输范围记录，不能确认资料只存在这一份。',fx:{v8DisputeOpen:true}}})]);
add(35,'关键工程师提出离职','hr','hr','capital',s=>has(s,'people')||flag(s,'staffVacancy')||(signed(s)&&!flag(s,'hrReady')),'你已识别关键人员依赖，或当前团队仍缺少交接安排。','负责适配的一位工程师提出离职，希望按约定完成交接。负责人说，部分操作经验还集中在他手里。员工流动本身不等于违法，你要安排好接替、文档和访问回收，也可以讨论对方是否愿意留下。',s=>flag(s,'hrReady'),'备用人员和交接资料已经安排，可按既有清单接续。',[
 Q('retain','谈留任意愿，同时准备替补',2,'尊重个人决定，留任讨论和交接准备同时做。',{v8RetentionTalk:true,staffVacancy:false}),
 Q('handover','安排双人交接和访问回收',1,'把关键操作带给接替人员，再按实际离开时间回收权限。',{v8PeopleHandover:true,hrReady:true},{duration:1,defenseDiscount:1}),
 Q('reschedule','缩小短期任务，给接替留时间',0,'降低眼前承诺，先保持已签范围内的基本支持。',{v8PeopleRescheduled:true,trust:-1})]);
add(36,'两个部门买了重叠的调查','secretary','hq','coord',s=>(s.jobs||[]).filter(j=>active(j)&&['audit','diligence','component','fto'].includes(j.task)).length>=2,'你已同时安排至少两项相关核查。','秘书对照正在执行的工作，发现两份调查都在索取相同的基础材料。负责人说，有些范围可以共用，有些仍需要独立判断。前期已经付掉的费用不会自动退回，你现在可以调整后续范围和材料交接。',s=>flag(s,'documentClues'),'已整理的共同材料可以直接复用。',[
 Q('merge','合并重复材料，分别保留各自结论',0,'共用基础资料，审计和实施调查仍回答不同问题。',{v8WorkShared:true,control:1}),
 Q('independent','保留独立复核，说明额外目的',1,'为独立判断留预算，并记录为什么值得重复看。',{v8IndependentReview:true,control:2}),
 Q('split','分开调查对象，调整后续排期',0,'明确谁查哪一部分，避免后面继续重复采购。',{v8WorkSplit:true})]);
add(37,'最后测试时，设备温度不稳定','hardware','hardware','coord',s=>!!s.flags.product&&!flag(s,'demo')&&(worked(s,'makebuy')||worked(s,'demo')),'你已确定硬件组合，并安排测试或演示准备。','研发在最后一轮测试里发现温度曲线需要复核，涉及这次实际使用的配置。若你已现场见证并锁定参数，团队可以按留存记录快速复测；如果参数又改了，旧结论就不能直接使用。演示方案要跟能验证的能力一致。',s=>flag(s,'siteHardware')&&!flag(s,'v8UnverifiedComponent'),'现场参数和复测记录完整，已有可用的受控配置。',[
 Q('spec','用稳定配置，降低本次峰值规格',0,'先交能稳定运行的范围，明确新的性能边界。',{v8ThermalScoped:true,trust:-1}),
 Q('cooling','补散热并按新配置复测',2,'成本增加，完成复测后再承诺新配置。',{v8ThermalFixed:true},{duration:1,defenseDiscount:1}),
 Q('delay','说明原因，推迟未验证部分',0,'保留原验证事实，不用承诺掩盖尚待测试的内容。',{v8ThermalDelayed:true,reputation:1})]);
add(38,'新增样本让模型表现变差','algorithm','algorithm','data',s=>worked(s,'data')||flag(s,'modelProof')||flag(s,'v8SamplesOpen'),'你已调整数据或完成现场模型验证。','团队把新样本放进本次模型后，发现部分场景表现低于旧测试。研发已经区分了版本和样本来源，旧报告不能替新版本背书。如果你曾保留现场基线，现在可以直接比较变化，再决定限制场景、补测试或回退。',s=>flag(s,'siteAlgorithm')||flag(s,'modelProof'),'现场基线和旧版本仍可复验，不必凭感觉判断。',[
 Q('scope','本期只做已经稳定的场景',0,'限制本次功能范围，保留后续验证任务。',{v8ModelScoped:true}),
 Q('validate','补验证，查清哪些样本造成变化',2,'完成新版本测试，再确认适合的客户场景。',{v8ModelValidated:true},{duration:1,defenseDiscount:1}),
 Q('rollback','回退到留有记录的稳定版本',1,'继续使用可对照的旧版本，新增样本以后再处理。',{v8ModelRolledBack:true,control:1})]);
add(39,'验收条款和现场演示条件不一样','client','port','licensing',s=>signed(s)&&flag(s,'demo')&&!delivered(s),'你已签交付条款，并留下现场演示记录。','客户把验收表发来，其中一项条件和当时演示使用的环境不同。研发认为未必是产品没达标，也可能是文字范围没有说清。双方都保留了部分记录，需要先对照哪一版、什么设备、什么功能，再决定补什么。',s=>flag(s,'partnerWitness')&&flag(s,'changeControlManaged'),'共同确认的现场条件和变更记录可以直接用于核对。',[
 Q('records','按签约和演示记录协商条件',1,'区分条款歧义和实际性能问题，再确认验收范围。',{v8AcceptanceAligned:true},{defenseDiscount:1}),
 Q('redemo','在共同确认的条件下再演示',2,'双方一起见证结果，保留这次完整配置。',{v8AcceptanceRedemo:true},{duration:1}),
 Q('deliver','把新增条件列为补交付事项',2,'明确增加的工作和排期，不默认原合同已经包含全部。',{v8AcceptanceAdded:true},{duration:1})]);
add(40,'物流和现场施工要晚一点','hardware','hardware','coord',s=>signed(s)&&!!s.flags.product&&!delivered(s),'你已签约并确定实际产品交付路线。','物流方通知，一批设备的到场时间晚于原安排，当地施工也需要调整。项目经理列出可以先做的软件配置和不能跳过的安装工作。如果前面留了人手和排期余量，本次影响会更小，你要决定先做什么。',s=>flag(s,'trained')||Number(s.flags.staff||0)>=2,'现有人手能交换部分执行顺序，减少等待。',[
 Q('batches','分批到货，先交能完成的部分',1,'保留总体范围，用分批安排减少全部等待。',{v8DeliveryBatched:true}),
 Q('sequence','先做配置培训，交换施工顺序',0,'利用现有时间完成不依赖到货的工作。',{v8DeliveryReordered:true,trust:1}),
 Q('rush','支付加急费用，保留原目标',3,'增加本次执行成本，仍按实际到货记录确认结果。',{v8DeliveryExpedited:true},{duration:1,defenseDiscount:1})]);

add(41,'新客户愿意付费做小试点','market','market','value',s=>flag(s,'customer')&&proven(s),'你已核实客户，并有可用的经过测试产品。','市场部带来一份小规模试点询价，客户愿意按范围和验收结果付款。产品可以使用，但团队仍有主项目要做。询价还不是现金，你要决定是否分出人手、限定到什么程度，以及完成后才收哪一笔款。',s=>flag(s,'trained'),'已有服务准备，可以减少本次试点支持成本。',[
 Q('pilot','做限定接口试点，完成后收款',2,'签小范围试点，完成交付与确认后收6万元。',{v8PilotSigned:true},{duration:1,receipt:6,requires:proven,defenseDiscount:1,sales:1}),
 Q('small','缩小为付费验证，先不加现场服务',1,'完成一次限定验证，客户确认后收3万元。',{v8SmallPilot:true},{duration:1,receipt:3,requires:proven,sales:1}),
 Q('decline','婉拒这次，先做完现有客户',0,'本次不新增费用和收入，现有项目继续。',{v8PilotDeclined:true})]);
add(42,'老客户想续费和升级','finance','finance','licensing',s=>delivered(s)&&controlled(s),'你已稳定交付，并落实可核对的技术使用范围。','现有合法使用方准备继续使用产品，询问下一期费用和升级安排。团队确认旧版本仍可支持，新功能则需要另外验证。续费意愿还没变成到账，你要决定卖持续许可、服务，还是投入升级后收取更多费用。',s=>flag(s,'royalty'),'使用与付款记录齐全，续约对照更快。',[
 Q('renew','续现有许可，核对使用后收款',1,'按已验证的使用范围续约，核对完成后收5万元。',{v8RenewalSigned:true},{duration:1,receipt:5,requires:delivered,sales:1}),
 Q('service','只续维护服务',1,'提供确认能完成的维护，服务确认后收3万元。',{v8ServiceRenewal:true},{duration:1,receipt:3,requires:delivered}),
 Q('upgrade','投入小升级，验证通过后交付',3,'新版本另走测试，客户确认后收8万元。',{v8UpgradeSigned:true},{duration:2,receipt:8,requires:s=>delivered(s)&&proven(s),sales:1})]);
add(43,'另一个产品疑似用了我们的成果','legal','legal','licensing',s=>flag(s,'patentReady')||done(s,'ownership'),'你已核对本轮相关权利，拥有可继续比对的权利线索。','销售带回公开产品样本，怀疑其中用了华东的受保护成果。法务先核对本次权利的状态和范围，再看样本能证明什么。发现相似线索还不是胜诉，更没有赔款到账，你要决定先保全、谈判还是进入争议程序。',s=>flag(s,'documentClues')&&done(s,'ownership'),'权利和研发记录可用于本次对照，取证范围更明确。',[
 Q('preserve','保全样本，核对权利和实施证据',2,'先把本次可核对的事实整理清楚，暂不公开定性。',{v8RightsEvidence:true},{duration:1,defenseDiscount:1,later:{days:1,text:'本次模拟比对材料已形成，对方提出愿意讨论有限和解与未来许可。尚未签署或收款。',fx:{v8SettlementOffer:true}}}),
 Q('license','基于现有线索提出许可讨论',1,'先说明待核实问题，对方报价不能当作已经成交。',{v8RightsTalk:true},{later:{days:1,text:'对方同意讨论报价，仍需对照实施范围和正式文件。',fx:{v8SettlementOffer:true}}}),
 Q('dispute','交法务准备争议程序',3,'保存证据并准备程序，游戏本轮不凭空生成判决。',{litigationPending:true,v8DisputeOpen:true})]);
add(44,'对方提出付费和解及未来许可','legal','legal','licensing',s=>flag(s,'v8SettlementOffer')&&(flag(s,'v8RightsEvidence')||flag(s,'v8RightsTalk')),'前序争议已有材料，对方已明确提出和解与许可讨论。','对方发来具体报价，希望解决这次争议，并继续在限定产品里使用技术。法务把一次性金额、未来范围和保密条件分开列出。你可以收窄和解、安排后续许可，也可以继续争议，签署和付款完成前都不增加现金。',s=>flag(s,'v8RightsEvidence'),'已经保存的比对材料支持明确谈判范围。',[
 Q('settle','限定这次争议，签署付款后结束',1,'按本次事实签一次性和解，核对付款后收5万元。',{v8SettlementSigned:true},{duration:1,receipt:5,requires:s=>flag(s,'v8SettlementOffer')}),
 Q('license','和解加限定未来许可',2,'说明后续产品和用途，签署履行后收8万元。',{v8RightsLicenseSigned:true},{duration:2,receipt:8,requires:s=>flag(s,'v8SettlementOffer'),sales:1}),
 Q('continue','报价不合适，继续争议程序',2,'保留现有证据和主张，本次没有和解款。',{litigationPending:true})]);
add(45,'控制住技术后，伙伴愿意加预付款','partner','partner','value',s=>signed(s)&&controlled(s)&&flag(s,'customer')&&(flag(s,'modelProof')||flag(s,'prototypeProof')||flag(s,'valuation')),'你保留了可验证的技术价值，客户需求和交付边界已有记录。','伙伴认可了本次演示价值，也看到核心不能轻易被替代，提出多付一笔阶段投入，换取更明确的服务和使用安排。财务强调，这要形成新的小额服务约定，不能重复计算原合同已经约定的首付款。',s=>flag(s,'v8CoreService')||flag(s,'v8CoreEscrow'),'连续服务安排已有基础，不需要换成整套源码。',[
 Q('stage','追加阶段服务，到账后开放对应范围',1,'另签限定服务，条件满足并核对付款后收4万元。',{v8BargainWin:true},{duration:1,receipt:4,requires:controlled,sales:1}),
 Q('staff','不加收费，换成明确的伙伴人手',0,'把新增投入用于交付能力，现金不增加。',{v8PartnerStaffAdded:true,trust:2}),
 Q('hold','维持原合同，不扩大承诺',0,'保留现有边界和安排，这次不新增收入。',{v8BoundaryKept:true,control:2})],['bargaining-win']);
add(46,'客户愿意提前付一部分里程碑款','finance','finance','value',s=>signed(s)&&flag(s,'demo')&&proven(s)&&!delivered(s)&&!flag(s,'earlyPay'),'你已完成可核对的阶段子目标，尚未用过提前支付安排。','客户认可了已完成的一部分工作，愿意提前支付原合同里的一小笔阶段款。财务把它标成原有应收的提前到账，不是额外订单。需要确认已完成范围，后面的验收款也要相应扣掉，避免把同一笔钱算两次。',s=>flag(s,'partnerWitness'),'双方已有子目标见证记录，确认范围更直接。',[
 Q('advance','确认子目标，收原阶段款中的4万元',0,'确认后核对4万元到账，后续原阶段款相应减少。',{v8AdvanceAgreed:true},{duration:1,receipt:4,advance:true,requires:s=>signed(s)&&proven(s)}),
 Q('small','只提前收2万元，保留更多验收空间',0,'核对2万元到账，后续原阶段款同样相应减少。',{v8AdvanceAgreed:true},{duration:1,receipt:2,advance:true,requires:s=>signed(s)&&proven(s)}),
 Q('wait','按原合同等验收付款',0,'不改变原付款时点，现有应收继续保留。',{v8AdvanceDeclined:true})]);
add(47,'供应商拿来了可核对的替代方案','hardware','hardware','fto',s=>flag(s,'around')||flag(s,'v8UnverifiedComponent')||flag(s,'v8RightsPaused'),'你已因实施障碍或组件问题决定考虑替代路径。','供应商提供了替代技术的版本、报价和来源文件，研发认为值得认真比较。资料可核对只是起点，仍需要看实际性能、许可范围和适配时间。你要决定做完整验证、先做小范围验证，还是继续现有方案。',s=>flag(s,'dualSource')||flag(s,'siteHardware'),'已有替代比较和现场参数，能减少重复准备。',[
 Q('full','做适配与范围核对，再正式替换',3,'完成当前产品的验证，不能只凭供应商说明放行。',{v8AlternativeVerified:true},{duration:2,defenseDiscount:1}),
 Q('trial','先做限定模块验证',1,'用小范围结果判断是否值得继续投入。',{v8AlternativeTrial:true},{duration:1}),
 Q('keep','暂用已有可交付方案',0,'保留替代资料，这次不承担新的切换成本。',{v8AlternativeSaved:true})]);
add(48,'另一家当地服务商愿意直接合作','market','market','licensing',s=>flag(s,'v8ClientDirect')&&(flag(s,'ddDeep')||flag(s,'nextReady')),'你保留了直接客户接口，并完成本轮可用的当地服务能力核查。','一家经过初步核对的本地服务商希望接手部分工作。华东现在有客户接口，可以认真比较人员、响应和退出成本。新渠道不是点一下就能代替全部团队，你可以逐步试用，也可以维持现有合作。',s=>flag(s,'v8ExitRecorded')||controlled(s),'交付和权限清单清楚，服务交接更容易限定范围。',[
 Q('replace','先试交接一部分，再决定换伙伴',2,'限定试交接范围，客户持续支持另作安排。',{v8ExitChosen:true,v8SecondProvider:true},{duration:1}),
 Q('dual','保留新智链，增加备用服务渠道',2,'扩大选择余地，也承担两家协调成本。',{v8SecondProvider:true,control:2,trust:-1},{duration:1}),
 Q('stay','维持现有合作，留好新联系人',0,'本次不切换团队，替代选择记录在案。',{v8ProviderOptionSaved:true})]);
add(49,'另一座东盟港口发来邀请','market','market','future',s=>delivered(s)&&(flag(s,'trained')||flag(s,'quality')||flag(s,'nextReady')),'你已稳定交付，并准备了支持后续市场的能力。','区域客户看过首站案例，希望把产品带到另一个市场。新国家、新设备和本地支持还需要验证，首站成功不能自动替代这些工作。你要决定先查什么、只承诺多大的试点，以及是否值得现在投入人手。',s=>flag(s,'nextReady'),'下一市场调查已有部分可复用材料，但仍需核对实际范围。',[
 Q('validate','先验证下一市场，暂不承诺全面上线',2,'按真实客户和设备核对进入条件，询价不变成收入。',{v8RegionalInquiry:true},{duration:1,defenseDiscount:1}),
 Q('conditional','提出附条件的小试点',1,'把范围、支持和前置核查写入报价，尚未直接收款。',{v8RegionalPilotOffer:true,trust:1}),
 Q('wide','承诺多个市场同时上线',0,'机会显得更大，现有支持不能自动覆盖全部承诺。',{v8RegionalOverpromise:true,overpromise:true},{later:{days:1,text:'区域客户要求多地支持清单，现有人手还没有对应部署。',fx:{reputation:-3}}})]);
add(50,'董事会愿意听一次有依据的追加申请','finance','finance','value',s=>s.cash<20&&!!s.contract&&!flag(s,'v8ChairInjectionUsed')&&!s.v8Finance?.chairmanUsed&&!s.chairmanAid?.used,'现金低于20万元，已有合同回款依据，且尚未使用董事长的一次追加机会。','财务把短期缺口、已签合同和下一笔回款条件摆到一起。董事会愿意讨论一次有上限的追加，但不会仅凭一句市场很大就不断填钱。你要说明这笔钱用在哪、等哪笔款，以及哪些投入可以先缩小。',s=>flag(s,'paymentMilestones'),'付款条件和用途已经列清，申请依据更完整。',[
 Q('apply','按证据申请一次10万元追加',0,'核对用途与回款后才入账，本次会占用唯一追加机会。',{v8ChairApplication:true},{duration:1,receipt:10,injection:true,requires:s=>!!s.contract&&!flag(s,'v8ChairInjectionUsed')&&!s.v8Finance?.chairmanUsed&&!s.chairmanAid?.used}),
 Q('shrink','先缩小新投入，保留追加机会',0,'不立即增加现金，团队按已有合同重新安排投入。',{v8CashConserved:true}),
 Q('collect','优先核对能催收的既有款项',1,'财务整理真实付款节点，催收动作本身不直接变成到账。',{v8CollectionsReviewed:true})]);

function init(s){s.flags=s.flags||{};s.events=s.events||[];s.jobs=s.jobs||[];s.reports=s.reports||{};s.messages=s.messages||[];s.ledger=s.ledger||[];s.log=s.log||[];s.topics=s.topics||[];s.business=s.business||{income:0,cost:0,receipts:[],windows:[]};s.business.receipts=s.business.receipts||[];s.v8Events=s.v8Events||{version:1,slots:[],rng:(Number(s.seed)>>>0)||72317,seen:[],followups:[],receipts:[],emptySlots:[]};s.v8Events.emptySlots=s.v8Events.emptySlots||[];return s.v8Events;}
function apply(s,fx){for(const [k,v]of Object.entries(fx||{})){if(['trust','control','reputation'].includes(k))s[k]=Math.max(0,Math.min(100,Number(s[k]||0)+v));else s.flags[k]=v;}}
function log(s,title,text,delta={}){s.log.push({day:s.day,phase:s.phase,title,text,delta});}
function say(s,d,title,text,id){s.messages.push({id:'m'+s.messages.length,day:s.day,person:d.person,title,text,kind:'event',ref:id,read:false});}
function cash(s,n,why){n=round(n);s.cash=round(s.cash+n);s.ledger.push({day:s.day,amount:n,why});}
function reputationFailure(s){if(s.reputation>0||s.ending)return;s.flags.v8ReputationFailed=true;s.ending={id:'reputation-zero',title:'海外扩张失败：商誉耗尽',summary:'公开问题和回应损失让本轮商誉降到0，客户与渠道不再支持继续扩张。',future:'停止本轮海外扩张，保留国内业务。复盘已记录每次公开事件的回应、期限和扣分。',scene:'hq',day:s.day,cash:s.cash,unresolved:['公司商誉已降到0'],evidence:s.events.filter(e=>e.v8&&e.public&&(e.expiryApplied||e.choice)).map(e=>C.eventById[e.id].title+'：'+(e.result||'逾期未回复'))};}
function rng(v){let x=v.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;v.rng=x>>>0;return v.rng;}
function candidates(s){init(s);return pool.filter(d=>!s.v8Events.seen.includes(d.id)&&!s.events.some(e=>e.id===d.id)&&d.when(s));}
function opening(s,d){const v=init(s),defended=!!d.defense?.(s),e={id:d.id,v8:true,day:s.day,due:Math.min(DAY_LAST,s.day+d.responseDays),status:'open',read:false,public:d.public,group:d.group,defended,source:d.source,sourceActionCount:(s.actions||[]).length,sourceFlags:JSON.parse(JSON.stringify(s.flags)),fact:d.fact+(defended?' '+d.defenseText:''),deadlineNotice:true};s.events.push(e);v.seen.push(d.id);v.slots.push({day:s.day,event:d.id,kind:'new',source:d.source});say(s,d,d.title,e.fact+' 请在第'+e.due+'天结束前回应；'+(d.public?'逾期商誉扣'+(d.expiryPenalty||8)+'分。':'期限内可直接在待办中选择。'),e.id);log(s,'收到新情况',d.title+'，第'+e.due+'天结束前回应。');return e;}
function plannedStart(s,o){const jobs=s.jobs.filter(j=>active(j)&&j.dept===o.dept);return {jobs,start:Math.max(s.day,...jobs.map(j=>j.due))};}
function options(s,e){if(!e||!['open','report'].includes(e.status))return [];const d=C.eventById[e.id];if(!d?.v8)return null;return d.options.map(raw=>{const o={...raw,fx:{...raw.fx},later:raw.later?{...raw.later,fx:{...raw.later.fx}}:undefined};if(e.id==='v8e34'&&!e.defended&&flag(s,'v8CoreCopies')&&flag(s,'v8AdminOpen')){if(o.id==='delete'){o.desc='只要求删除本机文件；此前已交过核心副本并开放管理员，外部副本和客户影响仍未核对。';o.thought={good:'先发出删除要求，眼前不追加费用。',bad:'两次开放已经扩大了接触范围；只删本机可能漏掉外部副本，并影响客户是否继续合作。'};o.later={days:1,text:'客户送来的竞争方案附有本轮核心版本的内部验证输出，研发与已保存的交付版本比对一致。访问记录也确认核心副本外传，竞争报价已影响本轮客户选择。'+(signed(s)?'客户随后书面终止尚未完成的合作范围。':'客户书面撤回了本轮采购讨论。'),fx:{coreLeaked:true,coreCommercialDamage:true,customerTerminated:signed(s),v8DisputeOpen:true,reputation:-5}};}else{o.fx={...o.fx,coreLeaked:true,v8LeakContained:true,v8TransferUnverified:false};o.later={days:1,text:'设备与交付记录核对确认核心副本曾外传。团队限制了继续访问，并与客户确认补救和交付范围；客户保留本轮合作，没有出现已确认的竞争订单损失。外部副本仍要逐项跟进。',fx:{}};}}const q=plannedStart(s,o);o.cost=Math.max(0,o.cost-(e.defended?(o.defenseDiscount||0):0));o.expected=o.receipt||0;o.ap=o.slots??1;const conflicts=o.injection&&(flag(s,'v8ChairInjectionUsed')||s.v8Finance?.chairmanUsed||s.chairmanAid?.used||s.v8Events?.followups.some(f=>f.injection));o.disabled=!!(o.duration&&(q.jobs.length>=2||q.start+o.duration>DAY_LAST))||!!conflicts;const reservedDays=new Set((s.v8Events?.followups||[]).filter(f=>!f.completed).map(f=>f.scheduledDay));o.due=q.start+(o.duration||o.later?.days||0);while(o.due<=DAY_LAST&&reservedDays.has(o.due)&&o.due>s.day)o.due++;if(o.duration&&o.due>DAY_LAST)o.disabled=true;o.reason=conflicts?'董事长追加机会已经使用或已有申请。':q.jobs.length>=2&&o.duration?'该部门已有一项执行和一项排队工作。':o.duration&&o.due>DAY_LAST?'本轮剩余日期不够完成并核对这项约定。':'';return o;});}
function spend(s,n){if(!n)return;if(s.phase==='night'){if(s.nightUsed)throw Error('今晚的审批已经使用，可以先保存来信，明天回应。');s.nightUsed=true;return;}if(s.slots<n)throw Error('今天行动不足，请留到下一个可用处理时段。');s.slots-=n;if(!s.slots){s.phase='night';s.place=s.city==='suzhou'?'home':'apartment';s.nightUsed=false;}}
function reserveFollowup(s,e,d,o){const v=init(s),days=o.duration||o.later?.days||0;if(!days)return;const p=plannedStart(s,o);let due=p.start+days;while(v.followups.some(f=>!f.completed&&f.scheduledDay===due))due++;const f={id:e.id+'-followup',event:e.id,choice:o.id,due:Math.min(DAY_LAST,due),scheduledDay:due,fx:{...(o.duration?o.fx:{}),...(o.later?.fx||{})},text:o.later?.text||o.desc,receipt:o.receipt||0,advance:!!o.advance,injection:!!o.injection,requires:!!o.requires,sourceDay:s.day,completed:false,epilogue:due>DAY_LAST};v.followups.push(f);if(o.duration){const j={id:'j'+s.jobs.length,task:'event:'+e.id,choice:o.id,fx:{},data:{v8Event:e.id},dept:o.dept,start:p.start,due, status:p.start>s.day?'queued':'running'};s.jobs.push(j);f.job=j.id;e.status=o.receipt?'settling':'working';e.payDay=due;e.workDay=due;e.expected=o.receipt||0;}e.followupDay=due;e.result=o.desc+' '+(f.epilogue?'后续发生在本轮结束后，会写入后日谈，不提前结算。':'预计第'+due+'天带回后续记录，占当天事件名额。');}
function resolve(s,a){const e=s.events?.find(e=>e.id===a.id),d=C.eventById[a.id];if(!e||!d?.v8)return false;init(s);if(s.ending)throw Error('本轮已经结束，不能继续提交决定。');if(!['open','report'].includes(e.status))throw Error('这件事已经提交，不能重复结算。');if(s.day>e.due)throw Error('这件事的回复期限已过。');const o=options(s,e).find(o=>o.id===a.option);if(!o||o.disabled)throw Error(o?.reason||'请选择本次可执行的处理。');if(s.cash<o.cost)throw Error('专项资金不足，请选择费用可承担的方案。');if(o.requires&&!o.requires(s))throw Error('这项约定所需的交付或付款条件已经变化，请选择其他方案。');if((o.slots??1)>0&&(s.phase==='night'&&s.nightUsed||s.phase==='day'&&s.slots<(o.slots??1)))throw Error(s.phase==='night'?'今晚的审批已经使用，可以明天回应。':'今天行动不足，请下个白天回应。');const before={cash:s.cash,reputation:s.reputation,trust:s.trust,control:s.control};cash(s,-o.cost,'事件决定：'+d.title);s.business.cost=round((s.business.cost||0)+o.cost);if(!o.duration)apply(s,o.fx);e.choice=o.id;e.optionLabel=o.label;e.status='resolved';e.resolvedDay=s.day;e.read=true;e.result=o.desc;e.publicAnswered=!!d.public;e.salesSignal=o.sales||0;e.cost=o.cost;e.outcome={label:o.label,immediate:o.desc,delayed:o.later?.text||null,cash:-o.cost,trust:s.trust-before.trust,reputation:s.reputation-before.reputation,control:s.control-before.control,sales:o.sales||0};if(o.advance)e.expectedAdvance=o.receipt;reserveFollowup(s,e,d,o);if(o.injection){s.chairmanAid=s.chairmanAid||{used:false,applications:[]};s.chairmanAid.used=true;s.chairmanAid.reservationEvent=e.id;s.chairmanAid.applications.push({day:s.day,event:e.id,requested:o.receipt,approved:o.receipt,decision:'approved-pending-verification',evidence:'本局正式合同',purpose:'合同交付与短期周转',status:'pending'});s.flags.v8ChairInjectionUsed=true;s.v8Finance=s.v8Finance||{};s.v8Finance.chairmanUsed=true;}publicMarket(s,d,e,'decision',s.reputation-before.reputation);if(!s.topics.includes(d.topic))s.topics.push(d.topic);log(s,'董事长处理来信',d.title+'：'+o.label+'。'+e.result,{cash:round(s.cash-before.cash),trust:s.trust-before.trust,reputation:s.reputation-before.reputation});s.reports['event-'+e.id]={id:'event-'+e.id,title:d.title,day:s.day,read:false,topics:[d.topic],v8:true,event:e.id,lines:[e.result],summary:e.result};say(s,d,'这次决定已记录',e.result,e.id);spend(s,o.slots??1);reputationFailure(s);return true;}
function settle(s,f){const e=s.events.find(e=>e.id===f.event),d=C.eventById[f.event],o=d?.options.find(o=>o.id===f.choice);if(!e||!d||!o||f.completed)return false;f.completed=true;f.completedDay=s.day;const j=s.jobs.find(j=>j.id===f.job);if(j)j.status='done';const beforeReputation=s.reputation;const valid=f.injection?(s.chairmanAid?.reservationEvent===e.id):(!o.requires||o.requires(s));if(valid)apply(s,f.fx);let amount=0;if(f.receipt&&valid){amount=f.receipt;if(f.advance){const remaining=Math.max(0,round(45-(s.flags.earlyPay?10:0)-(s.flags.v8AdvanceReceived||0)));amount=Math.min(amount,remaining);s.flags.v8AdvanceReceived=round((s.flags.v8AdvanceReceived||0)+amount);}if(f.injection){s.flags.v8ChairInjectionUsed=true;s.v8Finance=s.v8Finance||{};s.v8Finance.chairmanUsed=true;const app=s.chairmanAid?.applications.find(a=>a.event===e.id);if(app){app.status='paid';app.paidDay=s.day;}}cash(s,amount,(f.injection?'董事长追加到账：':f.advance?'原阶段款提前到账：':'完成约定后回款：')+d.title);if(!f.injection&&!f.advance){s.business.income=round((s.business.income||0)+amount);s.business.receipts.push({event:e.id,day:s.day,amount,label:d.title});}s.v8Events.receipts.push({event:e.id,day:s.day,amount,kind:f.injection?'injection':f.advance?'advance':'service'});if(e.id==='v8e45'&&amount){s.flags.partnerRaisedOffer=true;s.flags.partnerExtraInvestment=round((s.flags.partnerExtraInvestment||0)+amount);}}if(valid&&f.fx.coreLeaked)e.evidence=[{day:s.day,type:'transfer-confirmed',source:'本轮设备、访问与交付版本核对',text:'核心副本外传已由本轮记录核对。'},...(f.fx.coreCommercialDamage?[{day:s.day,type:'customer-loss-confirmed',source:'客户书面通知与竞争方案比对',text:f.fx.customerTerminated?'客户书面终止尚未完成的合作范围。':'客户书面撤回本轮采购讨论。'}]:[])];e.received=amount;e.status=valid?'resolved':'failed';e.result=f.text+(f.receipt?(valid?' 约定条件已核对，本次实际到账'+amount+'万元。':' 当前交付条件未满足，本次没有到账。'):' 后续记录已送达。');if(f.advance&&amount)e.result+=' 这属于原合同款，后续阶段结算应扣除相同金额。';s.reports['event-'+e.id]={id:'event-'+e.id,title:d.title+' · 后续结果',day:s.day,read:false,topics:[d.topic],v8:true,event:e.id,lines:[e.result],summary:e.result};say(s,d,'后续结果已送达',e.result,e.id);log(s,'事件后续已完成',d.title+'：'+e.result,{cash:amount});publicMarket(s,d,e,'followup',s.reputation-beforeReputation);s.v8Events.slots.push({day:s.day,event:e.id,kind:'followup',source:'第'+f.sourceDay+'天已提交的'+e.optionLabel});reputationFailure(s);return true;}
function publicMarket(s,d,e,stage,delta){if(!d.public||!delta||!s.market)return;e.marketSignals=e.marketSignals||[];if(e.marketSignals.includes(stage))return;const factor=Math.max(-.05,Math.min(.05,delta*.003));if(root.HDExpansion?.marketMove)root.HDExpansion.marketMove(s,factor,'公开事件：'+d.title+'，'+({decision:'董事长回应',expired:'未按期回应',followup:'后续结果'}[stage]||'已核对进展'));else{s.market.previous=s.market.price;s.market.price=round(Math.max(2.5,Math.min(35,s.market.price*(1+factor))));s.market.history=s.market.history||[];s.market.history.push({day:s.day,price:s.market.price,reason:'公开事件：'+d.title});}e.marketSignals.push(stage);}
function promote(s){for(const j of s.jobs){if(!j.data?.v8Event||j.status!=='queued'||j.start>s.day)continue;if(s.jobs.some(x=>x.id!==j.id&&x.dept===j.dept&&x.status==='running'))continue;const duration=j.due-j.start;if(j.start<s.day){j.start=s.day;j.due=s.day+duration;const f=s.v8Events.followups.find(f=>f.job===j.id&&!f.completed);if(f){f.scheduledDay=j.due;f.due=j.due;f.epilogue=j.due>DAY_LAST;const e=s.events.find(e=>e.id===f.event);if(e){e.followupDay=j.due;e.payDay=j.due;e.workDay=j.due;}}}j.status='running';}}
function tick(s,previous,action){if(s.version<8&&!s.v8Events)return s;const v=init(s);for(const e of s.events){if(!e.v8)continue;if(['open','report'].includes(e.status)&&s.day>e.due&&!e.expiryApplied){e.expiryApplied=true;e.status='expired';const d=C.eventById[e.id],penalty=d?.public?(d.expiryPenalty||8):0;apply(s,{reputation:-penalty});publicMarket(s,d,e,'expired',-penalty);e.result=penalty?'第'+e.due+'天结束前没有回应，公开疑问持续，商誉扣'+penalty+'分。':'本次回复窗口已过，没有额外现金或商誉扣分。';log(s,'来信超过回复期限',d.title+'：'+e.result,{reputation:-penalty});say(s,d,'本次回复已逾期',e.result,e.id);}}
 reputationFailure(s);if(s.ending||s.day<6||s.day>DAY_LAST)return s;promote(s);
 const current=v.slots.find(x=>x.day===s.day),follow=v.followups.filter(f=>!f.completed&&!f.epilogue&&f.scheduledDay<=s.day).sort((a,b)=>a.scheduledDay-b.scheduledDay||a.sourceDay-b.sourceDay)[0];
 if(follow&&(!current||current.event===follow.event&&current.kind==='followup-pending')){const j=s.jobs.find(j=>j.id===follow.job);if(!current)v.slots.push({day:s.day,event:follow.event,kind:'followup-pending',source:'第'+follow.sourceDay+'天已提交决定的后续，今天等待实际完成记录。'});if(s.phase==='night'&&(!j||j.status==='running'&&j.due<=s.day)){const n=v.slots.findIndex(x=>x.day===s.day);v.slots.splice(n,1);settle(s,follow);}return s;}
 if(current)return s;const list=candidates(s);const feasible=list.filter(d=>s.day<DAY_LAST||d.options.some(o=>!o.duration));if(!feasible.length){if(!v.emptySlots.some(x=>x.day===s.day))v.emptySlots.push({day:s.day,reason:'当前没有满足真实前置条件的新事件，也没有到期后续。'});return s;}const d=feasible[rng(v)%feasible.length];opening(s,d);return s;
}
function cancelJob(s,j){if(!j?.data?.v8Event)return false;init(s);const f=s.v8Events.followups.find(f=>f.job===j.id&&!f.completed);if(f){f.completed=true;f.cancelled=true;f.completedDay=s.day;}const e=s.events.find(e=>e.id===j.data.v8Event);if(e){e.status='cancelled';e.expected=0;e.result='尚未开工的后续已撤回，前期费用不退，本次预计回款取消。';const slot=s.v8Events.slots.find(x=>x.day===s.day&&x.event===e.id&&x.kind==='followup-pending');if(slot)slot.kind='followup-cancelled';}return true;}
function rescheduleJob(s,j,newStart){if(!j?.data?.v8Event)return false;const f=init(s).followups.find(f=>f.job===j.id&&!f.completed);if(!f)throw Error('这项后续已经完成或取消，不能再改排期。');const duration=j.due-j.start,start=Number(newStart),running=s.jobs.find(x=>x.dept===j.dept&&x.id!==j.id&&x.status==='running');if(j.status!=='queued'||!Number.isInteger(start)||start<Math.max(s.day,running?.due||s.day))throw Error('请在当前执行工作之后安排尚未开工的任务。');let scheduled=start+duration;while(s.v8Events.followups.some(x=>x!==f&&!x.completed&&!x.epilogue&&x.scheduledDay===scheduled))scheduled++;if(scheduled>DAY_LAST)throw Error('调整后没有本轮可用的后续核对日期，请改短方案或撤回。');j.start=start;j.due=start+duration;f.due=j.due;f.scheduledDay=scheduled;f.epilogue=false;const e=s.events.find(e=>e.id===f.event);if(e){e.followupDay=scheduled;e.workDay=j.due;e.payDay=scheduled;e.result='后续已改为第'+start+'天开始，第'+scheduled+'天核对结果；尚未计入现金。';}return true;}
function finalizeUnresolved(s){if(s.day!==DAY_LAST||s.phase!=='night')throw Error('只有第25天夜间才能把未处理事项计入最终复盘。');init(s);for(const e of s.events){if(!e.v8||!['open','report'].includes(e.status)||e.expiryApplied)continue;const d=C.eventById[e.id],penalty=d.public?(d.expiryPenalty||8):0;e.status='expired';e.expiryApplied=true;e.finalUnresolved=true;apply(s,{reputation:-penalty});publicMarket(s,d,e,'expired',-penalty);e.result='第25天夜间决定不再处理这项来信，保留为未解决事项。'+(penalty?'已按事先说明的公开影响扣商誉'+penalty+'分。':'未取得这次机会的后续收益。');log(s,'未处理事项进入最终复盘',d.title+'：'+e.result,{reputation:-penalty});s.reports['event-'+e.id]={id:'event-'+e.id,title:d.title+' · 最终未决',day:s.day,read:false,topics:[d.topic],v8:true,event:e.id,summary:e.result,lines:[e.result]};say(s,d,'这项未决已记录',e.result,e.id);}reputationFailure(s);return s;}
function hydrate(s){init(s);return s;}
C.events=pool;C.eventById={...(C.eventById||{}),...Object.fromEntries(pool.map(d=>[d.id,d]))};
root.HDV8Events={pool,init,hydrate,tick,resolve,options,candidates,reputationFailure,cancelJob,rescheduleJob,finalizeUnresolved};
if(typeof module!=='undefined')module.exports=root.HDV8Events;
})(typeof globalThis!=='undefined'?globalThis:window);
