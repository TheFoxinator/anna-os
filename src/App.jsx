import { useState, useEffect } from "react";
import './App.css';

/* ===== DATA ===== */

const ANNA = { lastPeriod: "2026-03-17", cycleLength: 29 };

const getDayOfCycle = () => {
  const start = new Date(ANNA.lastPeriod);
  const now = new Date();
  start.setHours(0,0,0,0); now.setHours(0,0,0,0);
  return Math.floor((now - start) / 86400000) + 1;
};

const getCyclePhase = (day) => {
  const d = ((day - 1) % ANNA.cycleLength) + 1;
  if (d <= 5) return { phase: "Menstrual", moon: "\u{1F311}", color: "#9b7fa8", energy: "Inward & restorative", guidance: "Rest without guilt. Reflect. No output pressure.", schedule: "Minimum viable work. More rest blocks. No forcing.", pastel: "var(--pastel-purple)" };
  if (d <= 13) return { phase: "Follicular", moon: "\u{1F312}", color: "#7fa88a", energy: "Rising & sharp", guidance: "Start new things. Build. Think strategically.", schedule: "Maximum deep work. Begin new SyncHer modules. Strategy.", pastel: "var(--pastel-green)" };
  if (d <= 17) return { phase: "Ovulatory", moon: "\u{1F315}", color: "#c4a46b", energy: "Peak & magnetic", guidance: "Be seen. Film everything. Connect and pitch.", schedule: "Film TikToks + YouTube. All calls + collaborations.", pastel: "var(--pastel-yellow)" };
  return { phase: "Luteal", moon: "\u{1F317}", color: "#a48b6b", energy: "Focused & finishing", guidance: "Complete, edit, wrap up. Protect your energy.", schedule: "Admin, editing, Seraya tasks. Wind down early.", pastel: "var(--pastel-yellow)" };
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

const DAILY_RHYTHM = [
  { t: '5\u20136 AM', l: 'Wake & Stillness', d: 'No phone. Water. Arrive slowly.', c: '#9b7fa8' },
  { t: '6\u20137 AM', l: 'Morning Practice', d: 'Meditation, movement, altar', c: '#c4a46b' },
  { t: '7\u20139:30', l: 'Deep Work I', d: 'Peak energy \u2014 SyncHer, strategy', c: '#bf8a8a' },
  { t: '9:45\u201312', l: 'Deep Work II', d: 'Seraya Studio, calls, build', c: '#bf8a8a' },
  { t: '12\u20131:30', l: 'Lunch & Rest', d: 'No screens. Legs up the wall.', c: '#7fa88a' },
  { t: '1:30\u20133:30', l: 'Light Work', d: 'Email, admin, research', c: '#8a9fbf' },
  { t: '3:45\u20135:30', l: 'Creative / Body', d: 'Content, movement, play', c: '#7fa88a' },
  { t: '7:30 PM+', l: 'Protected Evening', d: 'No electronics. Reading. Rest.', c: '#9b7fa8' },
];

const DEFAULT_FINANCE = {
  accounts: [
    { id: 'wise_eur', name: 'Wise EUR', balance: 4250.00, currency: 'EUR', icon: '\u{1F4B6}', color: '#00B3A4' },
    { id: 'wise_usd', name: 'Wise USD', balance: 1820.50, currency: 'USD', icon: '\u{1F4B5}', color: '#6B4FBB' },
    { id: 'wio', name: 'Wio Business', balance: 12500.00, currency: 'AED', icon: '\u{1F3E6}', color: '#C4A46B' },
  ],
  transactions: [
    { id: 't1', label: 'Seraya supplier payment', amount: -3200, currency: 'AED', date: 'Apr 14', cat: 'business', icon: '\u{1FAA8}' },
    { id: 't2', label: 'Freelance income', amount: 1500, currency: 'EUR', date: 'Apr 13', cat: 'income', icon: '\u{1F4B0}' },
    { id: 't3', label: 'Wise transfer', amount: -500, currency: 'EUR', date: 'Apr 12', cat: 'transfer', icon: '\u{1F4B3}' },
    { id: 't4', label: 'Gym membership', amount: -89, currency: 'AED', date: 'Apr 10', cat: 'health', icon: '\u{1F4AA}' },
    { id: 't5', label: 'Domain renewal', amount: -24, currency: 'USD', date: 'Apr 9', cat: 'business', icon: '\u{1F310}' },
  ],
};

const CALENDAR_EVENTS = [
  { hour: 6, name: 'Morning Practice', detail: 'Meditation + movement', color: '#c4a46b', bg: 'var(--pastel-yellow)' },
  { hour: 9, name: 'SyncHer deep work', detail: 'Landing page copy', color: '#8a9fbf', bg: 'var(--pastel-blue)' },
  { hour: 11, name: 'Seraya call', detail: 'Supplier follow-up', color: '#c4a46b', bg: 'var(--pastel-peach)' },
  { hour: 15, name: 'Content block', detail: 'Film + edit', color: '#bf8a8a', bg: 'var(--pastel-pink)' },
];

/* ===== HELPERS ===== */

function load(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function save(key, val) {
  try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); } catch {}
}

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // Monday = 0
  const days = [];
  // Previous month fill
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) days.push({ d: prevLast - i, current: false });
  // Current month
  for (let i = 1; i <= last.getDate(); i++) days.push({ d: i, current: true });
  // Next month fill
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push({ d: i, current: false });
  return days;
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ===== MAIN APP ===== */

