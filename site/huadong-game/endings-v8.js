(function(root){'use strict';
const C=root.HDContent;
const rows=[
['bankrupt','最后一盏灯','hq','secretary','必要付款已经没有可执行的资金安排，本轮海外项目停止新增经营。','lightoff',
'项目区的灯一盏盏暗下来，桌上只剩付款清单和没有发出的安排。我曾经把下一笔收入想得太近，把眼前要付的钱看得太轻。现在停止的是这轮海外项目，国内的团队和业务仍然需要有人认真照看。',
'投入本身没有错，但每一笔都得和能撑多久放在一起看。没有确认到账的收入，不能替我支付今天的费用。团队为我的决定付出了时间，我需要把损失和剩下的资源交代清楚。',
'下一轮，我会先列出必须付款的日期，再决定能承担多少准备工作。融资可以争取，付款证据和退路也要提前备好。不能把下一次求援当成每天都能使用的安排。'],
['coreloss','核心外流','chengdu','algorithm','本局已经出现核心材料外流和实质商业损害的记录。','codeout',
'研发区的屏幕还亮着，团队却不得不把时间放在核对外流范围上。那些代码背后是很多次试错，现在多了一份我们无法收回的副本。我不能把这种后果，只写成一次合作中的沟通问题。',
'伙伴需要支持，交付也有期限，但开放多少始终是我要承担的判断。事情发展到今天，已有的记录说明损害已经发生。合同和补救仍有作用，却不能让我假装交出去的内容没有被使用过。',
'接下来先保住仍在手里的版本和团队，按记录处理受影响的客户与权限。下一次合作，我会让支持方式与技术边界一起设计，并留出验证边界能否落实的时间。'],
['marketloss','市场留给了别人','partner','market','已有的客户、品牌或渠道安排限制了本轮市场的自主经营。','windowclose',
'客户的联系窗口还在运转，只是越来越多的下一步需要经过伙伴同意。订单并没有让我自动拥有市场。看到本局留下的合同和客户记录，我才需要正面回答，生意做起来以后，我们究竟还握着哪些选择。',
'早期借助当地资源有现实理由，但独占、品牌和客户入口都不是附带的小字。我为进入市场交换出去的条件，已经影响后续路线。即使有收入，也不能把减少的自主空间从复盘里删掉。',
'我会先核对本轮约定的地区和客户范围，再决定争取重谈，还是准备另一个入口。不能把一个项目的失守夸大成整个东盟都没有机会，也不能重复承诺已经交出去的权利。'],
['halted','被迫暂停交付','port','hardware','本轮没有完成可持续交付，团队需要先处理仍未闭合的实施事项。','halt',
'交付区仍有设备和待核对的材料，客户需要的稳定运行还没有成为本轮成果。暂停让人难受，但继续把演示说成正式交付，只会让下一次解释更加困难。我得先把做到的和没做到的分开讲。',
'调查、测试和合同分别解决不同的问题。某一项做好了，不能替代剩下的工作。回看这轮排期，我需要承认自己在哪里低估了衔接时间，又在哪里把尚未验证的条件当成了现成能力。',
'接下来按实际缺项安排负责人，先决定还有哪些承诺能够兑现，再讨论新订单。团队需要的是可执行的下一步，而不是再听一次赶进度的要求。下一轮的交付范围会从证据出发。'],
['lostorder','失去标杆订单','port','client','客户终止记录或商誉归零，使本轮海外扩张停止。','disconnect',
'原本用于讨论下一阶段的客户会议，最后变成了交代停止安排的会面。标杆项目失去的不只是眼前订单，还有客户继续等待的意愿。造成这个结果的事件与处理期限，都留在本局记录里。',
'我不能把责任推给一句市场变化。承诺之后是否跟进，收到质疑以后是否拿出材料，这些都属于经营决定。伙伴的态度和客户的信任也不是同一个数，前者支持我，不代表后者必须继续买单。',
'这一轮海外项目先到这里，国内业务并未因此被写成破产。接下来把已承诺的交接与说明做好，保留真实证据。下一次争取客户时，我要用兑现过的事情说话，而不是更大的保证。'],
['equity','新的股东，新的规则','board','finance','股权融资改变了创始方的持股关系，项目继续推进。','newseat',
'会议桌上需要考虑的意见更多了。资金给了项目继续推进的时间，股权变化也已经进入记录。我不能只看到账时松下来的那口气，却忽略以后做决定时需要承担的新关系。',
'融资是一次真实交换。它既不是经营失败的唯一证明，也不是拿到钱就可以不算成本。项目用掉这些钱以后，仍然要回答客户为什么付款，团队怎样交付，以及新旧股东各自承担什么。',
'接下来把融资用途与实际结果放在同一份账上，按约定向股东解释。我要争取的主动权来自能够重复兑现的经营能力。下一轮谈条件时，也会把资金期限和治理安排一起算清楚。'],
['preserve','带着核心撤回来','chengdu','algorithm','本轮主动收缩，仍保留核心团队、技术和后续选择。','return',
'这一次，我选择把脚步收回来。没有继续扩张，并不意味着前面的工作都没有价值。现有的技术、人员和本局记录还在，它们会告诉团队，下一次从哪里重新开始，而不是从头编一个更好听的故事。',
'有些机会值得争取，有些条件需要拒绝。真正的取舍是承认已经付出的代价，同时不让不合适的承诺继续扩大。我需要向团队解释为什么停在这里，也需要把尚未完成的义务逐项安排好。',
'接下来用剩余资源补清关键问题，再评估能不能换一种方式进入市场。下一次不会照搬这轮的所有决定，但会保留那些有证据支撑的判断。把核心和人留住，才有继续经营的基础。'],
['repriced','新智链重新报价','partner','partner','本局的筹码与边界促成了伙伴新增投入或重新报价。','offerback',
'新智链把新的条件送回来时，我没有急着签。多出来的投入需要看清期限和用途，口头支持也要落到可以核对的安排上。能够重新谈价格，是前面那些投入开始形成筹码的结果。',
'守住边界不等于拒绝所有合作。客户需要的能力、双方真实的人手和已核对的材料，让我们能说明哪些支持值得付费。伙伴也有自己的成本，我不能把一次让步理解成以后所有要求都会被接受。',
'下一步先落实本次新增承诺，再按实际交付检查双方是否做到。加价是这轮谈判的结果，长期合作还要靠日常履约。我会把可重复使用的核心留好，也把约定给伙伴的支持做实。'],
['rebound','合作继续，边界重划','partner','legal','合作仍在进行，双方已经落实本轮的边界调整。','rewrite',
'会议结束时，我们没有把所有分歧都说成已经消失。合同上改过的范围和负责人，比最后的握手更值得留下来。合作继续，是因为双方知道接下来各自能做什么，也知道哪些事情需要重新确认。',
'这轮有让步，也有必须保留的条件。边界只有变成账号、交接和工作安排，才会影响实际执行。我愿意承担必要的支持成本，但不能让一次临时方便变成以后不受约束的默认权限。',
'接下来按新安排核对执行，换人、换产品或进入新地区时重新看范围。我要保留对伙伴的回应，也给团队清楚的工作依据。合作能走多远，要看这些普通日子里是否继续兑现。'],
['asean','下一站，东盟','malaysia','market','首站交付与下一市场准备共同支持启动新阶段。','route',
'下一站的机会已经出现在桌上，我现在更愿意先问当地需要什么。首站的成果让团队多了一份可以展示的经历，但新市场仍有自己的客户、服务要求和权利范围，不能把旧答案直接搬过去。',
'这轮的进展来自多项工作相互支持。客户确认、伙伴投入、技术边界和实际回款，都得各自经得起核对。我记得为了推进作过的让步，也记得哪些准备让我们在被催促时仍然有选择。',
'接下来先落实新地区的人手、调查和客户沟通，再决定扩张的速度。地图上的下一段路代表已经有依据的启动机会，不能算成尚未发生的盈利。我想带着可以继续检验的方法出发。'],
['direct','自主渠道成形','market','market','本局已有直接客户入口和本地支持安排，自主渠道获得基础。','direct',
'客户能够直接找到华东的负责人，这件事比宣传页上的名字更有分量。自主渠道开始形成，说明我们愿意自己承担联系、支持和交付的工作。绕开某个中间环节，并不等于这些成本也跟着没有了。',
'我为这种自主投入了时间和人员。它带来更直接的信息，也让团队需要更快地回应现场问题。回看这轮选择，不能只计算留下多少利润，还要计算自己是否真有能力接住客户的下一次要求。',
'接下来继续把联系窗口、服务记录和付款安排留在公司。需要伙伴协助的地方仍然可以合作，但职责要讲清楚。渠道的价值要靠一次次实际服务积累，不能只靠今天给它取一个名字。'],
['license','技术开始持续收钱','chengdu','finance','许可范围、使用记录及真实回款支持本轮技术经营。','royalty',
'技术的价值开始出现在真实的使用和收款记录里。看到这笔钱时，我更清楚持续收入并不来自一纸许可本身。对方是否按范围使用，我们是否提供约定支持，都需要有人继续认真核对。',
'这轮选择让我把能重复使用的技术和客户项目中的具体工作分开考虑。保留核心会带来支持成本，开放范围也会影响后续议价。收过一次钱，不能让我忽略下一次使用和收费之间是否仍然对得上。',
'接下来按真实部署核账，及时处理范围变化，记录已经到账和仍待支付的款项。下一轮谈许可，我会把权利基础、服务负担与付款安排一起说明。持续收益需要经营，不能只留在预测表里。'],
['franchise','服务能够复制','malaysia','hr','培训、手册、品牌与质量安排共同支持服务复制。','handover',
'新的团队开始按同一套要求准备服务，我才看到复制这件事有多具体。不是把招牌挂到另一处就算扩张完成。有人能够说明流程，也有人能在现场按流程把问题处理好，品牌才有继续积累的基础。',
'这轮在培训、手册和检查上花了时间。它们看起来不像谈下一笔订单那样直接，却决定客户能不能在不同地点得到相近的体验。我不能要求别人使用我们的名字，却不管实际服务出了什么差别。',
'接下来先跟踪新团队的第一批服务记录，发现偏差就按约定处理。复制的速度要和支持能力相配。下一轮的目标不是更快地增加地点，而是让每一个新地点都有承担承诺的人和办法。'],
['innovation','从防守走向新技术','shenzhen','hardware','本局形成可验证的技术改进，并有对应的成果处理安排。','restart',
'团队把新的技术方案放到桌上时，我想到的是前面那些具体问题。改进不是凭空出现的奖励，而是有人把交付中的限制继续追问了下去。现在有了可以核对的结果，才值得重新评估它能用于哪些场景。',
'这轮既要处理已有边界，也要给研发留下做事的空间。新成果如何保留、如何公开或如何支持客户，仍然需要按本局已经作出的安排执行。我不能因为看到新东西，就把尚未取得的权利说成已经取得。',
'接下来继续验证应用范围，记录开发过程和参与者，再决定下一轮投入。防守留下的问题可以成为改进的起点，但改进是否值得商业化，要看真实需求、成本和团队能否稳定复现。'],
['foothold','第一站，站稳了','port','client','首站完成限定范围的阶段交付，后续扩张仍按实际准备推进。','operate',
'港区还在照常作业，团队终于可以从第一次交付中抬头看一看。第一站站稳，让我们有了一段可以向客户讲清楚的经历。我更愿意先把服务做好，再决定要不要马上把步子迈得更大。',
'这轮的成果有明确范围。完成验收不代表以后不会再有问题，收到阶段款也不代表所有合同金额都已到账。我需要记住为这次交付承担的成本，让后面的支持和维护仍然有人负责。',
'接下来把回款、服务和未决事项继续跟好，再根据新市场调查作选择。速度可以讨论，已经许下的承诺不能忘记。下一次扩张时，我希望拿出来的是可核对的交付经验，而不只是这次结局的标题。']
];
const defs=Object.fromEntries(rows.map((r,i)=>[r[0],{id:r[0],number:i+1,title:r[1],scene:r[2],person:r[3],summary:r[4],motion:r[5],paragraphs:r.slice(6)}]));
function classify(s){const f=s.flags||{},old=s.ending?.id;
if(old==='bankrupt'||f.projectStopped||s.cash<0&&!s.rescuePending)return'bankrupt';
if(s.reputation<=0)return'lostorder';
if(f.coreLeaked&&f.coreCommercialDamage)return'coreloss';
if(f.customerTerminated)return'lostorder';
if(f.channelLocked||f.brandAgentHeld||f.sideExclusive&&f.expansion==='direct'||s.terms?.exclusive==='open'&&!f.exclusiveAdjusted&&s.control<50)return'marketloss';
if(f.deliveryBlocked)return'halted';
if(f.v8OrderlyWithdrawal||s.actions?.some(a=>a.type==='stop')||s.log?.at(-1)?.title==='主动收缩项目')return'preserve';
if(!f.delivered)return'halted';
if(s.market&&100*s.market.founder/s.market.shares<60)return'equity';
if(f.expansion==='partner'&&f.nextReady&&f.controls&&f.ddFixed&&['shenzhen','chengdu','singapore','malaysia'].every(c=>(s.visitedCities||[]).includes(c))&&f.siteHardware&&f.modelProof&&f.partnerWitness&&s.completed?.inspection&&s.reports?.inspection?.read&&(s.visited||[]).includes('port')&&s.reputation>=60&&s.trust>=50)return'asean';
if(f.expansion==='direct'&&f.nextReady&&(f.staff||0)>=2&&!f.channelLocked&&!f.brandAgentHeld)return'direct';
if(f.expansion==='franchise'&&f.nextReady&&f.quality&&f.brandClear)return'franchise';
if(['license','brand'].includes(f.expansion)&&(f.royalty||f.royaltyFixed)&&(s.events||[]).some(e=>e.received>0&&((e.id==='v8e44'&&e.choice==='license')||(e.id==='v8e42'&&e.choice==='renew')||e.id==='royaltygap')))return'license';
if(f.futureTech&&f.modelProof&&(f.futureSecret||f.futurePatent||f.improvementLicensed)&&s.completed?.invention&&s.reports?.invention?.read)return'innovation';
if(f.partnerRaisedOffer||f.partnerExtraInvestment>0)return'repriced';
if(f.exclusiveAdjusted||f.exitManaged||f.accessManaged||f.changeControlManaged||f.controls&&s.terms?.exit==='managed'&&(f.v8CoreService||f.v8AccessLimited||f.v8RegionalMilestones||f.v8ImprovementSplit))return'rebound';
return'foothold';}
function decisionText(s){const acts=(s.actions||[]).filter(a=>['task','event','capital','investment','acceptOffer','chairmanAid'].includes(a.type));const choices=[];for(const a of acts){let text;if(a.type==='task'){const t=C.taskById[a.id];if(!t||a.id==='review')continue;const o=t.options?.find(o=>o.id===a.payload?.option);text=o?.label||o?.title||t.title;}else if(a.type==='event'){const d=C.eventById[a.id];text=d?.options?.find(o=>o.id===a.option)?.label||d?.title;}else if(a.type==='capital')text=a.kind==='issue'?'发行股份取得项目资金':'使用现金回购股份';else if(a.type==='investment')text=a.kind==='buy'?'买入虚构股票':'卖出持仓取得现金';else if(a.type==='chairmanAid')text='向董事会说明追加资金用途';else text='接受伙伴报价';if(text&&!choices.includes(text))choices.push(text.replace(/[。；：].*$/,''));}if(choices.length>=2)return`我记得自己先决定${choices[0]}，后来又决定${choices.at(-1)}。这两项选择都留在本局记录中。`;if(choices.length===1)return`本局已提交的经营决定中，我选择了${choices[0]}。其余未作出的安排，不能写成已经发生的经历。`;return'这一局没有足够的已提交经营决定，我不能给自己补写两段没有发生过的经历。';}
function han(s){return (s.match(/[\u3400-\u9fff]/g)||[]).length;}
function reflection(s,d){let p=d.paragraphs.slice();p[1]=decisionText(s)+p[1];const fillers=['我会把未兑现的承诺单独列出，给团队一个可以继续核对的安排。','这份复盘只记录本局发生的事，不替未来写结论。','下一次仍要用实际结果检验判断。'];for(const f of fillers){if(han(p.join(''))>=280)break;p[2]+=f;}if(han(p.join(''))>330){const sentences=p[1].match(/[^。！？]+[。！？]?/g)||[];while(sentences.length>2&&han([p[0],sentences.join(''),p[2]].join(''))>330)sentences.pop();p[1]=sentences.join('');}return p;}
function ending(s){const id=classify(s),d=defs[id],old=s.ending||{},f=s.flags||{},p=reflection(s,d);s.ending={...old,id,title:s.reputation<=0?'商誉耗尽 · 海外扩张失败':d.title,number:d.number,scene:d.scene,person:d.person,motion:d.motion,summary:s.reputation<=0?'公共事件的累计后果使公司商誉归零，本轮海外项目停止。':d.summary,day:s.day,cash:s.cash,ceo:p.join('\n\n'),reflection:p,memories:[],future:old.future||'数月后的结果取决于后续履约；本轮没有把预测收益记为现金。',evidence:old.evidence||[f.delivered?'本轮取得阶段验收记录。':'本轮未完成阶段验收。',`项目可用现金 ${s.cash} 万元；公司商誉 ${s.reputation}。`,...(s.log||[]).filter(x=>/商誉|客户|核心|外流|截止/.test(x.title+' '+x.text)).slice(-2).map(x=>`D${x.day} ${x.title}：${x.text}`)],topics:(s.topics||[]).slice(),newspaper:d.title};return s.ending;}
root.HDV8Endings={defs,classify,reflection,ending,han};
})(globalThis);
