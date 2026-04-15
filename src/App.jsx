import { useState, useEffect } from "react";

const ANNA = {
  lastPeriod: "2026-03-17",
  cycleLength: 29,
};

const getDayOfCycle = () => {
  const start = new Date(ANNA.lastPeriod);
  const now = new Date();
  start.setHours(0,0,0,0); now.setHours(0,0,0,0);
  return Math.floor((now - start) / 86400000) + 1;
};

const getCyclePhase = (day) => {
  const d = ((day - 1) % ANNA.cycleLength) + 1;
  if (d <= 5) return { phase: "Menstrual", moon: "\u{1F311}", color: "#9b7fa8", bg: "rgba(155,127,168,0.1)", energy: "Inward & restorative", guidance: "Rest without guilt. Reflect. No output pressure.", schedule: "Minimum viable work. More rest blocks. No forcing." };
  if (d <= 13) return { phase: "Follicular", moon: "\u{1F312}", color: "#7fa88a", bg: "rgba(127,168,138,0.1)", energy: "Rising & sharp", guidance: "Start new things. Build. Think strategically.", schedule: "Maximum deep work. Begin new SyncHer modules. Strategy." };
  if (d <= 17) return { phase: "Ovulatory", moon: "\u{1F315}", color: "#c4a46b", bg: "rgba(196,164,107,0.12)", energy: "Peak & magnetic", guidance: "Be seen. Film everything. Connect and pitch.", schedule: "Film TikToks + YouTube. All calls + collaborations." };
  return { phase: "Luteal", moon: "\u{1F317}", color: "#a48b6b", bg: "rgba(164,139,107,0.1)", energy: "Focused & finishing", guidance: "Complete, edit, wrap up. Protect your energy.", schedule: "Admin, editing, Seraya tasks. Wind down early." };
};

const formatDate = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const HABITS = [
  { id: 'morning_practice', label: 'Morning practice', icon: '\u{1F9D8}', pillar: 'spiritual' },
  { id: 'no_phone', label: 'No phone before practice', icon: '\u{1F4F5}', pillar: 'structure' },
  { id: 'movement', label: 'Movement / workout', icon: '\u{1F4AA}', pillar: 'body' },
  { id: 'water', label: 'Hydration', icon: '\u{1F4A7}', pillar: 'body' },
  { id: 'syncher_hour', label: '1hr SyncHer work', icon: '\u{1F9EC}', pillar: 'business' },
  { id: 'creative_out', label: 'One creative output', icon: '\u2728', pillar: 'business' },
  { id: 'transitions', label: 'Transition rituals', icon: '\u{1F33F}', pillar: 'structure' },
  { id: 'protected_eve', label: 'Protected evening', icon: '\u{1F319}', pillar: 'structure' },
  { id: 'no_electronics', label: 'No electronics after 7:30', icon: '\u{1F4F5}', pillar: 'structure' },
  { id: 'reading', label: 'Reading before bed', icon: '\u{1F4D6}', pillar: 'spiritual' },
  { id: 'legs_up', label: 'Legs up the wall', icon: '\u{1F9B5}', pillar: 'body' },
  { id: 'altar', label: 'Altar / spiritual moment', icon: '\u{1F56F}\uFE0F', pillar: 'spiritual' },
];

const DUBAI = [
  { id: 'db1', label: 'Confirm boys handle big furniture', cat: 'Before Burn \u00B7 Apr 23' },
  { id: 'db2', label: "Book Ruby's Dubai \u2192 Amsterdam flight", cat: 'Before Burn \u00B7 Apr 23' },
  { id: 'db3', label: 'Start MOCCAE export permit for Ruby', cat: 'Before Burn \u00B7 Apr 23' },
  { id: 'db4', label: 'Book vet \u2014 Ruby health certificate', cat: 'Before Burn \u00B7 Apr 23' },
  { id: 'db5', label: 'Storage unit decision: yes / no', cat: 'Before Burn \u00B7 Apr 23' },
  { id: 'db6', label: 'Communicate Dubai exit to team', cat: 'Before Burn \u00B7 Apr 23' },
  { id: 'db7', label: 'Pack personal belongings', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db8', label: 'Pack altar & sacred objects', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db9', label: 'Pack work equipment (laptop, Fujifilm, drives)', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db10', label: 'Pack peptide protocol supplies', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db11', label: 'Pack all personal documents', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db12', label: 'Cancel / transfer Dubai subscriptions', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db13', label: 'Notify bank of address change', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db14', label: 'Photograph villa condition', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db15', label: 'Return keys to landlord', cat: 'Dubai Sprint \u00B7 May 8\u201321' },
  { id: 'db16', label: 'Amsterdam apartment confirmed & ready', cat: 'Amsterdam Landing' },
  { id: 'db17', label: 'Altar corner set up first', cat: 'Amsterdam Landing' },
  { id: 'db18', label: 'Ruby settled \u{1F43E}', cat: 'Amsterdam Landing' },
];