export default function AnnaOS() {
  const [view, setView] = useState('today');
  const [theme, setTheme] = useState(() => load('anna:theme') || 'light');
  const [calOpen, setCalOpen] = useState(true);
  const [habits, setHabits] = useState({});
  const [dubai, setDubai] = useState({});
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [weekNotes, setWeekNotes] = useState({});
  const [intention, setIntention] = useState('');
  const [finance, setFinance] = useState(DEFAULT_FINANCE);
  const [loaded, setLoaded] = useState(false);

  const dateKey = new Date().toISOString().split('T')[0];
  const cycleDay = getDayOfCycle();
  const cycle = getCyclePhase(cycleDay);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    save('anna:theme', theme);
  }, [theme]);

  // Load persisted data
  useEffect(() => {
    try { const d = load(`anna:habits:${dateKey}`); if (d) setHabits(JSON.parse(d)); } catch {}
    try { const d = load('anna:dubai'); if (d) setDubai(JSON.parse(d)); } catch {}
    try { const d = load('anna:weeknotes'); if (d) setWeekNotes(JSON.parse(d)); } catch {}
    try { const d = load(`anna:intention:${dateKey}`); if (d) setIntention(d); } catch {}
    try {
      const d = load('anna:projects');
      if (d) {
        const saved = JSON.parse(d);
        setProjects(prev => prev.map(p => {
          const sp = saved.find(s => s.id === p.id);
          if (!sp) return p;
          return { ...p, milestones: p.milestones.map(m => { const sm = sp.milestones?.find(x => x.id === m.id); return sm ? { ...m, done: sm.done } : m; }) };
        }));
      }
    } catch {}
    try { const d = load('anna:finance'); if (d) setFinance(JSON.parse(d)); } catch {}
    setLoaded(true);
  }, []);

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
    { id: 'week', label: 'Week', icon: '\u25A1' },
    { id: 'habits', label: 'Habits', icon: '\u25C8' },
    { id: 'projects', label: 'Projects', icon: '\u25EB' },
    { id: 'finance', label: 'Finance', icon: '\u{1F4B0}' },
    { id: 'pillars', label: 'Pillars', icon: '\u25E7' },
    { id: 'checklist', label: 'Dubai Exit', icon: '\u2713' },
    { id: 'profile', label: 'Profile', icon: '\u25CE' },
  ];

  if (!loaded) return <div className="loading-screen">ANNA OS</div>;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h1>Anna OS</h1>
          <span>2026 FOUNDATIONS</span>
        </div>

        <div className="nav-section-label">Overview</div>
        {NAV.slice(0, 4).map(n => (
          <button key={n.id} className={`nav-btn ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}

        <div className="nav-section-label">Manage</div>
        {NAV.slice(4).map(n => (
          <button key={n.id} className={`nav-btn ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="cycle-badge" style={{ borderColor: `${cycle.color}30` }}>
            <div className="moon">{cycle.moon}</div>
            <div className="phase-name" style={{ color: cycle.color }}>{cycle.phase.toUpperCase()}</div>
            <div className="day-num">Day {cycleDay}</div>
          </div>
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {view === 'today' && <TodayView {...{ cycle, cycleDay, intention, saveIntention, habits, toggleHabit }} />}
        {view === 'week' && <WeekView {...{ weekNotes, saveWeekNote, cycleDay, cycle }} />}
        {view === 'habits' && <HabitsView {...{ habits, toggleHabit }} />}
        {view === 'projects' && <ProjectsView {...{ projects, toggleMilestone }} />}
        {view === 'finance' && <FinanceView finance={finance} />}
        {view === 'pillars' && <PillarsView />}
        {view === 'checklist' && <ChecklistView {...{ dubai, toggleDubai }} />}
        {view === 'profile' && <ProfileView />}
      </main>

      {/* Calendar Panel */}
      <aside className={`calendar-panel ${calOpen ? '' : 'collapsed'}`}>
        <CalendarPanel />
      </aside>

      {/* Toggle Calendar Button */}
      <button className="toggle-panel-btn" onClick={() => setCalOpen(c => !c)}>
        {calOpen ? '\u{1F4C5} \u2715' : '\u{1F4C5}'}
      </button>
    </div>
  );
}

/* ===== CALENDAR PANEL ===== */

function CalendarPanel() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const today = now.getDate();
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
  const days = getCalendarDays(year, month);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const timelineHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const formatHour = (h) => { if (h === 0) return '12 AM'; if (h < 12) return `${h}:00`; if (h === 12) return '12:00'; return `${h - 12}:00`; };

  return (
    <>
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prev}>{'\u2039'}</button>
        <h3>{MONTH_NAMES[month]} {year}</h3>
        <button className="cal-nav-btn" onClick={next}>{'\u203A'}</button>
      </div>
      <div className="cal-grid">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d} className="cal-day-label">{d}</div>)}
        {days.map((d, i) => (
          <div key={i} className={`cal-day ${d.current && d.d === today && isCurrentMonth ? 'today' : ''} ${!d.current ? 'other-month' : ''}`}>
            {d.d}
          </div>
        ))}
      </div>

      <button className="cal-add-event">+ Add event</button>

      <div className="timeline-title">{MONTH_NAMES[now.getMonth()]} {now.getDate()}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div className="timeline-date">Today's timeline</div>
      </div>

      <div className="timeline">
        {timelineHours.map(h => {
          const event = CALENDAR_EVENTS.find(e => e.hour === h);
          return (
            <div key={h} className="timeline-hour">
              <div className="timeline-hour-label">{formatHour(h)}</div>
              {event && (
                <div className="timeline-event" style={{ background: event.bg, borderLeftColor: event.color, color: event.color }}>
                  <div className="te-name">{event.name}</div>
                  <div className="te-detail" style={{ color: 'var(--text-tertiary)' }}>{event.detail}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="cal-hint">
        {'\u{1F4A1}'} Connect Google Calendar for live events. API integration ready {'\u2014'} just add your credentials.
      </div>
    </>
  );
}

/* ===== TODAY VIEW ===== */

function TodayView({ cycle, cycleDay, intention, saveIntention, habits, toggleHabit }) {
  const done = HABITS.filter(h => habits[h.id]).length;
  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const pct = Math.round((done / HABITS.length) * 100);

  // Project stats
  const projectsDone = DEFAULT_PROJECTS.reduce((a, p) => a + p.milestones.filter(m => m.done).length, 0);
  const projectsTotal = DEFAULT_PROJECTS.reduce((a, p) => a + p.milestones.length, 0);
  const projectPct = Math.round((projectsDone / projectsTotal) * 100);

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <div className="page-title" style={{ fontSize: 36, fontWeight: 700, marginBottom: 6 }}>{greeting}, Anna.</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {formatDate()}. {cycle.guidance}
        </div>
      </div>

      {/* 2x2 Widget Cards - Intelly style */}
      <div className="widget-grid">
        {/* Cycle Widget */}
        <div className="widget" style={{ background: 'var(--pastel-purple)', color: 'var(--pastel-purple-text)' }}>
          <div>
            <div className="widget-header">{cycle.phase} Phase:</div>
            <div className="widget-stats">
              <div className="widget-stat-item">
                <div className="widget-stat-value">{cycle.moon} Day {cycleDay}</div>
                <div className="widget-stat-label">{cycle.energy}</div>
              </div>
            </div>
          </div>
          <div className="widget-footer">{'\u2192'} {cycle.schedule}</div>
        </div>

        {/* Habits Widget */}
        <div className="widget" style={{ background: 'var(--pastel-green)', color: 'var(--pastel-green-text)' }}>
          <div>
            <div className="widget-header">Habits today:</div>
            <div className="widget-stats">
              <div className="widget-stat-item">
                <div className="widget-stat-value">{done} done</div>
                <div className="widget-stat-label">of {HABITS.length} habits</div>
              </div>
              <div className="widget-stat-item">
                <div className="widget-stat-value">{pct}%</div>
                <div className="widget-stat-label">complete</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--pastel-green-text)' }} />
            </div>
          </div>
        </div>

        {/* Projects Widget */}
        <div className="widget" style={{ background: 'var(--pastel-yellow)', color: 'var(--pastel-yellow-text)' }}>
          <div>
            <div className="widget-header">Projects:</div>
            <div className="widget-stats">
              <div className="widget-stat-item">
                <div className="widget-stat-value">5 active</div>
                <div className="widget-stat-label">projects</div>
              </div>
              <div className="widget-stat-item">
                <div className="widget-stat-value">{projectPct}%</div>
                <div className="widget-stat-label">milestones done</div>
              </div>
            </div>
          </div>
          <div className="widget-footer">Seraya Studio focus this week</div>
        </div>

        {/* Schedule Widget */}
        <div className="widget" style={{ background: 'var(--pastel-pink)', color: 'var(--pastel-pink-text)' }}>
          <div>
            <div className="widget-header">Today's schedule:</div>
            <div className="widget-stats" style={{ flexDirection: 'column', gap: 6 }}>
              {CALENDAR_EVENTS.slice(0, 3).map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12 }}>{e.hour < 12 ? e.hour + ':00' : (e.hour - 12 || 12) + ':00'} {'\u2014'} {e.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="widget-footer">{CALENDAR_EVENTS.length} events today</div>
        </div>
      </div>

      {/* Intention */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-tag" style={{ color: 'var(--text-tertiary)' }}>TODAY'S INTENTION</div>
        <input className="input" placeholder="What matters most today?" value={intention} onChange={e => saveIntention(e.target.value)} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }} />
      </div>

      {/* Habits Quick */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="section-tag" style={{ color: 'var(--text-tertiary)', marginBottom: 0 }}>TODAY'S HABITS</div>
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{done}/{HABITS.length}</span>
        </div>
        <div className="grid-2">
          {HABITS.map(h => (
            <button key={h.id} className="habit-btn" onClick={() => toggleHabit(h.id)}>
              <div className={`check ${habits[h.id] ? 'checked' : ''}`}>{habits[h.id] && '\u2713'}</div>
              <span style={{ fontSize: 13, color: habits[h.id] ? 'var(--text)' : 'var(--text-secondary)' }}>{h.icon} {h.label}</span>
            </button>
          ))}
        </div>
        <div className="progress-bar" style={{ marginTop: 14, height: 6 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c4a46b, #dbb87a)' }} />
        </div>
      </div>

      {/* Daily Rhythm */}
      <div className="card">
        <div className="section-tag" style={{ color: 'var(--text-tertiary)' }}>DAILY RHYTHM</div>
        {DAILY_RHYTHM.map((r, i) => (
          <div key={i} className="rhythm-item">
            <div className="rhythm-time">{r.t}</div>
            <div className="rhythm-dot" style={{ background: r.c }} />
            <div className="rhythm-info">
              <div className="rhythm-label">{r.l}</div>
              <div className="rhythm-desc">{r.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== WEEK VIEW ===== */

function WeekView({ weekNotes, saveWeekNote, cycleDay, cycle }) {
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();
  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-title">This Week</div>
      <div className="page-subtitle">{cycle.moon} {cycle.phase} {'\u00B7'} Day {cycleDay} {'\u2014'} {cycle.schedule}</div>
      <div style={{ display: 'grid', gap: 10 }}>
        {WEEK_PLAN.map((d, i) => (
          <div key={d.day} className="card" style={{ borderLeft: i === todayIdx ? '3px solid var(--accent)' : '3px solid transparent' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 40, flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: i === todayIdx ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600 }}>{d.day}</div>
                {i === todayIdx && <div style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.07em', marginTop: 2 }}>TODAY</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 2, fontWeight: 500 }}>{d.focus}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>{d.detail}</div>
                <textarea className="input" placeholder="Notes\u2026" value={weekNotes[d.day] || ''} onChange={e => saveWeekNote(d.day, e.target.value)} style={{ minHeight: 36, fontSize: 12 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== HABITS VIEW ===== */

function HabitsView({ habits, toggleHabit }) {
  const done = HABITS.filter(h => habits[h.id]).length;
  const groups = [
    { key: 'spiritual', label: 'SPIRITUAL', color: '#9b7fa8', pastel: 'var(--pastel-purple)' },
    { key: 'body', label: 'BODY', color: '#7fa88a', pastel: 'var(--pastel-green)' },
    { key: 'structure', label: 'STRUCTURE', color: '#8a9fbf', pastel: 'var(--pastel-blue)' },
    { key: 'business', label: 'BUSINESS', color: '#c4a46b', pastel: 'var(--pastel-yellow)' },
  ];
  return (
    <div style={{ maxWidth: 620 }}>
      <div className="page-title">Daily Habits</div>
      <div className="page-subtitle">{done} of {HABITS.length} complete today</div>
      <div className="progress-bar" style={{ height: 6, marginBottom: 24 }}>
        <div className="progress-fill" style={{ width: `${(done/HABITS.length)*100}%`, background: 'linear-gradient(90deg,#c4a46b,#dbb87a)' }} />
      </div>
      {groups.map(g => {
        const items = HABITS.filter(h => h.pillar === g.key);
        const groupDone = items.filter(h => habits[h.id]).length;
        return (
          <div key={g.key} className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${g.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="section-tag" style={{ color: g.color, marginBottom: 0 }}>{g.label}</div>
              <span style={{ fontSize: 11, color: g.color }}>{groupDone}/{items.length}</span>
            </div>
            {items.map(h => (
              <button key={h.id} className="habit-btn" onClick={() => toggleHabit(h.id)}>
                <div className={`check ${habits[h.id] ? 'checked' : ''}`} style={{ borderColor: habits[h.id] ? g.color : undefined, background: habits[h.id] ? g.color : undefined }}>
                  {habits[h.id] && '\u2713'}
                </div>
                <span style={{ fontSize: 13, color: habits[h.id] ? 'var(--text)' : 'var(--text-secondary)' }}>{h.icon} {h.label}</span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ===== PROJECTS VIEW ===== */

function ProjectsView({ projects, toggleMilestone }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-title">Projects</div>
      <div className="page-subtitle">2026 build map {'\u2014'} click to expand milestones</div>
      <div style={{ display: 'grid', gap: 14 }}>
        {projects.map(p => {
          const done = p.milestones.filter(m => m.done).length;
          const pct = Math.round((done / p.milestones.length) * 100);
          const open = expanded === p.id;
          return (
            <div key={p.id} className="card">
              <button style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={() => setExpanded(open ? null : p.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: p.color, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{p.tagline}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 12 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: p.color, lineHeight: 1, fontWeight: 500 }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{'\u2197\uFE0F'} {p.deadline}</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>{done}/{p.milestones.length} milestones {'\u00B7'} {open ? '\u25B2 collapse' : '\u25BC expand'}</div>
              </button>
              {open && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div className="grid-2">
                    {p.milestones.map(m => (
                      <button key={m.id} className="habit-btn" style={{ padding: '7px 8px' }} onClick={() => toggleMilestone(p.id, m.id)}>
                        <div className={`check ${m.done ? 'checked' : ''}`} style={{ width: 18, height: 18, borderColor: m.done ? p.color : undefined, background: m.done ? p.color : undefined }}>
                          {m.done && <span style={{ fontSize: 9 }}>{'\u2713'}</span>}
                        </div>
                        <span style={{ fontSize: 12, color: m.done ? 'var(--text-tertiary)' : 'var(--text)', textDecoration: m.done ? 'line-through' : 'none' }}>{m.label}</span>
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

/* ===== FINANCE VIEW ===== */

function FinanceView({ finance }) {
  const totalEUR = finance.accounts.find(a => a.id === 'wise_eur')?.balance || 0;
  const totalUSD = finance.accounts.find(a => a.id === 'wise_usd')?.balance || 0;
  const totalAED = finance.accounts.find(a => a.id === 'wio')?.balance || 0;

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-title">Finance</div>
      <div className="page-subtitle">Account balances & recent transactions</div>

      {/* Account Cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {finance.accounts.map(a => (
          <div key={a.id} className="stat-card card-colored" style={{ background: `${a.color}12`, border: `1px solid ${a.color}20` }}>
            <div className="stat-label" style={{ color: a.color }}>{a.icon} {a.name}</div>
            <div className="stat-value" style={{ color: a.color }}>{a.currency === 'EUR' ? '\u20AC' : a.currency === 'USD' ? '$' : 'AED '}{a.balance.toLocaleString('en', { minimumFractionDigits: 2 })}</div>
            <div className="stat-sub" style={{ color: a.color }}>Current balance</div>
          </div>
        ))}
      </div>

      {/* Total Overview */}
      <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--accent)' }}>
        <div className="section-tag" style={{ color: 'var(--accent)' }}>TOTAL OVERVIEW</div>
        <div className="grid-3">
          <div className="pill">
            <div className="pill-label">EUR Balance</div>
            <div className="pill-value" style={{ fontWeight: 500 }}>{'\u20AC'}{totalEUR.toLocaleString('en', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="pill">
            <div className="pill-label">USD Balance</div>
            <div className="pill-value" style={{ fontWeight: 500 }}>${totalUSD.toLocaleString('en', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="pill">
            <div className="pill-label">AED Balance</div>
            <div className="pill-value" style={{ fontWeight: 500 }}>AED {totalAED.toLocaleString('en', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-tag" style={{ color: 'var(--text-tertiary)' }}>RECENT TRANSACTIONS</div>
        {finance.transactions.map(tx => (
          <div key={tx.id} className="transaction-row">
            <div className="tx-icon" style={{ background: 'var(--skeleton)' }}>{tx.icon}</div>
            <div className="tx-info">
              <div className="tx-label">{tx.label}</div>
              <div className="tx-date">{tx.date} {'\u00B7'} {tx.cat}</div>
            </div>
            <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.currency === 'EUR' ? '\u20AC' : tx.currency === 'USD' ? '$' : 'AED '}{Math.abs(tx.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* API Connection Note */}
      <div className="card" style={{ background: 'var(--skeleton)', border: 'none', boxShadow: 'none' }}>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          {'\u{1F4A1}'} <strong>Connect your accounts:</strong> Wise API is available for live balances. Wio requires manual entry for now. Balances shown above are placeholder data {'\u2014'} update them in the Finance settings once API keys are configured.
        </div>
      </div>
    </div>
  );
}

/* ===== PILLARS VIEW ===== */

function PillarsView() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div className="page-title">Five Pillars</div>
      <div className="page-subtitle">2026 Foundation Year {'\u2014'} the structure under everything</div>
      <div style={{ display: 'grid', gap: 14 }}>
        {PILLARS.map(p => (
          <div key={p.id} className="card" style={{ borderLeft: `3px solid ${p.color}` }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{p.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: p.color, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{p.desc}</div>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 6, marginBottom: 12 }}>
              {p.actions.map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '8px 10px', background: 'var(--skeleton)', borderRadius: 8, borderLeft: `2px solid ${p.color}40` }}>{a}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 10, lineHeight: 1.7 }}>{p.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== CHECKLIST VIEW ===== */

function ChecklistView({ dubai, toggleDubai }) {
  const cats = [...new Set(DUBAI.map(d => d.cat))];
  const done = DUBAI.filter(d => dubai[d.id]).length;
  const pct = Math.round((done / DUBAI.length) * 100);
  return (
    <div style={{ maxWidth: 620 }}>
      <div className="page-title">Dubai Exit</div>
      <div className="page-subtitle">Out by May 21, 2026 {'\u00B7'} Back in Dubai May 8</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, color: 'var(--accent)', lineHeight: 1, fontWeight: 500 }}>{pct}%</div>
        <div style={{ flex: 1 }}>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#c4a46b,#dbb87a)' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5 }}>{done} of {DUBAI.length} complete</div>
        </div>
      </div>
      {cats.map(cat => (
        <div key={cat} className="card" style={{ marginBottom: 12 }}>
          <div className="section-tag" style={{ color: 'var(--accent)' }}>{cat.toUpperCase()}</div>
          {DUBAI.filter(d => d.cat === cat).map(item => (
            <button key={item.id} className="habit-btn" onClick={() => toggleDubai(item.id)}>
              <div className={`check ${dubai[item.id] ? 'checked' : ''}`}>{dubai[item.id] && '\u2713'}</div>
              <span style={{ fontSize: 13, color: dubai[item.id] ? 'var(--text-tertiary)' : 'var(--text)', textDecoration: dubai[item.id] ? 'line-through' : 'none' }}>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ===== PROFILE VIEW ===== */

function ProfileView() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div className="page-title">Anna</div>
      <div className="page-subtitle">The full picture</div>

      <div className="card" style={{ marginBottom: 14, borderLeft: '3px solid var(--accent)' }}>
        <div className="section-tag" style={{ color: 'var(--accent)' }}>HUMAN DESIGN</div>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          {[['Type','Manifesting Generator'],['Profile','4/1 \u2014 Opportunist / Investigator'],['Authority','Emotional Solar Plexus'],['Strategy','Respond \u2014 wait for the sacral yes']].map(([k,v]) => (
            <div key={k} className="pill"><div className="pill-label">{k}</div><div className="pill-value">{v}</div></div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.7, fontStyle: 'italic' }}>The 4/1 MG needs depth before breadth. Your foundation must be real, not decorative. You only flourish when you respond {'\u2014'} not force.</div>
      </div>

      <div className="card" style={{ marginBottom: 14, borderLeft: '3px solid #9b7fa8' }}>
        <div className="section-tag" style={{ color: '#9b7fa8' }}>ASTROLOGY {'\u2014'} Born 25 Sept 1995, 12:45 PM {'\u00B7'} Rohrbach-Berg</div>
        <div className="grid-3" style={{ marginBottom: 12 }}>
          {[
            ['Sun \u264E','Libra'],['Moon \u264E','Libra'],['Rising \u2650','Sagittarius'],
            ['Venus \u264E','Libra'],['Mercury \u264E','Libra'],['Mars \u264F','Scorpio'],
            ['Jupiter \u2650','Sagittarius'],['Midheaven \u264E','Libra'],['Pluto \u264F','Scorpio'],
          ].map(([k,v]) => (
            <div key={k} className="pill" style={{ textAlign: 'center' }}><div className="pill-label">{k}</div><div className="pill-value">{v}</div></div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.7, fontStyle: 'italic' }}>
          Quadruple Libra {'\u2014'} beauty, balance, harmony are the core operating system. Jupiter in Sagittarius conjunct Ascendant: expansion and philosophy written into how you enter every room.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14, borderLeft: '3px solid var(--accent)' }}>
        <div className="section-tag" style={{ color: 'var(--accent)' }}>2026 COSMIC FRAMEWORK</div>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          {[
            ['Personal Year','8 \u2014 Power & Harvest','Claim authority. Financial abundance.'],
            ['Universal Year','1 \u2014 New Terrain','Build on fresh ground'],
            ['Chinese Year','Wood Horse','Momentum, bold steps'],
            ['Synthesis','Power + Structure','Step into authority. Be seen.'],
          ].map(([k,v,n]) => (
            <div key={k} className="pill"><div className="pill-label">{k}</div><div className="pill-value" style={{ color: 'var(--accent)', marginBottom: 2 }}>{v}</div><div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{n}</div></div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.7, fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 10 }}>Year 8 is the harvest year {'\u2014'} you've been planting. The filter: "Does my 2030 self thank me for this decision?"</div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--text-tertiary)' }}>
        <div className="section-tag" style={{ color: 'var(--text-tertiary)' }}>THE WOMAN</div>
        <div className="grid-2" style={{ marginBottom: 14 }}>
          {[['Base','Dubai \u2192 Amsterdam \u2192 Zug'],['Partner','Enrica'],['Companion','Ruby the dachshund \u{1F43E}'],['Passport','Austrian (EU citizen)'],['Teaching','Sound healing at HWH Dubai'],['Trained in','PT \u00B7 Yoga \u00B7 Reiki \u00B7 Somatic \u00B7 Meditation'],['Vipassanas','5 completed'],['Facilitating','Africa Burn Apr 2026']].map(([k,v]) => (
            <div key={k} className="pill"><div className="pill-label">{k}</div><div className="pill-value">{v}</div></div>
          ))}
        </div>
        <div style={{ padding: 14, background: 'var(--accent-soft)', borderRadius: 10, borderLeft: '2px solid var(--accent)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, fontStyle: 'italic' }}>
          "Women run on 28-day cycles, not 24-hour cycles." {'\u2014'} The core message and the spine of everything.
        </div>
      </div>
    </div>
  );
}
