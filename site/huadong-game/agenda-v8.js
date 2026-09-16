(function (root) {
  'use strict';
  const E = root.HDEngine, C = root.HDContent, P = root.HDPlanning;
  const priority = E.priority;
  let cachedDay = null;
  const busy = j => ['running', 'queued'].includes(j.status);

  // Today's one main reminder is anchored to the start of the day. Completing
  // it does not turn every newly unlocked optional task into another obligation.
  // Reconstruct from saved actions so reloads and contact visits cannot reset it.
  function morningState(s) {
    const raw = E.save(s);
    const baseKey = JSON.stringify([raw.seed, raw.base || null, s.day]);
    if (cachedDay?.baseKey === baseKey &&
        JSON.stringify(raw.actions.slice(0, cachedDay.count)) === cachedDay.prefix) return cachedDay.state;
    let at = E.load({ ...raw, actions: [] }), count = 0;
    for (const action of raw.actions) {
      if (at.day >= s.day) break;
      at = E.dispatch(at, action); count++;
    }
    if (at.day !== s.day) at = s; // Read-only synthetic QA/import states.
    cachedDay = { baseKey, count, prefix: JSON.stringify(raw.actions.slice(0, count)), state: at };
    return at;
  }

  function daily(s) {
    if (s.ending || s.phase !== 'day') return null;
    const morning = morningState(s), target = priority(morning);
    let settled = false;
    if (target.task) {
      const acted = s.actions.slice(cachedDay.count).some(a => a.type === 'task' && a.id === target.task);
      const newlyCompleted = !!s.completed[target.task] && !morning.completed[target.task];
      const newWork = s.jobs.some(j => j.task === target.task && busy(j) && !morning.jobs.some(old => old.id === j.id));
      settled = newlyCompleted || newWork || (acted && !!s.completed[target.task]);
    }
    else if (target.event) settled = !s.events.some(e => e.id === target.event && ['open', 'report'].includes(e.status));
    else if (target.place === 'partner') settled = !!s.completed.contract;
    const actionable = !!(target.task || target.event || target.place);
    return { ...target, settled, actionable,
      title: actionable ? target.label : '今天没有新增的关键动作',
      summary: settled ? '今天的关键动作已完成或已安排。' : actionable ? target.why : '已安排事项按原排期推进。' };
  }

  function taskInfo(s, t) {
    if (s.ending || !E.available(s, t) || t.type === 'finish') return null;
    const plans = P.options(s, t).map(x => x.plan).filter(Boolean);
    const unblocked = plans.filter(p => !p.blocked);
    const affordable = unblocked.filter(p => p.cost <= s.cash);
    const best = affordable[0] || unblocked[0] || plans[0];
    const destination = C.places[t.place];
    const travel = !t.remote && destination.city !== s.city;
    const travelCost = travel ? (['singapore', 'malaysia'].includes(destination.city) || ['singapore', 'malaysia'].includes(s.city) ? 2 : 1) : 0;
    let reason = '';
    if (s.phase !== 'day') reason = '白天再安排';
    else if (!s.slots) reason = '今天行动已用完';
    else if (!unblocked.length) reason = best?.message || '当前没有可执行方案';
    else if (!affordable.length) reason = '当前现金不足';
    else if (travel && s.slots < 3) reason = '跨城需2次行动，现场决定另需1次；今天时段不足';
    else if (travel && !affordable.some(p => p.cost + travelCost <= s.cash)) reason = '计入差旅后现金不足';
    const min = plans.length ? Math.min(...plans.map(p => p.cost)) : 0;
    const max = plans.length ? Math.max(...plans.map(p => p.cost)) : 0;
    return { id: t.id, task: t.id, person: t.person, place: t.place, remote: !!t.remote,
      label: E.taskLabel(t.id), cost: min, maxCost: max, travelCost,
      slots: travel ? 3 : 1, ready: !reason, reason, due: best?.due,
      access: t.remote ? '电话安排' : destination.city === s.city ? '本城现场' : '跨城现场',
      destination: destination.name };
  }

  function eventInfo(s, e) {
    if (!['open', 'report'].includes(e.status)) return null;
    const d = C.eventById[e.id];
    if (!d) return null;
    const options = E.eventOptions(s, e);
    const candidates = Array.isArray(options) ? options.filter(o => !o.disabled && !P.plan(s, { type: 'event', id: e.id, option: o.id })?.blocked) : [];
    const cost = candidates.length ? Math.min(...candidates.map(o => o.cost || 0)) : e.status === 'open' ? 0 : Math.min(3, d.cost || 0);
    const reason = s.phase !== 'day' ? '查看夜间处理入口' : s.slots < 1 ? '今天行动已用完' : Array.isArray(options) && !candidates.length ? '当前没有可执行的处置方案' : cost > s.cash ? '当前现金不足' : '';
    return { id: e.id, event: e.id, label: d.title, person: d.person,
      due: e.due, cost, slots: 1, ready: !reason, reason, deadline: e.due <= s.day };
  }

  function agenda(s) {
    const main = daily(s);
    const tasks = s.phase === 'day' ? C.tasks.map(t => taskInfo(s, t)).filter(Boolean) : [];
    const events = s.ending ? [] : s.events.map(e => eventInfo(s, e)).filter(Boolean);
    const ready = tasks.filter(t => t.ready), blocked = tasks.filter(t => !t.ready);
    const jobs = s.jobs.filter(busy).map(j => ({ id: j.id, label: C.taskById[j.task]?.title || j.title || '部门工作',
      person: j.dept, due: j.due, status: j.status }));
    return { main, tasks, ready, blocked, events, jobs, remaining: s.slots,
      dueToday: events.filter(e => e.deadline),
      count: ready.length + events.filter(e => e.ready).length,
      title: main?.settled ? '今日关键动作已落实' : main?.actionable ? main.title : '今日经营安排',
      summary: main?.summary || '按当前进度查看待办。' };
  }

  root.HDAgenda = { agenda, daily, taskInfo, morningState };
})(globalThis);