const DEFAULT_PROJECTS = [
  {
    id: 'seraya_studio', name: 'Seraya Studio', emoji: '\u{1FAA8}', color: '#c4a46b',
    tagline: 'Stone furniture \u2014 build, launch, exit clean', deadline: 'Jul 2026',
    milestones: [
      { id: 'ss1', label: 'Website live', done: true },
      { id: 'ss2', label: 'All 4 products listed', done: true },
      { id: 'ss3', label: 'Spec sheets complete', done: true },
      { id: 'ss4', label: 'Instagram presence launched', done: false },
      { id: 'ss5', label: 'First content posts live', done: false },
      { id: 'ss6', label: 'Marketing & sales system live', done: false },
      { id: 'ss7', label: 'First sale \u{1F389}', done: false },
      { id: 'ss8', label: 'Clean exit from Seraya', done: false },
    ]
  },
  {
    id: 'syncher', name: 'SyncHer', emoji: '\u{1F9EC}', color: '#8a9fbf',
    tagline: "Women's hormone health \u2014 the core life's work", deadline: 'Dec 2026',
    milestones: [
      { id: 'sy1', label: 'SAGE AI persona finalized', done: true },
      { id: 'sy2', label: 'Project bible complete', done: true },
      { id: 'sy3', label: 'Landing page live', done: false },
      { id: 'sy4', label: 'Kajabi platform set up', done: false },
      { id: 'sy5', label: 'First digital product built', done: false },
      { id: 'sy6', label: 'Waitlist 100+ signups', done: false },
      { id: 'sy7', label: 'First paying customers', done: false },
    ]
  },
  {
    id: 'brand', name: 'Personal Brand', emoji: '\u{1F3AC}', color: '#bf8a8a',
    tagline: 'TikTok \u00B7 YouTube \u00B7 Instagram \u2014 be seen', deadline: 'Ongoing',
    milestones: [
      { id: 'br1', label: 'First TikTok posted', done: false },
      { id: 'br2', label: 'Content strategy documented', done: false },
      { id: 'br3', label: '10 TikToks posted', done: false },
      { id: 'br4', label: 'First YouTube video', done: false },
      { id: 'br5', label: 'Content batching system live', done: false },
      { id: 'br6', label: '1K TikTok followers', done: false },
    ]
  },
  {
    id: 'geo', name: 'Geographic Transition', emoji: '\u{1F3D4}\uFE0F', color: '#7fa88a',
    tagline: 'Dubai exit \u2192 Amsterdam \u2192 Zug / Switzerland', deadline: 'May 21',
    milestones: [
      { id: 'ge1', label: 'Africa Burn (Apr 24 \u2013 May 3)', done: false },
      { id: 'ge2', label: 'Dubai exit complete (May 21)', done: false },
      { id: 'ge3', label: 'Ruby relocated to Amsterdam', done: false },
      { id: 'ge4', label: 'Settled in Amsterdam', done: false },
      { id: 'ge5', label: 'Switzerland immigration researched', done: false },
      { id: 'ge6', label: 'Zug visit / scout', done: false },
    ]
  },
  {
    id: 'italy', name: 'Italy Opportunity', emoji: '\u{1F1EE}\u{1F1F9}', color: '#a48b6b',
    tagline: 'European stone market with supplier \u2014 seed stage', deadline: 'Sept 2026',
    milestones: [
      { id: 'it1', label: 'Follow-up with stone supplier', done: false },
      { id: 'it2', label: 'Research Italian stone market', done: false },
      { id: 'it3', label: 'Visit Italy to explore', done: false },
      { id: 'it4', label: 'Go / no-go decision', done: false },
    ]
  },
];

const WEEK_PLAN = [
  { day: 'Mon', focus: 'Planning + Seraya', detail: 'Weekly review, standup, set intentions' },
  { day: 'Tue', focus: 'Deep Build', detail: 'SyncHer / content / strategic work' },
  { day: 'Wed', focus: 'Deep Build', detail: 'SyncHer / content / strategic work' },
  { day: 'Thu', focus: 'Business + Calls', detail: 'Cofounder calls, Seraya admin' },
  { day: 'Fri', focus: 'Content Creation', detail: 'Filming, batching, creative output' },
  { day: 'Sat', focus: 'Rest + Spirit', detail: 'Nature, longer practice, no work' },
  { day: 'Sun', focus: 'Reflection + Reset', detail: 'Weekly review, prep next week' },
];

