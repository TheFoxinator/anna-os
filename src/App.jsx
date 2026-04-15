import { useState, useEffect, useCallback, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import {
  Home, DollarSign, Dumbbell, Droplets, Clock, Briefcase, Heart, Sprout, CalendarDays, FileText,
  Settings, Sun, Moon, ChevronLeft, ChevronRight, ChevronDown, PanelLeftClose, PanelLeft,
  TrendingUp, TrendingDown, ArrowRight, Plus, Check, X, MoreHorizontal,
  User, Star, Target, Zap, BookOpen, Lightbulb, Send, Coffee, RefreshCw,
  Activity, Scale, Utensils, GlassWater, Flame
} from "lucide-react";
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
  if (d <= 5) return { phase: "Menstrual", color: "#9b7fa8", energy: "Inward & restorative", guidance: "Rest without guilt. Reflect. No output pressure.", workout: "Gentle yoga, walking, stretching", nutrition: "Iron-rich foods, warm soups, magnesium", icon: "\uD83C\uDF11" };
  if (d <= 13) return { phase: "Follicular", color: "#7fa88a", energy: "Rising & sharp", guidance: "Start new things. Build. Think strategically.", workout: "Strength training, HIIT, try new classes", nutrition: "Light meals, fermented foods, protein focus", icon: "\uD83C\uDF12" };
  if (d <= 17) return { phase: "Ovulatory", color: "#E8D44D", energy: "Peak & magnetic", guidance: "Be seen. Film everything. Connect and pitch.", workout: "High intensity, group classes, peak performance", nutrition: "Raw vegetables, light grains, anti-inflammatory", icon: "\uD83C\uDF15" };
  return { phase: "Luteal", color: "#c4a46b", energy: "Focused & finishing", guidance: "Complete, edit, wrap up. Protect your energy.", workout: "Moderate intensity, pilates, swimming", nutrition: "Complex carbs, B-vitamins, dark chocolate", icon: "\uD83C\uDF17" };
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const HABITS = [
  { id: 'morning_practice', label: 'Morning practice', icon: '\uD83E\uDDD8', pillar: 'spiritual' },
  { id: 'no_phone', label: 'No phone before practice', icon: '\uD83D\uDCF5', pillar: 'structure' },
  { id: 'movement', label: 'Movement / workout', icon: '\uD83D\uDCAA', pillar: 'body' },
  { id: 'water', label: 'Hydration (3L)', icon: '\uD83D\uDCA7', pillar: 'body' },
  { id: 'syncher_hour', label: '1hr SyncHer work', icon: '\uD83E\uDDEC', pillar: 'business' },
  { id: 'creative_out', label: 'One creative output', icon: '\u2728', pillar: 'business' },
  { id: 'transitions', label: 'Transition rituals', icon: '\uD83C\uDF3F', pillar: 'structure' },
  { id: 'protected_eve', label: 'Protected evening', icon: '\uD83C\uDF19', pillar: 'structure' },
  { id: 'no_electronics', label: 'No electronics after 7:30', icon: '\uD83D\uDCF5', pillar: 'structure' },
  { id: 'reading', label: 'Reading before bed', icon: '\uD83D\uDCD6', pillar: 'spiritual' },
  { id: 'legs_up', label: 'Legs up the wall', icon: '\uD83E\uDDB5', pillar: 'body' },
  { id: 'altar', label: 'Altar / spiritual moment', icon: '\uD83D\uDD6F\uFE0F', pillar: 'spiritual' },
];

const DEFAULT_SCHEDULE = [
  { time: '5:30', label: 'Wake & Stillness', desc: 'No phone. Water. Arrive slowly.', color: '#9b7fa8', icon: '\u2728' },
  { time: '6:00', label: 'Morning Practice', desc: 'Meditation, movement, altar', color: '#9b7fa8', icon: '\uD83E\uDDD8' },
  { time: '7:00', label: 'Deep Work I', desc: 'Peak energy \u2014 SyncHer, strategy', color: '#E8D44D', icon: '\uD83D\uDCA1' },
  { time: '9:30', label: 'Break', desc: 'Walk, snack, transition ritual', color: '#7fa88a', icon: '\uD83C\uDF3F' },
  { time: '10:00', label: 'Deep Work II', desc: 'Seraya Studio, calls, build', color: '#c4a46b', icon: '\uD83D\uDCBB' },
  { time: '12:00', label: 'Lunch & Rest', desc: 'Nourish. No screens.', color: '#7fa88a', icon: '\uD83C\uDF5C' },
  { time: '13:30', label: 'Creative Block', desc: 'Content, filming, writing', color: '#E8D44D', icon: '\uD83C\uDFA8' },
  { time: '15:30', label: 'Admin & Comms', desc: 'Emails, messages, planning', color: '#8a9fbf', icon: '\uD83D\uDCE7' },
  { time: '17:00', label: 'Movement', desc: 'Workout or long walk', color: '#bf8a8a', icon: '\uD83C\uDFCB\uFE0F' },
  { time: '18:30', label: 'Evening Wind-down', desc: 'Cook, read, altar', color: '#9b7fa8', icon: '\uD83C\uDF19' },
  { time: '21:00', label: 'Sleep Prep', desc: 'No screens. Legs up wall. Rest.', color: '#5A5A5A', icon: '\uD83D\uDE34' },
];

const DEFAULT_TRANSACTIONS = [
  { id: 't1', name: 'Rent \u2014 Dubai Villa', amount: -8500, currency: 'AED', date: 'Apr 1', icon: '\uD83C\uDFE0', cat: 'Rent' },
  { id: 't2', name: 'Seraya Studio Revenue', amount: 4200, currency: 'AED', date: 'Apr 3', icon: '\uD83D\uDCB0', cat: 'Income' },
  { id: 't3', name: 'Carrefour Groceries', amount: -340, currency: 'AED', date: 'Apr 5', icon: '\uD83D\uDED2', cat: 'Food' },
  { id: 't4', name: 'Freelance Payment', amount: 2800, currency: 'AED', date: 'Apr 7', icon: '\uD83D\uDCBB', cat: 'Income' },
  { id: 't5', name: 'Gym Membership', amount: -450, currency: 'AED', date: 'Apr 8', icon: '\uD83C\uDFCB\uFE0F', cat: 'Health' },
  { id: 't6', name: 'Spotify + YouTube', amount: -65, currency: 'AED', date: 'Apr 10', icon: '\uD83C\uDFB5', cat: 'Subscriptions' },
  { id: 't7', name: 'Uber rides', amount: -180, currency: 'AED', date: 'Apr 12', icon: '\uD83D\uDE95', cat: 'Transport' },
  { id: 't8', name: 'Peptide supplies', amount: -620, currency: 'AED', date: 'Apr 14', icon: '\uD83D\uDC89', cat: 'Health' },
];

const EXPENSE_CATEGORIES_LIGHT = [
  { name: 'Rent', value: 8500, color: '#E07A5F' },
  { name: 'Food', value: 2100, color: '#457B9D' },
  { name: 'Health', value: 1070, color: '#2D6A4F' },
  { name: 'Transport', value: 800, color: '#E9C46A' },
  { name: 'Subscriptions', value: 450, color: '#7B68EE' },
  { name: 'Other', value: 680, color: '#F4845F' },
];

const EXPENSE_CATEGORIES_DARK = [
  { name: 'Rent', value: 8500, color: '#FF64A0' },
  { name: 'Food', value: 2100, color: '#00D2FF' },
  { name: 'Health', value: 1070, color: '#00E676' },
  { name: 'Transport', value: 800, color: '#FFC800' },
  { name: 'Subscriptions', value: 450, color: '#A855F7' },
  { name: 'Other', value: 680, color: '#FF6B35' },
];

const MONTHLY_DATA = [
  { month: 'Nov', income: 12000, expenses: 9500 },
  { month: 'Dec', income: 14500, expenses: 11000 },
  { month: 'Jan', income: 11000, expenses: 10200 },
  { month: 'Feb', income: 13000, expenses: 9800 },
  { month: 'Mar', income: 15200, expenses: 10500 },
  { month: 'Apr', income: 7000, expenses: 10700 },
];

const FINANCIAL_GOALS = [
  { id: 'fg1', label: 'Amsterdam Move Fund', current: 12400, target: 25000, color: '#00D2FF' },
  { id: 'fg2', label: 'Emergency Fund', current: 8200, target: 15000, color: '#00E676' },
  { id: 'fg3', label: 'SyncHer Launch Budget', current: 3100, target: 5000, color: '#A855F7' },
];

const CONTACTS = [
  { id: 'c1', name: 'Enrica', group: 'Inner Circle', lastContact: '2026-04-14', frequency: 1, type: 'Partner' },
  { id: 'c2', name: 'Mum', group: 'Family', lastContact: '2026-04-12', frequency: 7, type: 'Family' },
  { id: 'c3', name: 'Dad', group: 'Family', lastContact: '2026-04-06', frequency: 14, type: 'Family' },
  { id: 'c4', name: 'Lena', group: 'Inner Circle', lastContact: '2026-03-28', frequency: 14, type: 'Best Friend' },
  { id: 'c5', name: 'Sarah K.', group: 'Friends', lastContact: '2026-03-15', frequency: 30, type: 'Friend' },
  { id: 'c6', name: 'Tom (mentor)', group: 'Professional', lastContact: '2026-03-01', frequency: 30, type: 'Mentor' },
  { id: 'c7', name: 'Nadia', group: 'Friends', lastContact: '2026-04-10', frequency: 14, type: 'Friend' },
  { id: 'c8', name: 'Aya (HWH)', group: 'Professional', lastContact: '2026-03-20', frequency: 21, type: 'Colleague' },
];

const PEPTIDE_PROTOCOL = [
  { name: 'BPC-157', dosage: '250mcg', frequency: 'Daily (AM)', route: 'Subcutaneous', cycle: '30 days on / 14 off', startDate: '2026-04-01', daysLeft: 16, purpose: 'Gut healing, tissue repair' },
  { name: 'GHK-Cu', dosage: '200mcg', frequency: 'Daily (PM)', route: 'Subcutaneous', cycle: '30 days on / 14 off', startDate: '2026-04-01', daysLeft: 16, purpose: 'Skin, collagen, anti-aging' },
];

const CONTENT_IDEAS = [
  { id: 'ci1', title: 'Why I track my cycle for productivity', platform: 'TikTok', pillar: 'SyncHer', status: 'idea', priority: 'high' },
  { id: 'ci2', title: 'Morning routine \u2014 cycle synced edition', platform: 'YouTube', pillar: 'Lifestyle', status: 'idea', priority: 'high' },
  { id: 'ci3', title: 'Japandi furniture in Dubai apartments', platform: 'Instagram', pillar: 'Seraya', status: 'scheduled', priority: 'medium' },
  { id: 'ci4', title: 'Peptide protocol for women over 25', platform: 'TikTok', pillar: 'Health', status: 'in_progress', priority: 'high' },
  { id: 'ci5', title: 'Moving from Dubai to Amsterdam', platform: 'YouTube', pillar: 'Lifestyle', status: 'idea', priority: 'medium' },
  { id: 'ci6', title: 'Sound healing at Africa Burn', platform: 'Instagram', pillar: 'Spiritual', status: 'idea', priority: 'low' },
];

const LEARNING = [
  { id: 'l1', title: 'The Body Keeps the Score', type: 'book', progress: 72, author: 'Bessel van der Kolk' },
  { id: 'l2', title: 'Building a Second Brain', type: 'book', progress: 100, author: 'Tiago Forte' },
  { id: 'l3', title: 'Kajabi Course Creation', type: 'course', progress: 25, author: 'Kajabi University' },
  { id: 'l4', title: 'Advanced Reiki Level III', type: 'course', progress: 60, author: 'HWH Dubai' },
];

const DEV_GOALS = [
  { area: 'Career', score: 65 },
  { area: 'Health', score: 75 },
  { area: 'Relationships', score: 70 },
  { area: 'Finance', score: 45 },
  { area: 'Spiritual', score: 85 },
  { area: 'Creative', score: 55 },
];

/* ===== HELPERS ===== */

function load(key) {
  try { const v = localStorage.getItem(key); return v; } catch { return null; }
}

function save(key, val) {
  try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); } catch {}
}

