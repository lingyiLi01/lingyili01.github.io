from pathlib import Path
root=Path(__file__).resolve().parents[1]
ui=(root/'original/ui.js').read_text()
ui=ui.replace("querySelectorAll('.dept-chip span')", "querySelectorAll('.dept-chip > span:not(.avatar)')")
ui=ui.replace("const last=next.log.at(-1),job=", "const last=next.log.slice(S.log.length).find(x=>x.title===t.title)||{text:'本次方案已核对，确认后执行。'},job=")
ui=ui.replace("if(!['license','negotiate','acceptance'].includes(id))", "if(!['license','negotiate'].includes(id))")
ui=ui.replace('<b>${r8Money(m.receipts)}</b> 万元</span></div></section>', '<b>${r8Money(m.receipts)}</b> 万元</span>${Number.isFinite(row.cashDelta)?`<span>本次支出 <b>${r8Money(row.expenses)}</b> 万元</span><span>现金净变化 <b>${r8Signed(row.cashDelta)}</b> 万元</span>`:\'\'}</div></section>')
tail='\nrender();\n})();'
assert ui.count(tail)==1
ui=ui.replace(tail,'\n'+(root/'tools/ui-fix.js').read_text()+tail)
(root/'out/ui.js').write_text(ui)
r=(root/'original/reports-v8.js').read_text()
r=r.replace('客户.*付款','客户.*(?:付款|支付)')
r=r.replace("'acceptOffer','travel','visit','mini','cancelJob'", "'acceptOffer','cancelJob'")
# Do not interpret a territorial restriction as a data-access decision.
r=r.replace("else if(control>0&&delta<0)partner=", "else if(event?.outcome)partner=event.outcome.immediate;\n else if(control>0&&delta<0)partner=")
r=r.replace("const row={id,actionId:actual", "const cashDelta=round(num(s.cash)-num(old.cash)),expenses=round((s.ledger||[]).slice((old.ledger||[]).length).filter(x=>num(x.amount)<0).reduce((n,x)=>n-num(x.amount),0));\n const row={cashDelta,expenses,id,actionId:actual")
(root/'out/reports-v8.js').write_text(r)
events=(root/'original/events-v8.js').read_text().replace('新加坡独占，被写成了东盟独占','伙伴新稿要求东盟独占')
(root/'out/events-v8.js').write_text(events)
html=(root/'original/index.html').read_text().replace('</head>','<link rel="stylesheet" href="experience-fix.css"></head>')
(root/'out/index.html').write_text(html)
print('Built experience repair from preserved live V8 baseline.')