const PILLARS = [
  { id: 'spiritual', emoji: '\u{1F9D8}', name: 'Spiritual Practice', color: '#9b7fa8', desc: 'The operating system. Non-negotiable.', actions: ['Daily practice before screens', 'Altar space everywhere you live', 'Weekly longer session', 'Vipassana annually'], note: 'Drifted during Dubai work year. Rebuilding now. This is the foundation under everything.' },
  { id: 'heart', emoji: '\u{1F90D}', name: 'Heart & Relationships', color: '#bf8a8a', desc: 'The rewiring. Lean toward those who love freely.', actions: ['Contact grandmother soon', 'Lean in to those who show up', 'Distance from dream-shrinking connections', 'Reconnect with aligned people'], note: 'Root found at Vipassana: unplanned child, mother wound, closed heart as protection. Now: open, receive, love freely.' },
  { id: 'body', emoji: '\u{1F4AA}', name: 'Body & Health', color: '#7fa88a', desc: 'You know what the body needs. Now live it consistently.', actions: ['Cycle-synced training', 'Nervous system regulation daily', 'Legs up the wall every break', 'Peptide protocol (post-Burn cycle)'], note: 'Workout: mornings preferred, before lunch as backup. Cycle-sync everything.' },
  { id: 'business', emoji: '\u{1F4BC}', name: 'Business Architecture', color: '#c4a46b', desc: 'Build what lasts. Exit what doesn\'t serve.', actions: ['Seraya Studio \u2192 first sale \u2192 exit', 'SyncHer 1hr daily minimum', 'Italy opportunity: keep warm', 'Switzerland research: don\'t let it slip'], note: '2030 test: does she thank you or resent you for this decision?' },
  { id: 'structure', emoji: '\u{1F5D3}\uFE0F', name: 'Structure & Rhythm', color: '#8a9fbf', desc: 'No more chaos. Channel the power.', actions: ['Morning practice before phone', 'Transition rituals between blocks', 'Protected evenings \u2014 no electronics', 'Sunday weekly reset'], note: 'Fix: reactive all day + lost transition time \u2192 clear blocks + 10-min transition rituals.' },
];

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} body{background:#0a0906} ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(196,164,107,0.2);border-radius:2px} .nb{background:none;border:none;cursor:pointer;transition:all 0.18s} .nav-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;width:100%;text-align:left} .nav-item:hover{background:rgba(196,164,107,0.07)} .nav-item.active{background:rgba(196,164,107,0.11)} .card{background:rgba(255,255,255,0.028);border:1px solid rgba(196,164,107,0.11);border-radius:12px;padding:18px} .hb{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:7px;width:100%;background:none;border:none;cursor:pointer;transition:background 0.15s;text-align:left} .hb:hover{background:rgba(255,255,255,0.03)} .chk{width:19px;height:19px;border-radius:4px;border:1.5px solid rgba(196,164,107,0.28);display:flex;align-items:center;justify-content:center;transition:all 0.18s;flex-shrink:0} .chk.on{background:#c4a46b;border-color:#c4a46b} .inp{background:rgba(255,255,255,0.04);border:1px solid rgba(196,164,107,0.14);border-radius:8px;color:#e8dcc8;padding:9px 13px;font-family:'DM Sans',sans-serif;font-size:12px;width:100%;resize:none;outline:none;transition:border-color 0.2s} .inp:focus{border-color:rgba(196,164,107,0.35)} .bar{height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden} .fill{height:100%;border-radius:2px;transition:width 0.5s ease} .tag{font-size:10px;letter-spacing:0.09em;margin-bottom:11px} .label{font-size:10px;color:#8a7d6a;margin-bottom:3px} .pill{padding:8px 10px;background:rgba(255,255,255,0.03);border-radius:7px} .grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px} .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px} textarea.inp{min-height:48px}`;

function loadFromStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // silently fail
  }
}