function CircleProgress({ size = 64, stroke = 5, progress = 0, color = 'var(--accent)', children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--skeleton)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const monthStr = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const startOffset = (firstDow + 6) % 7; // Monday-based

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true, isToday: d === today });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - startOffset - daysInMonth + 1, current: false });

  // Week numbers (ISO)
  const getWeek = (d) => {
    const date = new Date(year, month, d);
    const jan1 = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  };

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <div className="cal-header">
        <button className="cal-nav-btn"><ChevronLeft size={16} /></button>
        <span className="cal-header-month">{monthStr}</span>
        <button className="cal-nav-btn"><ChevronRight size={16} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr) 28px', gap: '2px' }}>
        {['MO','TU','WE','TH','FR','SA','SU'].map(d => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}
        <div />
        {weeks.map((week, wi) => {
          const firstCurrent = week.find(c => c.current);
          const weekNum = firstCurrent ? getWeek(firstCurrent.day) : '';
          return [
            ...week.map((c, ci) => (
              <div key={`${wi}-${ci}`} className={`cal-day ${c.isToday ? 'today' : ''} ${!c.current ? 'other-month' : ''}`}>
                {c.day}
              </div>
            )),
            <div key={`w${wi}`} className="cal-week-num">W{weekNum}</div>
          ];
        })}
      </div>
      <div className="cal-actions">
        <button className="cal-add-btn">Add event</button>
        <button className="cal-action-icon"><RefreshCw size={15} /></button>
        <button className="cal-action-icon"><FileText size={15} /></button>
      </div>
    </div>
  );
}

function getDaysSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  d.setHours(0,0,0,0); now.setHours(0,0,0,0);
  return Math.floor((now - d) / 86400000);
}

function getContactStatus(contact) {
  const days = getDaysSince(contact.lastContact);
  if (days <= contact.frequency) return 'on-track';
  if (days <= contact.frequency * 1.5) return 'due-soon';
  return 'overdue';
}

/* ===== NAV CONFIG ===== */

const NAV = [
  { group: 'OVERVIEW', items: [
    { id: 'home', label: 'Home Dashboard', icon: Home },
  ]},
  { group: 'LIFE SYSTEMS', items: [
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'health', label: 'Health & Fitness', icon: Dumbbell },
    { id: 'cycle', label: 'Cycle & Peptides', icon: Droplets },
    { id: 'rhythm', label: 'Daily Rhythm', icon: Clock },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'relationships', label: 'Relationships', icon: Heart },
    { id: 'development', label: 'Personal Dev', icon: Sprout },
  ]},
  { group: 'CONTENT', items: [
    { id: 'content-cal', label: 'Content Calendar', icon: CalendarDays },
    { id: 'content-strategy', label: 'Content Strategy', icon: FileText },
  ]},
];

/* ===== MAIN APP ===== */

export default function App() {
  const [view, setView] = useState(() => load('anna_view') || 'home');
  const [theme, setTheme] = useState(() => load('anna_theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Habits
  const todayKey = new Date().toISOString().slice(0, 10);
  const [habits, setHabits] = useState(() => {
    const saved = load(`habits_${todayKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Cycle
  const cycleDay = getDayOfCycle();
  const cycle = getCyclePhase(cycleDay);

  // Finance
  const [wiseConnected] = useState(false);

  // Contacts
  const [contacts, setContacts] = useState(() => {
    const saved = load('anna_contacts');
    return saved ? JSON.parse(saved) : CONTACTS;
  });

  // Intention
  const [intention, setIntention] = useState(() => load(`intention_${todayKey}`) || '');

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { save('anna_view', view); }, [view]);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    save('anna_theme', next);
  };

  const toggleHabit = (id) => {
    setHabits(prev => {
      const next = { ...prev, [id]: !prev[id] };
      save(`habits_${todayKey}`, next);
      return next;
    });
  };

  const saveIntention = (val) => {
    setIntention(val);
    save(`intention_${todayKey}`, val);
  };

  const markContacted = (id) => {
    setContacts(prev => {
      const next = prev.map(c => c.id === id ? { ...c, lastContact: todayKey } : c);
      save('anna_contacts', next);
      return next;
    });
  };

  const habitsCompleted = HABITS.filter(h => habits[h.id]).length;

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>Anna OS</h1>
        <p>LOADING</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <h1>Anna OS</h1>
          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {NAV.map(group => (
            <div key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} className={`nav-btn ${view === item.id ? 'active' : ''}`}
                    onClick={() => setView(item.id)}>
                    <span className="nav-icon"><Icon size={18} /></span>
                    <span className="nav-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span className="nav-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">AF</div>
          <div>
            <div className="sidebar-user-name">Anna Fox</div>
            <div className="sidebar-user-role">Founder & Creator</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content" key={view}>
        <div className="animate-in">
          {view === 'home' && <HomeView cycle={cycle} cycleDay={cycleDay} habits={habits} habitsCompleted={habitsCompleted} toggleHabit={toggleHabit} intention={intention} saveIntention={saveIntention} contacts={contacts} />}
          {view === 'finance' && <FinanceView wiseConnected={wiseConnected} />}
          {view === 'health' && <HealthView habits={habits} habitsCompleted={habitsCompleted} toggleHabit={toggleHabit} />}
          {view === 'cycle' && <CycleView cycle={cycle} cycleDay={cycleDay} />}
          {view === 'rhythm' && <RhythmView habits={habits} habitsCompleted={habitsCompleted} toggleHabit={toggleHabit} />}
          {view === 'business' && <BusinessView />}
          {view === 'relationships' && <RelationshipsView contacts={contacts} markContacted={markContacted} />}
          {view === 'development' && <DevelopmentView />}
          {view === 'content-cal' && <ContentCalendarView />}
          {view === 'content-strategy' && <ContentStrategyView />}
        </div>
      </main>
    </div>
  );
}

/* ===== HOME DASHBOARD ===== */

function HomeView({ cycle, cycleDay, habits, habitsCompleted, toggleHabit, intention, saveIntention, contacts }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const overdue = contacts.filter(c => getContactStatus(c) === 'overdue');
  const d = ((cycleDay - 1) % ANNA.cycleLength) + 1;
  const todayStr = new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric' });

  return (
    <div className="home-layout">
      {/* ======== CENTER CONTENT ======== */}
      <div className="home-center">
        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <div className="page-title">{getGreeting()}, Anna.</div>
          <div className="page-subtitle" style={{ marginBottom: 8, maxWidth: 640 }}>
            Anna OS wishes you a focused and intentional day. {cycle.phase} Phase (Day {d}) {'\u00B7'} {habitsCompleted}/{HABITS.length} habits done today.
          </div>
          <div style={{ textAlign: 'right', marginTop: -8 }}>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>Show all &hellip;</button>
          </div>
        </div>

        {/* 2x2 Stat cards — Intelly layout */}
        <div className="grid-2 animate-in" style={{ marginBottom: 8 }}>
          <div className="stat-card stat-yellow">
            <div className="stat-label">Habits Today:</div>
            <div className="stat-sub-row">
              <div className="stat-sub-item">
                <div className="stat-sub-value">{habitsCompleted}</div>
                <div className="stat-sub-label">Done</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">{HABITS.length - habitsCompleted}</div>
                <div className="stat-sub-label">Remaining</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">{Math.round(habitsCompleted / HABITS.length * 100)}%</div>
                <div className="stat-sub-label">Complete</div>
              </div>
            </div>
            {/* Decorative bar chart */}
            <svg className="stat-card-deco" width="80" height="70" viewBox="0 0 80 70">
              <rect x="4" y="30" width="10" height="40" rx="3" fill="currentColor" />
              <rect x="18" y="15" width="10" height="55" rx="3" fill="currentColor" />
              <rect x="32" y="40" width="10" height="30" rx="3" fill="currentColor" />
              <rect x="46" y="8" width="10" height="62" rx="3" fill="currentColor" />
              <rect x="60" y="22" width="10" height="48" rx="3" fill="currentColor" />
            </svg>
          </div>
          <div className="stat-card stat-pink">
            <div className="stat-label">Cycle Phase:</div>
            <div className="stat-sub-row">
              <div className="stat-sub-item">
                <div className="stat-sub-value">{cycle.phase}</div>
                <div className="stat-sub-label">{cycle.icon} Phase</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">Day {d}</div>
                <div className="stat-sub-label">of {ANNA.cycleLength}</div>
              </div>
            </div>
            {/* Decorative line chart */}
            <svg className="stat-card-deco" width="100" height="60" viewBox="0 0 100 60">
              <path d="M5 45 Q20 20 35 30 Q50 40 65 15 Q80 5 95 25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="65" cy="15" r="4" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="grid-2 animate-in animate-in-delay-1" style={{ marginBottom: 28 }}>
          <div className="stat-card stat-green">
            <div className="stat-label">Balance:</div>
            <div className="stat-sub-row">
              <div className="stat-sub-item">
                <div className="stat-sub-value">24.2K</div>
                <div className="stat-sub-label">AED Total</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">7,000</div>
                <div className="stat-sub-label">Income</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">+3.2%</div>
                <div className="stat-sub-label">This Month</div>
              </div>
            </div>
            {/* Decorative abstract blob */}
            <svg className="stat-card-deco" width="80" height="70" viewBox="0 0 80 70">
              <ellipse cx="45" cy="40" rx="32" ry="28" fill="currentColor" />
              <ellipse cx="30" cy="30" rx="20" ry="22" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <div className="stat-card stat-lavender">
            <div className="stat-label">Content Queue:</div>
            <div className="stat-sub-row">
              <div className="stat-sub-item">
                <div className="stat-sub-value">3</div>
                <div className="stat-sub-label">Scheduled</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">2</div>
                <div className="stat-sub-label">In Progress</div>
              </div>
              <div className="stat-sub-item">
                <div className="stat-sub-value">4</div>
                <div className="stat-sub-label">Ideas</div>
              </div>
            </div>
            {/* Decorative abstract blob */}
            <svg className="stat-card-deco" width="90" height="70" viewBox="0 0 90 70">
              <circle cx="50" cy="38" r="28" fill="currentColor" />
              <circle cx="35" cy="28" r="18" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Two-column below: Habits + Intention/Transactions */}
        <div className="grid-2" style={{ gap: 20 }}>
          {/* Habits checklist */}
          <div className="card card-tint-yellow animate-in animate-in-delay-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Today's Habits</div>
              <div className="stat-number" style={{ fontSize: 13, color: 'var(--accent)' }}>{habitsCompleted}/{HABITS.length}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {HABITS.map(h => (
                <button key={h.id} className="habit-btn" onClick={() => toggleHabit(h.id)}>
                  <div className={`check ${habits[h.id] ? 'checked' : ''}`}>
                    {habits[h.id] && <Check size={13} />}
                  </div>
                  <span style={{ fontSize: 13, color: habits[h.id] ? 'var(--text-tertiary)' : 'var(--text)', textDecoration: habits[h.id] ? 'line-through' : 'none' }}>
                    {h.icon} {h.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right sub-column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Intention */}
            <div className="card animate-in animate-in-delay-2">
              <div className="section-label">Today's Intention</div>
              <input className="input" placeholder="What matters most today?" value={intention}
                onChange={e => saveIntention(e.target.value)} />
            </div>

            {/* Transactions */}
            <div className="card animate-in animate-in-delay-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Recent Transactions</div>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}>View all <ArrowRight size={12} /></button>
              </div>
              {DEFAULT_TRANSACTIONS.slice(0, 4).map(tx => (
                <div key={tx.id} className="transaction-row">
                  <div className="tx-icon">{tx.icon}</div>
                  <div className="tx-info">
                    <div className="tx-label">{tx.name}</div>
                    <div className="tx-date">{tx.date}</div>
                  </div>
                  <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                  </div>
                </div>
              ))}
            </div>

            {/* Reach Out */}
            {overdue.length > 0 && (
              <div className="card card-tint-pink animate-in animate-in-delay-3">
                <div className="section-label" style={{ color: 'var(--danger)' }}>Reach Out To</div>
                {overdue.slice(0, 3).map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{getDaysSince(c.lastContact)} days ago {'\u00B7'} {c.type}</div>
                    </div>
                    <button className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 10px' }}>
                      <Send size={12} /> Reached out
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======== RIGHT PANEL (Intelly-style) ======== */}
      <div className="right-panel">
        {/* Calendar */}
        <div className="card animate-in" style={{ padding: 20, marginBottom: 20 }}>
          <MiniCalendar />
        </div>

        {/* Today's Schedule */}
        <div className="card animate-in animate-in-delay-1" style={{ padding: 20 }}>
          <div className="rp-schedule-header">
            <div className="rp-schedule-date">{todayStr}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Time</span>
              <span className="rp-timeline-label">Today's timeline</span>
            </div>
            <span className="pill" style={{ fontSize: 11, padding: '4px 12px' }}>All <ChevronDown size={10} /></span>
          </div>
          {DEFAULT_SCHEDULE.map((item, i) => (
            <div key={i} className={`timeline-item${i === 3 ? ' active-event' : ''}`}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-dot" style={{ background: item.color + '22', color: item.color }}>
                {item.icon}
              </div>
              <div className="timeline-content">
                <div className="timeline-label">{item.label}</div>
                <div className="timeline-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== FINANCE ===== */

function FinanceView({ wiseConnected }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const EXPENSE_CATEGORIES = isDark ? EXPENSE_CATEGORIES_DARK : EXPENSE_CATEGORIES_LIGHT;

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Finance</div>
      <div className="page-subtitle">Your financial overview and goals</div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card stat-yellow">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">AED 24,200</div>
          <div className="stat-change"><TrendingUp size={14} /> +3.2%</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-label">Monthly Income</div>
          <div className="stat-value">AED 7,000</div>
          <div className="stat-change"><TrendingDown size={14} /> -54% vs Mar</div>
        </div>
        <div className="stat-card stat-pink">
          <div className="stat-label">Monthly Expenses</div>
          <div className="stat-value">AED 10,700</div>
          <div className="stat-change"><TrendingUp size={14} /> +2%</div>
        </div>
        <div className="stat-card stat-lavender">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value">18%</div>
          <div className="stat-change">Target: 30%</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Income vs Expenses Chart */}
        <div className="card">
          <div className="section-label">Income vs Expenses</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#00E676' : '#2D6A4F'} stopOpacity={isDark ? 0.15 : 0.3} />
                  <stop offset="100%" stopColor={isDark ? '#00E676' : '#2D6A4F'} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#FF64A0' : '#E07A5F'} stopOpacity={isDark ? 0.15 : 0.3} />
                  <stop offset="100%" stopColor={isDark ? '#FF64A0' : '#E07A5F'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={isDark ? '#1F1F28' : '#DDD8D0'} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#44444F' : '#9A9A9A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#44444F' : '#9A9A9A' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#111114' : '#fff', border: `1px solid ${isDark ? '#1F1F28' : '#DDD8D0'}`, borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="income" stroke={isDark ? '#00E676' : '#2D6A4F'} fill="url(#incGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke={isDark ? '#FF64A0' : '#E07A5F'} fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Categories */}
        <div className="card">
          <div className="section-label">Expense Breakdown</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={EXPENSE_CATEGORIES} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {EXPENSE_CATEGORIES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXPENSE_CATEGORIES.map(cat => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.name}</span>
                  </div>
                  <span className="stat-number" style={{ fontSize: 12, color: 'var(--text)' }}>{cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Transactions */}
        <div className="card">
          <div className="section-label">Recent Transactions</div>
          {DEFAULT_TRANSACTIONS.map(tx => (
            <div key={tx.id} className="transaction-row">
              <div className="tx-icon">{tx.icon}</div>
              <div className="tx-info">
                <div className="tx-label">{tx.name}</div>
                <div className="tx-date">{tx.date}</div>
              </div>
              <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Goals */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Financial Goals</div>
            <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}><Plus size={12} /> Add</button>
          </div>
          {FINANCIAL_GOALS.map(goal => {
            const pct = Math.round(goal.current / goal.target * 100);
            return (
              <div key={goal.id} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{goal.label}</span>
                  <span className="stat-number" style={{ fontSize: 12, color: goal.color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: goal.color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>AED {goal.current.toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>AED {goal.target.toLocaleString()}</span>
                </div>
              </div>
            );
          })}

          {!wiseConnected && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: 'var(--accent-soft)', border: '1px dashed var(--accent)', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', marginBottom: 6 }}>Connect Wise Account</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 10 }}>Sync real balances and transactions</div>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                <DollarSign size={14} /> Connect to Wise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== HEALTH & FITNESS ===== */

function HealthView({ habits, habitsCompleted, toggleHabit }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const cycleDay = getDayOfCycle();
  const cycle = getCyclePhase(cycleDay);

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Health & Fitness</div>
      <div className="page-subtitle">Track your body, movement, and nutrition</div>

      {/* Hero stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card stat-pink">
          <div className="stat-label"><Flame size={14} /> Calories Burned</div>
          <div className="stat-value">1,875</div>
          <div className="stat-change">kcal today</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-label"><Utensils size={14} /> Calories In</div>
          <div className="stat-value">1,420</div>
          <div className="stat-change">of 1,800 target</div>
        </div>
        <div className="stat-card stat-blue">
          <div className="stat-label"><Activity size={14} /> Steps</div>
          <div className="stat-value">5,201</div>
          <div className="stat-change">of 8,500 goal</div>
        </div>
        <div className="stat-card stat-yellow">
          <div className="stat-label"><GlassWater size={14} /> Water</div>
          <div className="stat-value">1.8L</div>
          <div className="stat-change">of 3L goal</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Steps progress */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <CircleProgress size={120} stroke={8} progress={Math.round(5201/8500*100)} color={isDark ? '#00D2FF' : '#2A4C7A'}>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{ fontSize: 22, color: 'var(--text)' }}>5,201</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>steps</div>
            </div>
          </CircleProgress>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: 'var(--text)', marginBottom: 6 }}>Daily Steps</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>61% of your 8,500 step goal</div>
            <div className="progress-bar" style={{ width: 200 }}>
              <div className="progress-fill" style={{ width: '61%', background: isDark ? '#00D2FF' : '#2A4C7A' }} />
            </div>
          </div>
        </div>

        {/* Workout recommendation */}
        <div className="card">
          <div className="section-label" style={{ color: cycle.color }}>Cycle-Synced Workout</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: 'var(--text)', marginBottom: 6 }}>
            {cycle.phase} Phase Recommendation
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{cycle.workout}</div>
          <div className="pill" style={{ background: `${cycle.color}20`, color: cycle.color }}>{cycle.energy}</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Macros */}
        <div className="card">
          <div className="section-label">Macros Today</div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            {[
              { label: 'Protein', current: 85, target: 120, color: isDark ? '#FF64A0' : '#E07A5F' },
              { label: 'Carbs', current: 145, target: 200, color: isDark ? '#00D2FF' : '#457B9D' },
              { label: 'Fat', current: 52, target: 65, color: isDark ? '#FFC800' : '#E9C46A' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <CircleProgress size={72} stroke={5} progress={Math.round(m.current/m.target*100)} color={m.color}>
                  <span className="stat-number" style={{ fontSize: 14, color: 'var(--text)' }}>{m.current}g</span>
                </CircleProgress>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>{m.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>of {m.target}g</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weight tracker */}
        <div className="card">
          <div className="section-label">Weight Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Scale size={20} style={{ color: 'var(--text-tertiary)' }} />
            <div>
              <div className="stat-number" style={{ fontSize: 22, color: 'var(--text)' }}>58.2 kg</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Goal: 57.0 kg</div>
            </div>
          </div>
          <div className="progress-bar" style={{ marginBottom: 8 }}>
            <div className="progress-fill" style={{ width: '75%', background: isDark ? '#00E676' : '#4CAF50' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-tertiary)' }}>
            <span>Start: 60.5 kg</span>
            <span>75% to goal</span>
            <span>Goal: 57.0 kg</span>
          </div>
        </div>
      </div>

      {/* Health habits */}
      <div className="card">
        <div className="section-label">Health Habits</div>
        <div className="grid-3">
          {HABITS.filter(h => h.pillar === 'body').map(h => (
            <button key={h.id} className="habit-btn" onClick={() => toggleHabit(h.id)} style={{ background: habits[h.id] ? 'var(--accent-soft)' : 'var(--skeleton)', borderRadius: 12, padding: '12px 14px' }}>
              <div className={`check ${habits[h.id] ? 'checked' : ''}`}>
                {habits[h.id] && <Check size={13} />}
              </div>
              <span style={{ fontSize: 13, color: habits[h.id] ? 'var(--accent)' : 'var(--text)' }}>{h.icon} {h.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== CYCLE SYNCING & PEPTIDES ===== */

function CycleView({ cycle, cycleDay }) {
  const d = ((cycleDay - 1) % ANNA.cycleLength) + 1;
  const phases = [
    { name: 'Menstrual', days: '1\u20135', color: '#9b7fa8', icon: '\uD83C\uDF11', active: d <= 5 },
    { name: 'Follicular', days: '6\u201313', color: '#7fa88a', icon: '\uD83C\uDF12', active: d > 5 && d <= 13 },
    { name: 'Ovulatory', days: '14\u201317', color: '#E8D44D', icon: '\uD83C\uDF15', active: d > 13 && d <= 17 },
    { name: 'Luteal', days: '18\u201329', color: '#c4a46b', icon: '\uD83C\uDF17', active: d > 17 },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Cycle Syncing & Peptides</div>
      <div className="page-subtitle">Align your life with your biology</div>

      {/* Cycle phase cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {phases.map(p => (
          <div key={p.name} className={`cycle-phase-card card ${p.active ? 'active' : ''}`}
            style={{ opacity: p.active ? 1 : 0.5 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: 'var(--text)', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Days {p.days}</div>
            {p.active && <div className="pill" style={{ marginTop: 8, background: `${p.color}20`, color: p.color, fontSize: 11 }}>Current Phase</div>}
          </div>
        ))}
      </div>

      {/* Current phase detail */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <CircleProgress size={80} stroke={6} progress={Math.round(d / ANNA.cycleLength * 100)} color={cycle.color}>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{ fontSize: 20, color: 'var(--text)' }}>{d}</div>
              <div style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>DAY</div>
            </div>
          </CircleProgress>
          <div>
            <div style={{ fontSize: 22, fontFamily: "'DM Serif Display', serif", color: 'var(--text)' }}>{cycle.phase} Phase</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{cycle.energy}</div>
          </div>
        </div>
        <div className="grid-3" style={{ gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--skeleton)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Guidance</div>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{cycle.guidance}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--skeleton)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Workout</div>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{cycle.workout}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--skeleton)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Nutrition</div>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{cycle.nutrition}</div>
          </div>
        </div>
      </div>

      {/* Peptide Protocol */}
      <div className="section-label">Peptide Protocol</div>
      <div className="grid-2" style={{ gap: 16 }}>
        {PEPTIDE_PROTOCOL.map((p, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: 'var(--text)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{p.purpose}</div>
              </div>
              <div className="pill" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{p.daysLeft}d left</div>
            </div>
            <div className="grid-2" style={{ gap: 10 }}>
              {[['Dosage', p.dosage], ['Frequency', p.frequency], ['Route', p.route], ['Cycle', p.cycle]].map(([k, v]) => (
                <div key={k} style={{ padding: 10, borderRadius: 10, background: 'var(--skeleton)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== DAILY RHYTHM ===== */

function RhythmView({ habits, habitsCompleted, toggleHabit }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Adherence data (simulated)
  const weekAdherence = [85, 70, 90, 65, 80, 75, 0]; // Mon-Sun
  const avgAdherence = Math.round(weekAdherence.filter(v => v > 0).reduce((a,b) => a+b, 0) / weekAdherence.filter(v => v > 0).length);

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Daily Rhythm</div>
      <div className="page-subtitle">Structure your day with intention</div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Schedule */}
        <div className="card">
          <div className="section-label">Today's Schedule</div>
          {DEFAULT_SCHEDULE.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-dot" style={{ background: item.color }} />
              <div className="timeline-content">
                <div className="timeline-label">{item.label}</div>
                <div className="timeline-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Routines + Adherence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Morning routine */}
          <div className="card">
            <div className="section-label">Morning Routine</div>
            {HABITS.filter(h => ['morning_practice', 'no_phone', 'water', 'movement'].includes(h.id)).map(h => (
              <button key={h.id} className="habit-btn" onClick={() => toggleHabit(h.id)}>
                <div className={`check ${habits[h.id] ? 'checked' : ''}`}>{habits[h.id] && <Check size={13} />}</div>
                <span style={{ fontSize: 13, color: habits[h.id] ? 'var(--text-tertiary)' : 'var(--text)', textDecoration: habits[h.id] ? 'line-through' : 'none' }}>
                  {h.icon} {h.label}
                </span>
              </button>
            ))}
          </div>

          {/* Evening routine */}
          <div className="card">
            <div className="section-label">Evening Routine</div>
            {HABITS.filter(h => ['protected_eve', 'no_electronics', 'reading', 'legs_up', 'altar'].includes(h.id)).map(h => (
              <button key={h.id} className="habit-btn" onClick={() => toggleHabit(h.id)}>
                <div className={`check ${habits[h.id] ? 'checked' : ''}`}>{habits[h.id] && <Check size={13} />}</div>
                <span style={{ fontSize: 13, color: habits[h.id] ? 'var(--text-tertiary)' : 'var(--text)', textDecoration: habits[h.id] ? 'line-through' : 'none' }}>
                  {h.icon} {h.label}
                </span>
              </button>
            ))}
          </div>

          {/* Adherence */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Weekly Adherence</div>
              <div className="stat-number" style={{ fontSize: 20, color: 'var(--accent)' }}>{avgAdherence}%</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 48, borderRadius: 12, marginBottom: 4,
                    background: weekAdherence[i] === 0 ? 'var(--skeleton)' :
                      weekAdherence[i] >= 80 ? (isDark ? 'rgba(0,230,118,0.2)' : '#2D6A4F') :
                      weekAdherence[i] >= 60 ? (isDark ? 'rgba(255,200,0,0.2)' : '#43A047') :
                      (isDark ? 'rgba(255,100,160,0.2)' : '#E07A5F'),
                    border: isDark && weekAdherence[i] > 0 ? `1px solid ${
                      weekAdherence[i] >= 80 ? 'rgba(0,230,118,0.3)' :
                      weekAdherence[i] >= 60 ? 'rgba(255,200,0,0.3)' :
                      'rgba(255,100,160,0.3)'
                    }` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600,
                    color: isDark ? (
                      weekAdherence[i] >= 80 ? '#00E676' :
                      weekAdherence[i] >= 60 ? '#FFC800' :
                      weekAdherence[i] > 0 ? '#FF64A0' : 'var(--text)'
                    ) : (weekAdherence[i] >= 60 ? '#FFFFFF' : 'var(--text)')
                  }}>
                    {weekAdherence[i] > 0 ? `${weekAdherence[i]}%` : '\u2014'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== BUSINESS ===== */

function BusinessView() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const businesses = [
    { name: 'Seraya Studio', tagline: 'Japandi stone furniture \u2014 Dubai to global', status: 'Active', color: isDark ? '#00E676' : '#C4A35A', emoji: '\uD83E\uDEA8', revenue: 'AED 4,200/mo', milestones: 3, totalMilestones: 8,
      statusBg: isDark ? 'rgba(0,230,118,0.15)' : '#E8F5E4', statusText: isDark ? '#00E676' : '#2D6A4F', statusBorder: isDark ? 'rgba(0,230,118,0.3)' : 'transparent' },
    { name: 'SyncHer', tagline: 'Cycle-syncing wellness platform for women', status: 'Building', color: isDark ? '#00D2FF' : '#457B9D', emoji: '\uD83E\uDDEC', revenue: 'Pre-revenue', milestones: 2, totalMilestones: 7,
      statusBg: isDark ? 'rgba(0,210,255,0.15)' : '#E0EEFB', statusText: isDark ? '#00D2FF' : '#457B9D', statusBorder: isDark ? 'rgba(0,210,255,0.3)' : 'transparent' },
    { name: 'Personal Brand', tagline: 'TikTok \u00B7 YouTube \u00B7 Instagram', status: 'Planning', color: isDark ? '#FFC800' : '#E07A5F', emoji: '\uD83C\uDFAC', revenue: 'Pre-revenue', milestones: 0, totalMilestones: 6,
      statusBg: isDark ? 'rgba(255,200,0,0.15)' : '#FDF6D8', statusText: isDark ? '#FFC800' : '#B8941A', statusBorder: isDark ? 'rgba(255,200,0,0.3)' : 'transparent' },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Business Architecture</div>
      <div className="page-subtitle">Your ventures and their progress</div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {businesses.map(b => (
          <div key={b.name} className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ height: 4, background: b.color }} />
            <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 28 }}>{b.emoji}</div>
              <div className="pill" style={{ background: b.statusBg, color: b.statusText, border: b.statusBorder !== 'transparent' ? `1px solid ${b.statusBorder}` : 'none' }}>{b.status}</div>
            </div>
            <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: 'var(--text)', marginBottom: 4 }}>{b.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>{b.tagline}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="stat-number" style={{ fontSize: 14, color: b.color }}>{b.revenue}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{b.milestones}/{b.totalMilestones} milestones</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.round(b.milestones/b.totalMilestones*100)}%`, background: b.color }} />
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key tools */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-label">Tools & Platforms</div>
        <div className="grid-4" style={{ gap: 10 }}>
          {[
            { name: 'Kajabi', desc: 'SyncHer courses', color: '#7B61FF' },
            { name: 'Shopify', desc: 'Seraya e-commerce', color: '#00E676' },
            { name: 'Figma', desc: 'Design & branding', color: '#FF6B9D' },
            { name: 'Notion', desc: 'Knowledge base', color: '#F0F0F0' },
            { name: 'CapCut', desc: 'Video editing', color: '#00D4FF' },
            { name: 'Canva', desc: 'Social graphics', color: '#00BCD4' },
            { name: 'Vercel', desc: 'Web hosting', color: '#F0F0F0' },
            { name: 'Wise', desc: 'Banking & FX', color: '#00E676' },
          ].map(t => (
            <div key={t.name} style={{ padding: 12, borderRadius: 12, background: 'var(--skeleton)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q2 Goals */}
      <div className="card">
        <div className="section-label">Q2 2026 Goals</div>
        {[
          { label: 'First Seraya sale', progress: 45, color: '#c4a46b' },
          { label: 'SyncHer landing page live', progress: 30, color: '#8a9fbf' },
          { label: 'First 10 TikToks posted', progress: 0, color: '#bf8a8a' },
          { label: 'Amsterdam move complete', progress: 15, color: '#7fa88a' },
        ].map((g, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{g.label}</span>
              <span className="stat-number" style={{ fontSize: 12, color: g.color }}>{g.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${g.progress}%`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== RELATIONSHIPS & CRM ===== */

function RelationshipsView({ contacts, markContacted }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const groups = [...new Set(contacts.map(c => c.group))];
  const statusColors = isDark
    ? { 'on-track': '#00E676', 'due-soon': '#FFC800', 'overdue': '#EF4444' }
    : { 'on-track': '#43A047', 'due-soon': '#F9A825', 'overdue': '#E53935' };
  const avatarColors = isDark
    ? ['rgba(0,210,255,0.2)', 'rgba(255,100,160,0.2)', 'rgba(0,230,118,0.2)', 'rgba(255,200,0,0.2)', 'rgba(168,85,247,0.2)', 'rgba(255,107,53,0.2)']
    : ['#F5C6D0', '#C5E6C0', '#B8D4E8', '#D4C5F0', '#F5E6A3', '#F4C4A0'];
  const avatarTextColors = isDark
    ? ['#00D2FF', '#FF64A0', '#00E676', '#FFC800', '#A855F7', '#FF6B35']
    : ['#7A2840', '#1D5420', '#1A3C5A', '#3D2870', '#5A4A08', '#6A3A10'];

  const sorted = [...contacts].sort((a, b) => {
    const order = { overdue: 0, 'due-soon': 1, 'on-track': 2 };
    return order[getContactStatus(a)] - order[getContactStatus(b)];
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Relationships</div>
      <div className="page-subtitle">Stay connected with the people who matter</div>

      {/* Group overview */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {groups.map(g => {
          const groupContacts = contacts.filter(c => c.group === g);
          const overdue = groupContacts.filter(c => getContactStatus(c) === 'overdue').length;
          return (
            <div key={g} className="card">
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{g}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>{groupContacts.length} contacts</div>
              {overdue > 0 && <div className="pill" style={{ background: isDark ? 'rgba(239,68,68,0.15)' : '#FDE8EE', color: isDark ? '#EF4444' : '#E53935', border: isDark ? '1px solid rgba(239,68,68,0.3)' : 'none', fontSize: 11 }}>{overdue} overdue</div>}
            </div>
          );
        })}
      </div>

      {/* Touchpoint tracker */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Touchpoint Tracker</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="pill" style={{ fontSize: 10, gap: 4 }}><div className="status-dot on-track" style={{ width: 8, height: 8 }} /> On track</div>
            <div className="pill" style={{ fontSize: 10, gap: 4 }}><div className="status-dot due-soon" style={{ width: 8, height: 8 }} /> Due soon</div>
            <div className="pill" style={{ fontSize: 10, gap: 4 }}><div className="status-dot overdue" style={{ width: 8, height: 8 }} /> Overdue</div>
          </div>
        </div>
        {sorted.map((c, ci) => {
          const status = getContactStatus(c);
          const days = getDaysSince(c.lastContact);
          const avatarIdx = ci % avatarColors.length;
          return (
            <div key={c.id} className="contact-row" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="contact-avatar" style={{ background: avatarColors[avatarIdx], color: avatarTextColors[avatarIdx] }}>
                {c.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.type} {'\u00B7'} {c.group}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 12 }}>
                <div style={{ fontSize: 12, color: statusColors[status], fontWeight: 600 }}>
                  {days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Every {c.frequency}d</div>
              </div>
              <div className={`status-dot ${status}`} />
              {status !== 'on-track' && (
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 10px' }} onClick={() => markContacted(c.id)}>
                  <Check size={12} /> Done
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== PERSONAL DEVELOPMENT ===== */

function DevelopmentView() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Personal Development</div>
      <div className="page-subtitle">Grow intentionally across all areas of life</div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Life Balance Radar */}
        <div className="card">
          <div className="section-label">Life Balance</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={DEV_GOALS}>
              <PolarGrid stroke={isDark ? '#1F1F28' : '#DDD8D0'} />
              <PolarAngleAxis dataKey="area" tick={{ fontSize: 12, fill: isDark ? '#75758A' : '#5C5C5C' }} />
              <Radar dataKey="score" stroke={isDark ? '#00D2FF' : '#C4A24D'} fill={isDark ? '#00D2FF' : '#C4A24D'} fillOpacity={isDark ? 0.1 : 0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Goals per area */}
        <div className="card">
          <div className="section-label">Goals by Area</div>
          {DEV_GOALS.map(g => (
            <div key={g.area} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{g.area}</span>
                <span className="stat-number" style={{ fontSize: 12, color: 'var(--accent)' }}>{g.score}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${g.score}%`, background: g.score >= 70 ? 'var(--success)' : g.score >= 50 ? 'var(--warning)' : 'var(--danger)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Learning */}
        <div className="card">
          <div className="section-label">Learning Tracker</div>
          {LEARNING.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <CircleProgress size={44} stroke={3} progress={item.progress} color={item.progress === 100 ? 'var(--success)' : 'var(--accent)'}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)' }}>{item.progress}%</span>
              </CircleProgress>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.author} {'\u00B7'} {item.type}</div>
              </div>
              {item.progress === 100 && <div className="pill" style={{ background: isDark ? 'rgba(0,230,118,0.15)' : 'rgba(76,175,80,0.1)', color: 'var(--success)', border: isDark ? '1px solid rgba(0,230,118,0.3)' : 'none', fontSize: 10 }}>Done</div>}
            </div>
          ))}
        </div>

        {/* Journal */}
        <div className="card">
          <div className="section-label">Weekly Reflection</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>What went well this week?</div>
            <textarea className="input" rows={2} placeholder="Reflect on your wins..." />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>What could be better?</div>
            <textarea className="input" rows={2} placeholder="Areas for growth..." />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Gratitude</div>
            <textarea className="input" rows={2} placeholder="Three things you're grateful for..." />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== CONTENT CALENDAR ===== */

function ContentCalendarView() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const platformBadges = { TikTok: 'badge-tiktok', YouTube: 'badge-youtube', Instagram: 'badge-instagram', Blog: 'badge-blog' };
  const statusLabels = { idea: 'Idea', in_progress: 'In Progress', scheduled: 'Scheduled', published: 'Published' };
  const kanbanHeaders = { idea: 'kanban-header-idea', in_progress: 'kanban-header-progress', scheduled: 'kanban-header-scheduled', published: 'kanban-header-published' };

  const grouped = { idea: [], in_progress: [], scheduled: [], published: [] };
  CONTENT_IDEAS.forEach(c => { if (grouped[c.status]) grouped[c.status].push(c); });

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Content Calendar</div>
      <div className="page-subtitle">Plan, create, and publish your content</div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {Object.entries(grouped).map(([status, items]) => (
          <div key={status} className="kanban-column">
            <div className={kanbanHeaders[status]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
                {statusLabels[status]}
              </div>
              <div className="pill" style={{ padding: '2px 8px', fontSize: 11 }}>{items.length}</div>
            </div>
            {items.map(item => (
              <div key={item.id} className="kanban-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div className={`pill ${platformBadges[item.platform] || ''}`} style={{ fontSize: 10, padding: '3px 10px' }}>
                    {item.platform}
                  </div>
                  {item.priority === 'high' && <Star size={14} style={{ color: isDark ? '#FFC800' : '#FF9800' }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{item.pillar}</div>
              </div>
            ))}
            <button style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
              <Plus size={14} /> Add
            </button>
          </div>
        ))}
      </div>

      {/* Platform stats */}
      <div className="card">
        <div className="section-label">Platform Overview</div>
        <div className="grid-4">
          {[
            { name: 'TikTok', followers: 0, posts: 0, color: '#FF6B9D' },
            { name: 'YouTube', followers: 0, posts: 0, color: '#FF5252' },
            { name: 'Instagram', followers: 245, posts: 12, color: '#7B61FF' },
            { name: 'Blog/Newsletter', followers: 0, posts: 0, color: '#00D4FF' },
          ].map(p => (
            <div key={p.name} style={{ padding: 16, borderRadius: 14, background: 'var(--skeleton)' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{p.name}</div>
              <div className="stat-number" style={{ fontSize: 18, color: p.color }}>{p.followers}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>followers {'\u00B7'} {p.posts} posts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== CONTENT STRATEGY ===== */

function ContentStrategyView() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const pillars = [
    { name: 'Cycle Syncing / SyncHer', desc: 'Educate women about cycle-synced living', color: '#8a9fbf', ideas: 4 },
    { name: 'Lifestyle & Wellness', desc: 'Morning routines, rituals, habits, peptides', color: '#9b7fa8', ideas: 3 },
    { name: 'Seraya Studio', desc: 'Behind the scenes of building a furniture brand', color: '#c4a46b', ideas: 2 },
    { name: 'Spiritual Practice', desc: 'Sound healing, meditation, Vipassana, altar work', color: '#7fa88a', ideas: 2 },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="page-title">Content Strategy</div>
      <div className="page-subtitle">Your content pillars, audience, and idea bank</div>

      {/* Content Pillars */}
      <div className="section-label">Content Pillars</div>
      <div className="grid-2" style={{ marginBottom: 24, gap: 16 }}>
        {pillars.map(p => (
          <div key={p.name} className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ height: 4, background: p.color }} />
            <div style={{ padding: 28 }}>
            <div style={{ fontSize: 16, fontFamily: "'DM Serif Display', serif", color: 'var(--text)', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>{p.desc}</div>
            <div className="pill" style={{ background: `${p.color}20`, color: p.color }}>{p.ideas} ideas</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Target Audience */}
        <div className="card">
          <div className="section-label">Target Audience</div>
          {[
            { persona: 'Health-conscious women 25\u201338', desc: 'Interested in cycle syncing, holistic wellness, hormonal health' },
            { persona: 'Aspiring entrepreneurs', desc: 'Women building brands while prioritizing well-being' },
            { persona: 'Spiritual seekers', desc: 'Sound healing, meditation, conscious living' },
          ].map((a, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 12, background: 'var(--skeleton)', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{a.persona}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{a.desc}</div>
            </div>
          ))}
        </div>

        {/* Brand Voice */}
        <div className="card">
          <div className="section-label">Brand Voice</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { trait: 'Warm & Grounded', desc: 'Speak like a wise friend, not a guru' },
              { trait: 'Educational', desc: 'Lead with science, back with experience' },
              { trait: 'Empowering', desc: 'You have the answers \u2014 I help you find them' },
              { trait: 'Minimal & Intentional', desc: 'Less noise, more signal' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{v.trait}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Idea Bank */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Idea Bank</div>
          <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 14px' }}><Plus size={14} /> Add Idea</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CONTENT_IDEAS.map(idea => (
            <div key={idea.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'var(--skeleton)' }}>
              {idea.priority === 'high' && <Star size={14} style={{ color: isDark ? '#FFC800' : '#FF9800', flexShrink: 0 }} />}
              {idea.priority === 'medium' && <Star size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
              {idea.priority === 'low' && <div style={{ width: 14 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{idea.title}</div>
              </div>
              <div className="pill" style={{ fontSize: 10, padding: '3px 8px' }}>{idea.platform}</div>
              <div className="pill" style={{ fontSize: 10, padding: '3px 8px' }}>{idea.pillar}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
