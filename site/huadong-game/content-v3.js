/* Huadong v2. Fictional scenario values; course references are separately identified. */
(function(root){
'use strict';
const C={version:3,title:'华东智行 · 出海决策室',days:14};
C.people={
 chair:{name:'周启明',role:'董事长',sheet:'people-a',col:0,line:'增长需要证据。告诉我，你准备拿什么换来下一站。'},
 secretary:{name:'许知微',role:'CEO秘书',sheet:'people-a',col:1,line:'我把各部门的进度整理好了。我们先看眼下最重要的一件事。'},
 market:{name:'林悦',role:'市场负责人',sheet:'people-a',col:2,line:'客户买的是稳定运行。我们要知道，他们真正愿意为什么付钱。'},
 legal:{name:'沈律师',role:'法务与知识产权',sheet:'people-a',col:3,line:'证书、能用、有权许可，是不同的问题。先把范围和证据说清楚。'},
 finance:{name:'周岚',role:'财务负责人',sheet:'people-a',col:4,line:'签下订单和钱到账之间，还有一段路。预留周转资金。'},
 hr:{name:'唐宁',role:'人力资源负责人',sheet:'people-b',col:0,line:'任务最终由人完成。人员承诺、开发记录和离职交接都不能落空。'},
 hardware:{name:'顾衡',role:'深圳研发负责人',sheet:'people-b',col:1,line:'替代方案可以做，但性能和验证时间要一起摆上桌。'},
 algorithm:{name:'叶澄',role:'成都研发负责人',sheet:'people-b',col:2,line:'接口、运行版和核心实现可以分开。开放的每一层都应有目的。'},
 partner:{name:'陈文杰',role:'新智链负责人',sheet:'people-b',col:3,line:'我们可以投入当地团队，也需要看到回报与持续经营的空间。'},
 client:{name:'Anita',role:'港口项目负责人',sheet:'people-b',col:4,line:'先兑现你们承诺的功能。可验证的交付，比漂亮的演示重要。'}
};
C.cities={suzhou:{name:'苏州',sub:'总部 · 中国',lon:120.585,lat:31.299,scene:'hq'},shenzhen:{name:'深圳',sub:'硬件研发 · 中国',lon:114.058,lat:22.543,scene:'shenzhen'},chengdu:{name:'成都',sub:'算法研发 · 中国',lon:104.066,lat:30.573,scene:'chengdu'},singapore:{name:'新加坡',sub:'伙伴与客户 · 东盟',lon:103.82,lat:1.35,scene:'partner'},malaysia:{name:'吉隆坡',sub:'下一市场 · 马来西亚',lon:101.69,lat:3.14,scene:'malaysia'},japan:{name:'东京',sub:'已有业务 · 日本',lon:139.69,lat:35.68,scene:'hq',context:true}};
C.places={
 hq:{name:'苏州总部',city:'suzhou',scene:'hq',person:'secretary',desc:'董事会与四个部门，共同负责这次出海。'},
 board:{name:'董事会会议室',city:'suzhou',scene:'board',person:'chair',desc:'确定战略、资源和重大合作承诺。',x:57,y:24},
 market:{name:'市场部',city:'suzhou',scene:'market',person:'market',desc:'客户需求、竞争情报、品牌和渠道。',x:35,y:50},
 legal:{name:'法务资料室',city:'suzhou',scene:'legal',person:'legal',desc:'审计、权利状态、FTO、合同与争议。',x:53,y:53},
 finance:{name:'财务部',city:'suzhou',scene:'finance',person:'finance',desc:'现金、估值、付款与经营收益。',x:70,y:55},
 hr:{name:'人力资源部',city:'suzhou',scene:'hr',person:'hr',desc:'派驻、外包、成果约定与交接。',x:63,y:78},
 hardware:{name:'深圳测试区',city:'shenzhen',scene:'shenzhen',person:'hardware',desc:'网关测试、技术披露和替代方案。'},
 algorithm:{name:'成都算法中心',city:'chengdu',scene:'chengdu',person:'algorithm',desc:'核心代码、模型、接口与受控协作。'},
 partner:{name:'新智链会议室',city:'singapore',scene:'partner',person:'partner',desc:'合作架构、技术清单和条件谈判。'},
 dataroom:{name:'伙伴资料室',city:'singapore',scene:'dataroom',person:'legal',desc:'查证伙伴技术、人员与既有承诺。'},
 port:{name:'港口项目现场',city:'singapore',scene:'port',person:'client',desc:'限定演示、实际版本检查和阶段验收。'},
 regional:{name:'区域交付办公室',city:'malaysia',scene:'malaysia',person:'market',desc:'当地调查、伙伴培训和下一站启动。'},
 home:{name:'家中书房',city:'suzhou',scene:'home',person:'secretary',desc:'复盘今天，安排明天。'},
 apartment:{name:'出差住处',city:'singapore',scene:'apartment',person:'secretary',desc:'夜间通过电脑与手机处理事务。'}
};
C.topics=[
 ['capital','知识资产与多重保护','第一课 7—11页','技术、人才经验、代码和商业秘密的保护方式不同；一项产品可能依靠多种资产共同创造价值。'],
 ['future','技术融合与未来选择','第一课 12—18页','技术依赖、全球化与非实施主体改变经营环境；储备技术应结合未来使用机会。'],
 ['coord','商业、法律与技术协同','第一课 20—25页','保护、渠道、客户关系与先行优势共同服务于同一业务目标。'],
 ['levels','五级价值层级','第一课 27—34页','巩固立场、管理成本、实现价值、整合机遇、塑造未来；这是管理框架，不是必须升满的分数条。'],
 ['make','自研、采购与商业化','第二课 6—15页','开发、采购、出售、独占与非独占许可应比较能力、投入、持续收益与自主空间。'],
 ['value','知识产权估值','第二课 17—23页','成本法看重建或替代成本；市场法看可比交易；收益法看未来收益及假设。估值是区间而非保证成交价。'],
 ['brand','品牌利益与架构','第二课 24—29页；第三课 4页','把技术特征转为客户功能利益与信任，选择品牌架构和业务组合。'],
 ['invent','发明披露与筛选','第三课 5—12页','新颖性线索、技术价值、使用可能性、规避难度和可检测性影响投入优先级。'],
 ['audit','审计与资产优先级','第三课 13—22页','通用型、特定事件型和有限用途审计服务于不同目标；核查、判断和整改是不同动作。'],
 ['dd','尽职调查三阶段','第四课 4—12页','理解交易后识别、调查、评估资产及负担；发现问题可能改变价格、交易条件或是否继续。'],
 ['licensing','引进、对外及交叉许可','第四课 13—17页','许可对象、地域、用途、期限、费用及新成果分别安排；交叉许可需要对方确实需要的有效筹码。'],
 ['franchise','特许经营与服务复制','第四课 18—20页','品牌与技术授权、完整服务体系具有不同管理要求；培训、运营手册、质量监督支持持续复制。'],
 ['case','统一目标与合作形式','作业 3—5页','苏州总部、深圳与成都研发中心、新加坡新智链；比较联合开发、技术联盟、区域合资和股权投资，说明取舍。'],
 ['fto','自由实施与专利丛林','扩展：WIPO FTO','结合国家、实际产品、法律状态和权利要求。自己的专利不等于自由实施，检索没有永久安全保证。'],
 ['data','数据与交付边界','扩展：数据处理与许可','客户原始数据不随技术许可自动转让。功能、字段、访问与跨境安排改变时需要更新评估。']
];
C.sources=[['MIP503课程及作业','用户提供的四份课件、GBA和Q1(a)文档；第四课为1—20页版本。场景、人物、金额与时限是教学改编。',''],['自由实施分析','WIPO：IP and Business — Freedom to Operate','https://www.wipo.int/en/web/wipo-magazine/articles/ip-and-business-launching-a-new-product-freedom-to-operate-34956'],['技术转移与协议','WIPO：Technology Transfer Agreements','https://www.wipo.int/en/web/technology-transfer/agreements'],['数据处理','新加坡PDPC：Key Concepts Guidelines','https://www.pdpc.gov.sg/guidelines-and-consultation/2020/03/advisory-guidelines-on-key-concepts-in-the-personal-data-protection-act'],['地图','Natural Earth 公共领域地理数据；边界为概略业务示意。','https://www.naturalearthdata.com/about/terms-of-use/']];
C.assets=[
 {id:'patent',name:'车路协同专利组合',kind:'发明／实用新型',need:'网关同步与传感',clue:'P-01新加坡授权维护节点临近；旧方案有早期展会公开线索。中国权利不自动覆盖海外。'},
 {id:'code',name:'工业物联网平台',kind:'运行版与代码',need:'现场运行',clue:'适配模块存在外包开发部分，旧合同未写清再许可范围。'},
 {id:'secret',name:'算法与模型实现',kind:'商业秘密',need:'预测维护优势',clue:'共享账户不能区分人员；接口与核心实现可分层提供。'},
 {id:'brand',name:'HUADONG INTELLILINK',kind:'商标与品牌',need:'客户识别与信任',clue:'当地可用性及类别待核实，品牌投入须结合客户价值。'},
 {id:'design',name:'工业界面与图标',kind:'外观设计／著作权',need:'现场识别与体验',clue:'员工和设计供应商的成果记录需要匹配实际交付版本。'},
 {id:'domain',name:'.cn / .com / .sg域名',kind:'账户与域名',need:'客户入口',clue:'.sg续费提醒留在销售个人账户，需明确公司管理。'},
 {id:'component',name:'第三方连接组件',kind:'引进许可',need:'设备兼容',clue:'组件清单有版本缺项；不同许可证的交付义务需要分别查清。'},
 {id:'data',name:'设备数据与标签',kind:'数据使用安排',need:'模型验证',clue:'设备记录可能增加司机字段；原始客户数据需要单独安排。'},
 {id:'people',name:'工程师经验与文档',kind:'智力资本',need:'连续交付',clue:'关键适配知识集中在两名工程师，交接文档不完整。'},
 {id:'pricing',name:'定价模型与客户方案',kind:'商业秘密',need:'议价与客户关系',clue:'实施方案和报价表的访问权限需要区分。'}
];
C.licenseAssets=[
 ['patent','P-01网关实施方案','专利实施','限公司有权许可的地域与范围。'],['runtime','平台运行版','软件使用','本地网关运行；不自动提供源码。'],['api','预测维护接口','接口调用','核心保留在华东，需持续支持。'],['adapt','本地适配模块','限定修改','增强伙伴排障能力，先核实外包许可链。'],['core','平台核心源码','核心开放','可增加伙伴自主交付，也扩大技术接触。'],['weights','模型权重与训练资料','技术资料','有利调优；原始客户数据不包括在内。'],['brand','商标与项目物料','品牌使用','约定用途、质量与结束后的使用。'],['design','界面与图标','设计使用','按项目使用，核查成果及海外保护。'],['domain','当地域名入口','账户管理','明确公司持有与合作结束后的控制。']
];
C.meeting=[['market','客户计划在第9天演示、第11天阶段验收。网关稳定与响应速度是谈判重点。'],['hardware','成熟产品可以做限定试点；不同部署方式需要安排测试，不能把新功能直接承诺上线。'],['legal','先明确实际业务范围，核查自有资产与第三方权利。合作调查可以与客户工作并行。'],['finance','董事会提供180万元专项额度。原始报价160万元，预付款比例要谈；收入与到账不能混在一起。'],['hr','研发和交付人手可以调动，但每个部门只能承担一项主要工作。'],['chair','请选择这次的增长方向。允许附条件推进，也允许有依据地收缩。']];
const O=(id,label,desc,cost=0,fx={},extra={})=>({id,label,desc,cost,fx,...extra});
const T=(id,title,place,brief,options,extra={})=>({id,title,place,person:C.places[place].person,brief,options,needs:['strategy'],slots:1,topics:[],...extra});
C.tasks=[
 T('strategy','召开海外战略会','board','一份港口邀约已经送到苏州。先听各部门的依据，再确定主线目标。',[
 O('direct','自主交付优先','拿到标杆客户，保留客户与核心；华东需要更多现场人手。',4,{route:'direct',trust:-1}),O('partner','与伙伴共同扩张','用本地能力争取规模，重点治理投入和成果。',4,{route:'partner',trust:3}),O('network','许可与服务网络','让技术与服务标准产生持续收入，重视培训和核查。',4,{route:'network',trust:1})],{needs:[],topics:['case','coord','levels'],intro:true}),
 T('customer','核实客户真正需要什么','market','市场部可以向客户确认采购重点、付款和变更边界。',[
 O('interview','访谈与采购核对','1天后得到需求和竞争线索，为谈判补充依据。',4,{customer:true},{duration:1,dept:'market'}),O('quick','只核对功能清单','成本低，暂不深入采购偏好与竞争信息。',1,{customerBasic:true},{duration:1,dept:'market'})],{remote:true,topics:['brand','coord'],report:'customer'}),
 T('assets','排出五项关键资产','legal','从十项资产选出最重要的五项并排序。排序影响审计重点；不代表其他资产自动安全。',[],{type:'assets',topics:['capital','audit','case']}),
 T('audit','安排知识产权审计','legal','根据资产优先级明确核查目标、证据与范围。收到报告后再安排整改。',[
 O('business','围绕本轮业务做通用审计','核对五项优先资产的权属、状态、维护与业务关联，1天。',8,{audited:true},{duration:1,dept:'legal'}),O('wide','扩大到整个资产组合','覆盖十类资料，2天，可能挤占其他法律工作。',15,{audited:true,auditWide:true},{duration:2,dept:'legal'}),O('limited','有限用途核查','先核权利状态与许可链，其他问题仍待查，1天。',5,{auditLimited:true},{duration:1,dept:'legal'})],{needs:['assets'],remote:true,topics:['audit'],report:'audit'}),
 T('ownership','处理权属与维护缺口','legal','审计发现了证据缺项。文件补充、权利维护与稳定性分析不能互相替代。',[
 O('core','先补核心许可链和维护','补外包授权及维护记录；旧权利疑点通过减少依赖处理。',7,{rights:true,patentReady:true,control:5}),O('complete','完成已发现事项的分项整改','再补品牌、设计和组件交付记录，1天后收到证据。',12,{rights:true,patentReady:true,component:true,brandClear:true,control:7},{duration:1,dept:'legal'}),O('narrow','移除权属未明的适配模块','由华东承担接口适配；保留权属缺项，降低本轮依赖。',3,{narrowRights:true,control:2,supportCost:4})],{needs:['@audit'],remote:true,topics:['audit','capital'],report:'ownership'}),
 T('fto','委托FTO与技术依赖调查','legal','明确销售、使用及相关制造地点，再按产品模块比对第三方权利。',[],{type:'fto',remote:true,topics:['fto','future'],report:'fto'}),
 T('ftoresponse','处理报告中的实施障碍','hardware','顾问发现网关同步步骤涉及第三方有效权利。三种应对各有经营代价。',[
 O('license','取得项目许可','费用较高、1天；保留既有性能，许可范围受合同限制。',11,{ftoClear:true,thirdLicense:true},{duration:1,dept:'legal'}),O('around','采用替代同步方案','8万元、2天验证，峰值性能略降，需要与客户协调。',8,{ftoClear:true,around:true},{duration:2,dept:'hardware'}),O('cross','以自有组合争取交叉许可','6万元、2天；须有已核实且对方需要的权利。',6,{ftoClear:true,cross:true},{duration:2,dept:'legal',requireFlag:'patentReady'}),O('hold','限定演示，暂缓相关模块交付','当前不清除障碍；可以继续谈判，验收前再处理或缩小范围。',1,{ftoHeld:true})],{needs:['@fto'],remote:true,topics:['fto','licensing'],report:'ftoresponse'}),
 T('invention','评审三项发明披露','hardware','比较即将用到的网关改进、遥远的新算法和容易绕开的外壳设计。先调查申请可行性，非立即取得专利。',[
 O('gateway','优先核查网关改进','与本次客户需求相关，保留未来交叉许可和产品选择。',5,{invent:true,control:2},{duration:1,dept:'hardware'}),O('algorithm','储备新算法方向','未来许可潜力较大，本轮交付帮助有限。',7,{futureTech:true},{duration:2,dept:'algorithm'}),O('defer','暂缓新增申请投入','把资源留给现有产品；保留披露记录与保密。',1,{disclosure:true})],{remote:true,topics:['invent','future'],report:'invention'}),
 T('makebuy','确定产品与技术来源','hardware','客户需要稳定网关和预测维护。产品架构改变交付、人手与资料开放。',[
 O('hybrid','混合部署，自研关键适配','本地网关＋预测接口，1天完成现有版本验证。',6,{product:'hybrid',tested:true},{duration:1,dept:'hardware'}),O('local','完整本地部署，采购成熟连接器','离线能力强，关注引进授权与更多交付资料，1天。',8,{product:'local',tested:true},{duration:1,dept:'hardware'}),O('cloud','云端为主，缩小现场功能','初期投入低，需华东持续服务，1天。',3,{product:'cloud',tested:true,supportCost:3},{duration:1,dept:'hardware'})],{remote:true,topics:['make','future'],report:'makebuy'}),
 T('secrecy','划分技术与秘密层级','algorithm','把公开接口、可修改模块和核心实现分别列出，避免只按文件夹整包交付。',[
 O('layer','建立分级开放清单','核心实现单独审批，接口与适配可组合许可。',3,{secretMapped:true,control:4}),O('broad','以完整协作为主','提高协作便利，后续必须匹配访问和人员控制。',1,{collaborative:true,control:-2})],{remote:true,topics:['capital','licensing']}),
 T('valuation','给技术交易确定估值依据','finance','研发成本不等于成交价。请选择主要依据，报告会列出假设和局限。',[
 O('income','未来收益与敏感性分析','比较预期使用、许可费与维护成本；预测依赖客户和业务假设。',3,{valuation:true,valueMethod:'income'},{duration:1,dept:'finance'}),O('market','可比交易与范围调整','比较许可地域、独占、成熟度与交易条件，不能照抄价格。',3,{valuation:true,valueMethod:'market'},{duration:1,dept:'finance'}),O('cost','重置成本与技术价值核对','看重建成本，并核对可检测性、规避难度和实际使用价值。',2,{valuation:true,valueMethod:'cost'},{duration:1,dept:'finance'})],{remote:true,topics:['value','make'],report:'valuation'}),
 T('brand','确定客户价值与品牌架构','market','客户的信任不止来自商标。把功能收益转成可兑现的服务承诺。',[
 O('own','自有品牌＋当地服务','积累直接客户关系；需投入宣传与响应能力。',5,{brandClear:true,brandMode:'own',reputation:5},{duration:1,dept:'market'}),O('co','联合品牌与责任分工','利用伙伴当地声誉，同时规定质量与宣传边界。',3,{brandClear:true,brandMode:'co',trust:3},{duration:1,dept:'market'}),O('tech','技术供给品牌','少做面向终端的宣传，把资源放在可核查性能。',2,{brandMode:'tech',brandClear:true},{duration:1,dept:'market'})],{remote:true,topics:['brand'],report:'brand'}),
 T('diligence','调查新智链的交易能力','dataroom','先限定资料用途，再核查技术来源、权利状态、人员、分包与既有承诺。识别、调查、评估各有成果。',[
 O('target','围绕拟议交易尽调','1天，取得关键授权链、状态与人员说明。',7,{diligence:true},{duration:1,dept:'legal'}),O('deep','加强财务和分包核查','2天，增加投入能力和合同负担分析。',11,{diligence:true,ddDeep:true},{duration:2,dept:'legal'})],{remote:true,topics:['dd','case'],report:'diligence'}),
 T('ddresponse','处理尽调揭示的条件','partner','收到的证据应影响对价、承诺和是否继续。材料不符不等于所有技术都不能用。',[
 O('condition','补授权并附先决条件','未取得证明前不交付有关模块，明确责任。',3,{ddFixed:true,trust:1},{duration:1,dept:'legal'}),O('replace','移除伙伴连接器，换替代模块','减少对伙伴权利的依赖，增加适配投入。',6,{ddFixed:true,partnerReplace:true},{duration:1,dept:'hardware'}),O('accept','保留未决事项，压低交易对价','取得商业让步，但权利问题仍未解决。',0,{discount:6,ddAccepted:true,trust:-2})],{needs:['@diligence'],remote:true,topics:['dd','value'],report:'ddresponse'}),
 T('governance','比较四种合作安排','partner','先形成治理方案；合资或股权的主要投入在正式签约时承诺。',[
 O('alliance','技术联盟','灵活、前期轻；双方仍要另定交付与许可责任。',2,{governance:'alliance',governanceCost:3}),O('joint','联合开发协议','按工作包合作；重点安排成果使用与贡献记录。',3,{governance:'joint',governanceCost:6,trust:2}),O('venture','区域性合资公司','独立团队与治理投入较大，适合长期交付。',4,{governance:'venture',governanceCost:18,staff:2,trust:3}),O('equity','股权投资','资本建立联系，技术授权与业务仍须另外落实。',3,{governance:'equity',governanceCost:14,trust:1})],{topics:['case','dd']}),
 T('license','逐项决定技术开放','partner','对方希望独立排障。请选择本轮有业务必要的资产，以及核心是否进入交付范围。',[],{needs:['governance','@makebuy'],type:'license',topics:['licensing','capital']}),
 T('negotiate','提出条件并接收还价','partner','新智链希望获得东盟业务空间。请用许可边界、人员投入和付款条件交换。',[],{needs:['license'],type:'terms',topics:['licensing','value','case']}),
 T('controls','落实技术交付控制','algorithm','合同需要变成人员、权限和可核对记录。部署工作要由团队实际完成。',[
 O('full','分级权限、留痕与分包闭环','保密、最小访问、记录和权限回收，1天；核心开放时仍需持续监督。',9,{controls:true,logs:true,subControl:true,control:7},{duration:1,dept:'algorithm'}),O('basic','保密＋列名访问','投入较少，暂缺完整下载记录和分包核查，1天。',4,{nda:true,basicControl:true,control:2},{duration:1,dept:'algorithm'}),O('none','按现有共享目录交付','速度快，人员边界和可追踪性不足。',0,{looseAccess:true,control:-5})],{remote:true,topics:['capital','licensing'],report:'controls'}),
 T('staff','兑现人员与交接安排','hr','华东工程师可派驻，也可培训伙伴。选择会影响支持能力与人员风险。',[
 O('deploy','派驻与备份交接','两位工程师、成果约定、权限回收及接替文档，1天。',8,{staff:3,hrReady:true},{duration:1,dept:'hr'}),O('train','培训当地团队','依靠伙伴响应，补人员义务和交接，1天。',5,{staff:2,hrReady:true,trained:true,trust:2},{duration:1,dept:'hr'}),O('stretch','现有团队远程兼顾','不新增投入，现场响应能力有限。',1,{staff:1})],{remote:true,topics:['capital','coord'],report:'staff'}),
 T('data','确认数据与功能边界','legal','客户可能加入司机身份字段。技术许可不包括原始客户数据；变更需要重新评估。',[
 O('minimal','限定设备维护数据','本期不加入身份字段，与客户写清变更流程。',3,{dataReady:true,dataMode:'minimal',trust:-1}),O('review','完成扩展数据处理评估','核实目的、责任、访问、安全、保存与跨境安排，1天。',6,{dataReady:true,dataMode:'review'},{duration:1,dept:'legal'}),O('local','先本地处理并核对其他义务','本地存储同时核查用途、权限和保存，1天。',5,{dataReady:true,dataMode:'local'},{duration:1,dept:'legal'})],{remote:true,topics:['data'],report:'data'}),
 T('component','核对最终软件与设计交付','algorithm','实际版本可能不同于早期清单。核对软件组件、界面图标与交付文件。',[
 O('verify','按最终版本核查','补清许可证、设计来源与交付记录，1天。',4,{component:true,designClear:true},{duration:1,dept:'algorithm'}),O('replace','移除未确认组件与物料','功能减少，但避免把未明项目带入本期交付。',3,{component:true,designClear:true,reduced:true})],{remote:true,topics:['capital','audit'],report:'component'}),
 T('demo','向客户展示可运行版本','port','现场演示会把纸面承诺变成客户期待。第9天前演示更有利于采购排期。',[
 O('scoped','展示已验证的限定范围','保持与证据一致；未验证功能标明不属于此次演示。',3,{demo:true,reputation:4}),O('full','演示完整承诺功能','机会更大；若验证不足，后续整改和信任成本增加。',5,{demo:true,demoFull:true,reputation:7}),O('promise','先演示概念，承诺后补','节省准备，留下客户预期与交付差距。',0,{demo:true,overpromise:true,reputation:-1})],{needs:['contract'],topics:['coord','brand']}),
 T('inspection','核验最终版本与客户承诺','port','对照许可、实际模块、人员、数据和验收条件，标明尚未解决的问题。',[
 O('check','核对证据并修正交付记录','形成可查看的验收清单，不自动消除未调查的权利风险。',3,{inspected:true}),O('narrow','先缩小争议功能再验证','维持基本服务，合同金额下调18万元。',5,{inspected:true,deliveryNarrow:true,component:true,dataReady:true})],{needs:['demo'],topics:['audit','data'],report:'inspection'}),
 T('acceptance','申请阶段验收与回款','port','按已经兑现的范围请求客户验收。未决问题会影响金额、时间或是否通过。',[
 O('submit','按当前证据申请验收','系统结合实际产品、实施障碍与合同条件结算。',0,{}),O('settle','协商限定阶段验收','收窄未决部分、下调金额，保留下一阶段机会。',4,{deliveryNarrow:true})],{needs:['inspection'],type:'acceptance',topics:['coord','case']}),
 T('royalty','核对使用量与许可收入','finance','持续收入需要核对部署、使用范围和付款，不能只看伙伴口头数字。',[
 O('verify','建立部署与结算核对','1天，完善收费、审计和异常处理记录。',3,{royalty:true},{duration:1,dept:'finance'}),O('fixed','本期采用固定服务费用','减少核对负担，放弃部分增长收益。',1,{royaltyFixed:true})],{needs:['contract'],remote:true,topics:['licensing','value'],report:'royalty'}),
 T('marketing','把首站经验变成客户关系','market','把实际交付成果转成可信案例，不把未验证性能写进宣传。',[
 O('case','用验收数据做客户案例','形成下一市场线索，1天。',4,{pipeline:true,reputation:6},{duration:1,dept:'market'}),O('channel','联合伙伴推进渠道','开拓速度快，客户接触更多由伙伴掌握。',3,{pipeline:true,trust:4,control:-1},{duration:1,dept:'market'})],{needs:['acceptance'],remote:true,topics:['brand','coord'],report:'marketing'}),
 T('expansion','决定下一市场的进入方式','board','董事会先看首站结果，再批准新的投入。可以继续原路线，也可以有依据地转向。',[
 O('direct','建立自主交付基础','投入当地团队，掌握直接客户关系。',14,{expansion:'direct',staff:2}),O('partner','与新智链共同进入','利用已有合作，核实下一市场承诺。',9,{expansion:'partner',trust:2}),O('license','发展技术许可网络','重点核对使用、收费和当地伙伴能力。',6,{expansion:'license'}),O('franchise','复制完整服务体系','包括品牌、培训、手册与质量监督。',10,{expansion:'franchise'}),O('brand','扩大品牌与技术授权','当地伙伴自行组织交付，仍有质量与边界管理。',6,{expansion:'brand'}),O('hold','巩固新加坡，暂缓下一站','保存资源、完善首站交付；可获得稳健管理评价。',0,{expansion:'hold'})],{needs:['acceptance'],remote:true,topics:['case','franchise','levels']}),
 T('marketcheck','更新下一市场的调查','regional','马来西亚版本新增设备接口。新加坡结论不能直接延伸至新产品、新伙伴与新法域。',[
 O('target','FTO、当地品牌与交付要求','1天，识别并处理本轮模拟的新范围问题。',8,{nextReady:true,brandClear:true},{duration:1,dept:'legal'}),O('fto','只更新实施范围','1天，品牌与当地交付安排仍需补齐。',5,{nextFto:true},{duration:1,dept:'legal'})],{needs:['expansion'],remote:true,topics:['fto','future','brand'],report:'marketcheck'}),
 T('training','建立可复制的服务体系','regional','授权品牌与完整特许经营不同。服务复制需要培训、手册、核查与纠正机制。',[
 O('system','培训、手册和质量审计','1天，形成完整服务标准和持续监督安排。',6,{quality:true,trained:true},{duration:1,dept:'hr'}),O('brand','仅做品牌与技术使用指引','1天，投入较低，服务组织由当地伙伴负责。',3,{brandGuide:true},{duration:1,dept:'market'})],{needs:['contract'],remote:true,topics:['franchise','brand'],report:'training'}),
 T('financing','申请专项周转支持','finance','董事会可提供一次短期周转。它改善现金时点，却不是新增利润。',[
 O('bridge','借入20万元项目周转','项目结束归还22万元，先核实未来回款。',0,{bridge:true}),O('stage','与客户争取阶段预付','需已签合同，提前收到10万元；最终回款相应减少。',0,{earlyPay:true},{requireFlag:'signed'})],{remote:true,night:true,topics:['value','coord']}),
 T('divest','评估非核心技术出售','finance','一项旧接口工具不在本轮核心范围。出售可以回收资金，也放弃后续收益与使用空间。',[
 O('sell','出售旧工具限定资产包','完成权利核对后回收9万元，放弃本局该项后续机会。',1,{sold:true,control:-2}),O('retain','保留并只做使用许可','本期回收较少，保留未来使用选择。',1,{retain:true})],{needs:['@valuation'],remote:true,topics:['make','value','future']}),
 T('disclosure','选择储备技术的保护方向','algorithm','研发提交了尚未公开的非核心方法。结合使用机会、检测难度与公开代价选择方向。',[
 O('secret','保持秘密并落实接触记录','适合难检测的内部实施；需持续控制。',2,{futureSecret:true,control:2}),O('assess','评估专利申请可行性','保留申请选择，未完成程序前不显示已授权。',4,{futurePatent:true}),O('publish','评估防御性公开方案','经边界审查公开非核心方法，放弃该内容的秘密性和部分申请选择。',2,{futurePublished:true})],{needs:['invention'],remote:true,topics:['invent','future','capital']}),
 T('review','向董事会提交经营答卷','board','汇报已发生的合同、回款、交付与未决事项。结局会引用你的具体决定。',[
 O('finish','提交本轮经营结果','明确已兑现成果、下一站条件与长期后日谈。',0,{})],{needs:['acceptance'],remote:true,type:'finish',topics:['levels','case']})
];
C.taskById=Object.fromEntries(C.tasks.map(t=>[t.id,t]));
root.HDV3Content=C;if(typeof module!=='undefined')module.exports=C;
})(typeof globalThis!=='undefined'?globalThis:window);