export default function AnnaOS() {
  const [view, setView] = useState('today');
  const [habits, setHabits] = useState({});
  const [dubai, setDubai] = useState({});
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [weekNotes, setWeekNotes] = useState({});
  const [intention, setIntention] = useState('');
  const [loaded, setLoaded] = useState(false);

  const dateKey = new Date().toISOString().split('T')[0];
  const cycleDay = getDayOfCycle();
  const cycle = getCyclePhase(cycleDay);

  useEffect(() => {
    const loadState = () => {
      try {
        const habitsData = loadFromStorage(`anna:habits:${dateKey}`);
        if (habitsData) setHabits(JSON.parse(habitsData));
      } catch (e) {}

      try {
        const dubaiData = loadFromStorage('anna:dubai');
        if (dubaiData) setDubai(JSON.parse(dubaiData));
      } catch (e) {}

      try {
        const weekData = loadFromStorage('anna:weeknotes');
        if (weekData) setWeekNotes(JSON.parse(weekData));
      } catch (e) {}

      try {
        const intentionData = loadFromStorage(`anna:intention:${dateKey}`);
        if (intentionData) setIntention(intentionData);
      } catch (e) {}

      try {
        const projectsData = loadFromStorage('anna:projects');
        if (projectsData) {
          const saved = JSON.parse(projectsData);
          setProjects(prev => prev.map(p => {
            const sp = saved.find(s => s.id === p.id);
            if (!sp) return p;
            return { ...p, milestones: p.milestones.map(m => { const sm = sp.milestones?.find(x => x.id === m.id); return sm ? { ...m, done: sm.done } : m; }) };
          }));
        }
      } catch (e) {}

      setLoaded(true);
    };

    loadState();
  }, []);

  const save = (key, val) => {
    try {
      saveToStorage(key, typeof val === 'string' ? val : JSON.stringify(val));
    } catch (e) {}
  };

  const toggleHabit = (id) => { const n = { ...habits, [id]: !habits[id] }; setHabits(n); save(`anna:habits:${dateKey}`, n); };
  const toggleDubai = (id) => { const n = { ...dubai, [id]: !dubai[id] }; setDubai(n); save('anna:dubai', n); };
  const toggleMilestone = (pid, mid) => {
    const n = projects.map(p => p.id === pid ? { ...p, milestones: p.milestones.map(m => m.id === mid ? { ...m, done: !m.done } : m) } : p);
    setProjects(n);
    save('anna:projects', n.map(p => ({ id: p.id, milestones: p.milestones.map(m => ({ id: m.id, done: m.done })) })));
  };
  const saveIntention = (v) => { setIntention(v); save(`anna:intention:${dateKey}`, v); };
  const saveWeekNote = (day, v) => { const n = { ...weekNotes, [day]: v }; setWeekNotes(n); save('anna:weeknotes', n); };

  const NAV = [
    { id: 'today', label: 'Today', icon: '\u25C9' },
    { id: 'week', label: 'Week', icon: '\u2B1C' },
    { id: 'habits', label: 'Habits', icon: '\u25C8' },
    { id: 'projects', label: 'Projects', icon: '\u25EB' },
    { id: 'pillars', label: 'Pillars', icon: '\u25E7' },
    { id: 'checklist', label: 'Dubai Exit', icon: '\u2713' },
    { id: 'profile', label: 'Profile', icon: '\u25CE' },
  ];

  const S = {
    root: { display: 'flex', height: '100vh', background: '#0a0906', color: '#e8dcc8', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', position: 'relative' },
    sidebar: { width: '176px', flexShrink: 0, borderRight: '1px solid rgba(196,164,107,0.09)', padding: '22px 10px', display: 'flex', flexDirection: 'column', gap: '3px' },
    main: { flex: 1, overflow: 'auto', padding: '28px 30px' },
    logo: { padding: '0 4px 18px', borderBottom: '1px solid rgba(196,164,107,0.09)', marginBottom: '10px' },
    logoText: { fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#c4a46b', letterSpacing: '0.05em' },
    logoSub: { fontSize: '9px', color: '#8a7d6a', marginTop: '2px', letterSpacing: '0.12em' },
    cycleWidget: { marginTop: 'auto', padding: '11px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: `1px solid ${cycle.color}20`, textAlign: 'center' },
    pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 300, color: '#e8dcc8', marginBottom: '6px' },
    pageSub: { fontSize: '11px', color: '#8a7d6a', marginBottom: '22px' },
  };

  if (!loaded) return <div style={{ ...S.root, alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", color: '#c4a46b', letterSpacing: '0.2em', fontSize: '13px' }}>ANNA OS</div>;

  return (
    <>
      <style>{CSS}</style>
      <div style={S.root}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoText}>Anna OS</div>
            <div style={S.logoSub}>2026 FOUNDATIONS</div>
          </div>
          {NAV.map(n => (
            <button key={n.id} className={`nb nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
              <span style={{ fontSize: '13px', color: view === n.id ? '#c4a46b' : '#6a6055' }}>{n.icon}</span>
              <span style={{ fontSize: '12px', color: view === n.id ? '#e8dcc8' : '#7a7060' }}>{n.label}</span>
            </button>
          ))}
          <div style={S.cycleWidget}>
            <div style={{ fontSize: '22px', marginBottom: '3px' }}>{cycle.moon}</div>
            <div style={{ fontSize: '10px', color: cycle.color, letterSpacing: '0.07em' }}>{cycle.phase.toUpperCase()}</div>
            <div style={{ fontSize: '10px', color: '#6a6055', marginTop: '2px' }}>Day {cycleDay}</div>
          </div>
        </div>

        {/* Main */}
        <div style={S.main}>
          {view === 'today' && <TodayView {...{ cycle, cycleDay, intention, saveIntention, habits, toggleHabit, S }} />}
          {view === 'week' && <WeekView {...{ weekNotes, saveWeekNote, cycleDay, cycle, S }} />}
          {view === 'habits' && <HabitsView {...{ habits, toggleHabit, S }} />}
          {view === 'projects' && <ProjectsView {...{ projects, toggleMilestone, S }} />}
          {view === 'pillars' && <PillarsView S={S} />}
          {view === 'checklist' && <ChecklistView {...{ dubai, toggleDubai, S }} />}
          {view === 'profile' && <ProfileView S={S} />}
        </div>
      </div>
    </>
  );
}

function TodayView({ cycle, cycleDay, intention, saveIntention, habits, toggleHabit, S }) {
  const done = HABITS.filter(h => habits[h.id]).length;
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '26px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', fontWeight: 300, lineHeight: 1.2 }}>{greeting}, Anna.</div>
        <div style={{ fontSize: '11px', color: '#8a7d6a', marginTop: '4px' }}>{formatDate()}</div>
      </div>

      {/* Cycle card */}
      <div style={{ background: cycle.bg, border: `1px solid ${cycle.color}28`, borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <span style={{ fontSize: '26px' }}>{cycle.moon}</span>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: cycle.color }}>{cycle.phase} Phase {'\u00B7'} Day {cycleDay}</div>
            <div style={{ fontSize: '11px', color: '#8a7d6a', marginTop: '1px' }}>{cycle.energy}</div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: '#e8dcc8', marginBottom: '7px', lineHeight: 1.65 }}>{cycle.guidance}</div>
        <div style={{ fontSize: '11px', color: '#8a7d6a', fontStyle: 'italic' }}>{'\u2192'} {cycle.schedule}</div>
      </div>

      {/* Intention */}
      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="tag" style={{ color: '#8a7d6a' }}>TODAY'S INTENTION</div>
        <input className="inp" placeholder="What matters most today?" value={intention} onChange={e => saveIntention(e.target.value)} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }} />
      </div>

      {/* Habits quick */}
      <div className="card" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div className="tag" style={{ color: '#8a7d6a', marginBottom: 0 }}>TODAY'S HABITS</div>
          <span style={{ fontSize: '11px', color: '#c4a46b' }}>{done}/{HABITS.length}</span>
        </div>
        <div className="grid2">
          {HABITS.map(h => (
            <button key={h.id} className="hb" onClick={() => toggleHabit(h.id)}>
              <div className={`chk ${habits[h.id] ? 'on' : ''}`}>{habits[h.id] && <span style={{ fontSize: '9px', color: '#0a0906' }}>{'\u2713'}</span>}</div>
              <span style={{ fontSize: '11px', color: habits[h.id] ? '#e8dcc8' : '#7a7060' }}>{h.icon} {h.label}</span>
            </button>
          ))}
        </div>
        <div className="bar" style={{ marginTop: '10px' }}>
          <div className="fill" style={{ width: `${(done/HABITS.length)*100}%`, background: '#c4a46b' }} />
        </div>
      </div>

      {/* Rhythm */}
      <div className="card">
        <div className="tag" style={{ color: '#8a7d6a' }}>DAILY RHYTHM</div>
        {[
          { t: '5\u20136 AM', l: 'Wake & Stillness', d: 'No phone. Water. Arrive slowly.', c: '#9b7fa8' },
          { t: '6\u20137 AM', l: 'Morning Practice', d: 'Meditation, movement, altar \u2014 before everything', c: '#c4a46b' },
          { t: '7\u20139:30', l: 'Deep Work I \u{1F534}', d: 'Peak energy \u2014 SyncHer, strategy', c: '#bf8a8a' },
          { t: '9:45\u201312', l: 'Deep Work II \u{1F534}', d: 'Seraya Studio, calls, build', c: '#bf8a8a' },
          { t: '12\u20131:30', l: 'Lunch & Real Rest', d: 'No screens. Legs up. Let the morning land.', c: '#7fa88a' },
          { t: '1:30\u20133:30', l: 'Light Work \u{1F7E1}', d: 'Email, admin, research', c: '#8a9fbf' },
          { t: '3:45\u20135:30', l: 'Creative / Body \u{1F7E2}', d: 'Content, movement, practice, play', c: '#7fa88a' },
          { t: '7:30 PM+', l: 'Protected Evening \u{1F319}', d: 'No electronics. Reading. Rest.', c: '#9b7fa8' },
        ].map((r, i, arr) => (
          <div key={i} style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: i < arr.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ fontSize: '10px', color: '#6a6055', width: '72px', flexShrink: 0, paddingTop: '2px', fontVariantNumeric: 'tabular-nums' }}>{r.t}</div>
            <div>
              <div style={{ fontSize: '12px', color: r.c, marginBottom: '1px' }}>{r.l}</div>
              <div style={{ fontSize: '11px', color: '#6a6055' }}>{r.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekView({ weekNotes, saveWeekNote, cycleDay, cycle, S }) {
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();
  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={S.pageTitle}>This Week</div>
      <div style={S.pageSub}>{cycle.moon} {cycle.phase} {'\u00B7'} Day {cycleDay} {'\u2014'} {cycle.schedule}</div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {WEEK_PLAN.map((d, i) => (
          <div key={d.day} className="card" style={{ borderColor: i === todayIdx ? 'rgba(196,164,107,0.28)' : 'rgba(196,164,107,0.1)', background: i === todayIdx ? 'rgba(196,164,107,0.05)' : 'rgba(255,255,255,0.028)' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '34px', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', color: i === todayIdx ? '#c4a46b' : '#8a7d6a', fontWeight: 500 }}>{d.day}</div>
                {i === todayIdx && <div style={{ fontSize: '8px', color: '#c4a46b', letterSpacing: '0.07em' }}>TODAY</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#e8dcc8', marginBottom: '2px', fontWeight: 500 }}>{d.focus}</div>
                <div style={{ fontSize: '11px', color: '#6a6055', marginBottom: '8px' }}>{d.detail}</div>
                <textarea className="inp" placeholder="Notes\u2026" value={weekNotes[d.day] || ''} onChange={e => saveWeekNote(d.day, e.target.value)} style={{ minHeight: '36px', fontSize: '11px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitsView({ habits, toggleHabit, S }) {
  const done = HABITS.filter(h => habits[h.id]).length;
  const groups = [
    { key: 'spiritual', label: 'SPIRITUAL', color: '#9b7fa8' },
    { key: 'body', label: 'BODY', color: '#7fa88a' },
    { key: 'structure', label: 'STRUCTURE', color: '#8a9fbf' },
    { key: 'business', label: 'BUSINESS', color: '#c4a46b' },
  ];
  return (
    <div style={{ maxWidth: '580px' }}>
      <div style={S.pageTitle}>Daily Habits</div>
      <div style={{ fontSize: '11px', color: '#8a7d6a', marginBottom: '18px' }}>{done} of {HABITS.length} complete today</div>
      <div className="bar" style={{ height: '5px', marginBottom: '22px' }}>
        <div className="fill" style={{ width: `${(done/HABITS.length)*100}%`, background: 'linear-gradient(90deg,#c4a46b,#dbb87a)' }} />
      </div>
      {groups.map(g => (
        <div key={g.key} className="card" style={{ marginBottom: '10px', borderColor: `${g.color}22` }}>
          <div className="tag" style={{ color: g.color }}>{g.label}</div>
          {HABITS.filter(h => h.pillar === g.key).map(h => (
            <button key={h.id} className="hb" onClick={() => toggleHabit(h.id)}>
              <div className={`chk ${habits[h.id] ? 'on' : ''}`} style={{ borderColor: habits[h.id] ? g.color : 'rgba(196,164,107,0.28)', background: habits[h.id] ? g.color : 'transparent' }}>
                {habits[h.id] && <span style={{ fontSize: '9px', color: '#0a0906' }}>{'\u2713'}</span>}
              </div>
              <span style={{ fontSize: '12px', color: habits[h.id] ? '#e8dcc8' : '#7a7060' }}>{h.icon} {h.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProjectsView({ projects, toggleMilestone, S }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ maxWidth: '740px' }}>
      <div style={S.pageTitle}>Projects</div>
      <div style={S.pageSub}>2026 build map {'\u2014'} click a project to expand milestones</div>
      <div style={{ display: 'grid', gap: '14px' }}>
        {projects.map(p => {
          const done = p.milestones.filter(m => m.done).length;
          const pct = Math.round((done / p.milestones.length) * 100);
          const open = expanded === p.id;
          return (
            <div key={p.id} className="card" style={{ borderColor: `${p.color}22` }}>
              <button className="nb" style={{ width: '100%', textAlign: 'left' }} onClick={() => setExpanded(open ? null : p.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <span style={{ fontSize: '20px' }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '19px', color: p.color }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#6a6055' }}>{p.tagline}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '12px' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: p.color, lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: '10px', color: '#6a6055', marginTop: '2px' }}>{'\u2197\uFE0F'} {p.deadline}</div>
                  </div>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
                <div style={{ fontSize: '10px', color: '#6a6055', marginTop: '5px' }}>{done}/{p.milestones.length} milestones {'\u00B7'} {open ? '\u25B2 collapse' : '\u25BC expand'}</div>
              </button>
              {open && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="grid2">
                    {p.milestones.map(m => (
                      <button key={m.id} className="hb" style={{ padding: '7px 8px' }} onClick={() => toggleMilestone(p.id, m.id)}>
                        <div className={`chk ${m.done ? 'on' : ''}`} style={{ width: '16px', height: '16px', borderColor: m.done ? p.color : 'rgba(196,164,107,0.24)', background: m.done ? p.color : 'transparent' }}>
                          {m.done && <span style={{ fontSize: '8px', color: '#0a0906' }}>{'\u2713'}</span>}
                        </div>
                        <span style={{ fontSize: '11px', color: m.done ? '#8a7d6a' : '#e8dcc8', textDecoration: m.done ? 'line-through' : 'none' }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PillarsView({ S }) {
  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={S.pageTitle}>Five Pillars</div>
      <div style={S.pageSub}>2026 Foundation Year {'\u2014'} the structure under everything</div>
      <div style={{ display: 'grid', gap: '12px' }}>
        {PILLARS.map(p => (
          <div key={p.id} className="card" style={{ borderColor: `${p.color}22` }}>
            <div style={{ display: 'flex', gap: '11px', marginBottom: '11px' }}>
              <span style={{ fontSize: '22px' }}>{p.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: p.color }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: '#6a6055', marginTop: '1px' }}>{p.desc}</div>
              </div>
            </div>
            <div className="grid2" style={{ gap: '6px', marginBottom: '10px' }}>
              {p.actions.map((a, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#8a7d6a', padding: '6px 9px', background: 'rgba(255,255,255,0.025)', borderRadius: '6px', borderLeft: `2px solid ${p.color}35` }}>{a}</div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#5a5548', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '9px', lineHeight: 1.65 }}>{p.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistView({ dubai, toggleDubai, S }) {
  const cats = [...new Set(DUBAI.map(d => d.cat))];
  const done = DUBAI.filter(d => dubai[d.id]).length;
  const pct = Math.round((done / DUBAI.length) * 100);
  return (
    <div style={{ maxWidth: '580px' }}>
      <div style={S.pageTitle}>Dubai Exit</div>
      <div style={S.pageSub}>Out by May 21, 2026 {'\u00B7'} Back in Dubai May 8</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: '#c4a46b', lineHeight: 1 }}>{pct}%</div>
        <div style={{ flex: 1 }}>
          <div className="bar" style={{ height: '5px' }}>
            <div className="fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#c4a46b,#dbb87a)' }} />
          </div>
          <div style={{ fontSize: '10px', color: '#8a7d6a', marginTop: '4px' }}>{done} of {DUBAI.length} complete</div>
        </div>
      </div>
      {cats.map(cat => (
        <div key={cat} className="card" style={{ marginBottom: '10px' }}>
          <div className="tag" style={{ color: '#c4a46b' }}>{cat.toUpperCase()}</div>
          {DUBAI.filter(d => d.cat === cat).map(item => (
            <button key={item.id} className="hb" onClick={() => toggleDubai(item.id)}>
              <div className={`chk ${dubai[item.id] ? 'on' : ''}`}>{dubai[item.id] && <span style={{ fontSize: '9px', color: '#0a0906' }}>{'\u2713'}</span>}</div>
              <span style={{ fontSize: '12px', color: dubai[item.id] ? '#6a6055' : '#e8dcc8', textDecoration: dubai[item.id] ? 'line-through' : 'none' }}>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProfileView({ S }) {
  return (
    <div style={{ maxWidth: '660px' }}>
      <div style={S.pageTitle}>Anna</div>
      <div style={S.pageSub}>The full picture</div>

      <div className="card" style={{ marginBottom: '12px', borderColor: 'rgba(196,164,107,0.2)' }}>
        <div className="tag" style={{ color: '#c4a46b' }}>HUMAN DESIGN</div>
        <div className="grid2" style={{ marginBottom: '10px' }}>
          {[['Type','Manifesting Generator'],['Profile','4/1 \u2014 Opportunist / Investigator'],['Authority','Emotional Solar Plexus'],['Strategy','Respond \u2014 wait for the sacral yes']].map(([k,v]) => (
            <div key={k} className="pill"><div className="label">{k}</div><div style={{ fontSize: '13px', color: '#e8dcc8' }}>{v}</div></div>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#6a6055', lineHeight: 1.7, fontStyle: 'italic' }}>The 4/1 MG needs depth before breadth. The 1-line investigator: your foundation must be real, not decorative. You only flourish when you respond {'\u2014'} not force. Your sacral knows before your mind does.</div>
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="tag" style={{ color: '#9b7fa8' }}>ASTROLOGY {'\u2014'} Born 25 Sept 1995, 12:45 PM {'\u00B7'} Rohrbach-Berg, Austria</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {[
            ['Sun \u264E','Libra'],['Moon \u264E','Libra'],['Rising \u2650','Sagittarius'],
            ['Venus \u264E','Libra'],['Mercury \u264E','Libra'],['Mars \u264F','Scorpio'],
            ['Jupiter \u2650','Sagittarius'],['Midheaven \u264E','Libra'],['Pluto \u264F','Scorpio'],
          ].map(([k,v]) => (
            <div key={k} className="pill" style={{ textAlign: 'center' }}><div className="label">{k}</div><div style={{ fontSize: '12px', color: '#e8dcc8' }}>{v}</div></div>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#6a6055', lineHeight: 1.7, fontStyle: 'italic' }}>
          Quadruple Libra (Sun, Moon, Venus, Mercury) {'\u2014'} beauty, balance, harmony and relationships are the core operating system. Jupiter in Sagittarius conjunct Ascendant (16{'\u00B0'}47'): expansion, luck, and philosophy are literally written into how you enter every room. Mars in Scorpio: intensity and depth underneath all that Libra grace. Midheaven Libra: your public purpose is beauty, balance, and harmony.
        </div>
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="tag" style={{ color: '#c4a46b' }}>2026 COSMIC FRAMEWORK</div>
        <div className="grid2" style={{ marginBottom: '10px' }}>
          {[
            ['Personal Year','8 \u2014 Power & Harvest','Claim your authority. Manifest. Financial abundance.'],
            ['Universal Year','1 \u2014 New Terrain','Everyone restarting \u2014 build on fresh ground'],
            ['Chinese Year','Wood Horse','Momentum, instinct, bold steps, heart-opening'],
            ['Synthesis','Power + Structure','Reap what you\'ve built. Step into authority. Be seen.'],
          ].map(([k,v,n]) => (
            <div key={k} className="pill"><div className="label">{k}</div><div style={{ fontSize: '13px', color: '#c4a46b', marginBottom: '3px' }}>{v}</div><div style={{ fontSize: '10px', color: '#6a6055', fontStyle: 'italic' }}>{n}</div></div>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#6a6055', lineHeight: 1.7, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '9px' }}>Year 8 is the harvest year {'\u2014'} you've been planting. Now you claim the power and recognition. The filter: "Does my 2030 self thank me for this decision?"</div>
      </div>

      <div className="card">
        <div className="tag" style={{ color: '#8a7d6a' }}>THE WOMAN</div>
        <div className="grid2" style={{ marginBottom: '12px' }}>
          {[['Base','Dubai \u2192 Amsterdam \u2192 Zug'],['Partner','Enrica'],['Companion','Ruby the dachshund \u{1F43E}'],['Passport','Austrian (EU citizen)'],['Teaching','Sound healing at HWH Dubai'],['Trained in','PT \u00B7 Yoga \u00B7 Reiki \u00B7 Somatic \u00B7 Meditation'],['Vipassanas','5 completed'],['Facilitating','Africa Burn Apr 2026']].map(([k,v]) => (
            <div key={k} className="pill"><div className="label">{k}</div><div style={{ fontSize: '12px', color: '#e8dcc8' }}>{v}</div></div>
          ))}
        </div>
        <div style={{ padding: '11px', background: 'rgba(196,164,107,0.05)', borderRadius: '8px', borderLeft: '2px solid rgba(196,164,107,0.3)', fontSize: '12px', color: '#8a7d6a', lineHeight: 1.75, fontStyle: 'italic' }}>
          "Women run on 28-day cycles, not 24-hour cycles." {'\u2014'} The core message and the spine of everything. The transformation arc from overtraining and inflammation to somatic healer and educator is the story she tells, lives, and teaches.
        </div>
      </div>
    </div>
  );
}
