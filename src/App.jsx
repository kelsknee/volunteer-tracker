import { useState, useMemo } from "react";

const DAYS = ["Mon 9/28","Tue 9/29","Wed 9/30","Thu 10/1","Fri 10/2","Sat 10/3"];
const DAY_KEYS = ["mon","tue","wed","thu","fri","sat"];

const COLORS = {
  blue:   { bg: "#E6F1FB", text: "#185FA5", border: "#B5D4F4" },
  green:  { bg: "#EAF3DE", text: "#3B6D11", border: "#C0DD97" },
  amber:  { bg: "#FAEEDA", text: "#854F0B", border: "#FAC775" },
  purple: { bg: "#EEEDFE", text: "#534AB7", border: "#CECBF6" },
  gray:   { bg: "#F1EFE8", text: "#5F5E5A", border: "#D3D1C7" },
  teal:   { bg: "#E1F5EE", text: "#0F6E56", border: "#9FE1CB" },
  red:    { bg: "#FCEBEB", text: "#A32D2D", border: "#F7C1C1" },
  coral:  { bg: "#FAECE7", text: "#993C1D", border: "#F5C4B3" },
};

const filled = (v) => v && v.trim() !== "";

const mkDay = (v) => ({ mon: v, tue: v, wed: v, thu: v, fri: v, sat: v });
const empty = () => ({ mon:"", tue:"", wed:"", thu:"", fri:"", sat:"" });

const INIT_ROLES = [
  { id:1,  cat:"Leadership", role:"Community Liaison",            cc:"",  start:"8:00 AM",  end:"7:00 PM",  special:true,  assignments: mkDay("LaVar") },
  { id:2,  cat:"Leadership", role:"Business Liaison",             cc:"",  start:"8:00 AM",  end:"7:00 PM",  special:true,  assignments: mkDay("Brooke") },
  { id:3,  cat:"Leadership", role:"Shaking Hands",                cc:"",  start:"8:00 AM",  end:"7:00 PM",  special:true,  assignments: mkDay("Diallo") },
  { id:4,  cat:"Leadership", role:"Security Lead",                cc:"",  start:"8:00 AM",  end:"7:00 PM",  special:true,  assignments: empty() },
  { id:5,  cat:"Shuttle",    role:"Shuttle Bus Lead",             cc:"",  start:"10:00 AM", end:"3:30 PM",  special:true,  assignments: mkDay("Ted") },
  { id:6,  cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:7,  cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:8,  cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:9,  cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:10, cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:11, cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:12, cat:"Parking",    role:"Parking Attendant",            cc:"",  start:"10:00 AM", end:"12:00 PM", special:false, assignments: empty() },
  { id:16, cat:"Semi Truck", role:"Semi Truck Lead (AM)",         cc:"",  start:"8:00 AM",  end:"9:00 AM",  special:true,  assignments: mkDay("John") },
  { id:17, cat:"Semi Truck", role:"Semi Truck Driver – Truck 1 (AM)", cc:"", start:"8:00 AM", end:"9:00 AM", special:true, assignments: empty() },
  { id:18, cat:"Semi Truck", role:"Semi Truck Driver – Truck 2 (AM)", cc:"", start:"8:00 AM", end:"9:00 AM", special:true, assignments: empty() },
  { id:19, cat:"B&B",        role:"B&B Lead/Floater",             cc:"",  start:"8:00 AM",  end:"5:00 PM",  special:true,  assignments: mkDay("Eddie") },
  { id:20, cat:"Logistics",  role:"PortaJohn/Dumpster Lead",      cc:"",  start:"8:00 AM",  end:"10:00 AM", special:true,  assignments: empty() },
  { id:21, cat:"Logistics",  role:"Brush Pile Documenter",        cc:"",  start:"11:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:22, cat:"Logistics",  role:"PortaJohn Mover",              cc:"",  start:"8:00 AM",  end:"9:00 AM",  special:true,  assignments: mkDay("Jason") },
  { id:23, cat:"Signage",    role:"Stake & Sign Team Lead A",     cc:"",  start:"8:30 AM",  end:"10:30 AM", special:true,  assignments: empty() },
  { id:24, cat:"Signage",    role:"Stake & Sign Team Lead B",     cc:"",  start:"8:30 AM",  end:"10:30 AM", special:true,  assignments: empty() },
  { id:25, cat:"Signage",    role:"Stake Team Member",            cc:"A1",start:"9:00 AM",  end:"10:30 AM", special:false, assignments: empty() },
  { id:27, cat:"Signage",    role:"Stake Team Member",            cc:"B1",start:"9:00 AM",  end:"10:30 AM", special:false, assignments: empty() },
  { id:29, cat:"Signage",    role:"HQ Signage Lead",              cc:"",  start:"8:00 AM",  end:"9:00 AM",  special:true,  assignments: empty() },
  { id:32, cat:"CC-A",       role:"CC A People Lead",             cc:"",  start:"8:30 AM",  end:"6:00 PM",  special:true,  assignments: mkDay("Greg") },
  { id:33, cat:"CC-A",       role:"CC A Equipment Lead",          cc:"",  start:"8:30 AM",  end:"6:00 PM",  special:true,  assignments: mkDay("Jill") },
  { id:34, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:35, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:36, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:37, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:38, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:39, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:40, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:41, cat:"CC-A",       role:"CC A Equip Unload/Prep",       cc:"A1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:42, cat:"CC-B",       role:"CC B People Lead",             cc:"",  start:"8:30 AM",  end:"6:00 PM",  special:true,  assignments: mkDay("Bob") },
  { id:43, cat:"CC-B",       role:"CC B Equipment Lead",          cc:"",  start:"8:30 AM",  end:"6:00 PM",  special:true,  assignments: mkDay("Kris") },
  { id:44, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:45, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:46, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:47, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:48, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:49, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:50, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:51, cat:"CC-B",       role:"CC B Equip Unload/Prep",       cc:"B1",start:"9:00 AM",  end:"12:00 PM", special:false, assignments: empty() },
  { id:52, cat:"Equipment",  role:"Large Equipment Lead",          cc:"",  start:"9:00 AM",  end:"6:00 PM",  special:true,  assignments: mkDay("John") },
  { id:53, cat:"Equipment",  role:"Large Equipment Prep",          cc:"",  start:"9:00 AM",  end:"12:00 PM", special:true,  assignments: empty() },
  { id:54, cat:"Equipment",  role:"Large Equipment Prep",          cc:"",  start:"9:00 AM",  end:"12:00 PM", special:true,  assignments: empty() },
  { id:55, cat:"Catering",   role:"Key Volunteer Lunch Prep & Serve", cc:"", start:"11:00 AM", end:"1:00 PM", special:true, assignments: empty() },
  { id:57, cat:"Registration",role:"Registration Lead",           cc:"",  start:"9:30 AM",  end:"2:00 PM",  special:true,  assignments: empty() },
  { id:58, cat:"Registration",role:"Registration",                cc:"",  start:"9:30 AM",  end:"2:00 PM",  special:false, assignments: empty() },
  { id:59, cat:"Registration",role:"Registration",                cc:"",  start:"9:30 AM",  end:"2:00 PM",  special:false, assignments: empty() },
  { id:61, cat:"CC-A",       role:"CC A Small Equip Repair Lead", cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: mkDay("Nancy & Mark") },
  { id:62, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:63, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:64, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:65, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:66, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:67, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:69, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:70, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:71, cat:"CC-A",       role:"CC A Small Equip Repair",      cc:"A2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:72, cat:"CC-B",       role:"CC B Small Equip Repair Lead", cc:"",  start:"12:00 PM", end:"5:00 PM",  special:true,  assignments: mkDay("Boone & Eric") },
  { id:73, cat:"CC-B",       role:"CC B Small Equip Repair",      cc:"B2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:74, cat:"CC-B",       role:"CC B Small Equip Repair",      cc:"B2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:75, cat:"CC-B",       role:"CC B Small Equip Repair",      cc:"B2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:76, cat:"CC-B",       role:"CC B Small Equip Repair",      cc:"B2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:77, cat:"CC-B",       role:"CC B Small Equip Repair",      cc:"B2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:78, cat:"CC-B",       role:"CC B Small Equip Repair",      cc:"B2",start:"12:00 PM", end:"5:00 PM",  special:false, assignments: empty() },
  { id:79, cat:"CC-A",       role:"CC A Equip Swap Driver",       cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:80, cat:"CC-A",       role:"CC A Equip Swap Loader",       cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:81, cat:"CC-B",       role:"CC B Equip Swap Driver",       cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:82, cat:"CC-B",       role:"CC B Equip Swap Loader",       cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:83, cat:"CC-A",       role:"CC A Equipment Load",          cc:"A3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:84, cat:"CC-A",       role:"CC A Equipment Load",          cc:"A3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:85, cat:"CC-A",       role:"CC A Equipment Load",          cc:"A3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:86, cat:"CC-A",       role:"CC A Equipment Load",          cc:"A3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:87, cat:"CC-A",       role:"CC A Equipment Load",          cc:"A3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:88, cat:"CC-B",       role:"CC B Equipment Load",          cc:"B3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:89, cat:"CC-B",       role:"CC B Equipment Load",          cc:"B3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:90, cat:"CC-B",       role:"CC B Equipment Load",          cc:"B3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:91, cat:"CC-B",       role:"CC B Equipment Load",          cc:"B3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:92, cat:"CC-B",       role:"CC B Equipment Load",          cc:"B3",start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:93, cat:"CC-B",       role:"CC B Equipment Load",          cc:"",  start:"3:30 PM",  end:"5:00 PM",  special:false, assignments: empty() },
  { id:94, cat:"Semi Truck", role:"Semi Truck Lead (PM)",         cc:"",  start:"5:00 PM",  end:"6:00 PM",  special:true,  assignments: mkDay("Kelsey") },
  { id:95, cat:"Semi Truck", role:"Semi Truck Driver – Truck 1 (PM)", cc:"", start:"5:00 PM", end:"6:00 PM", special:true, assignments: empty() },
  { id:96, cat:"Equipment",  role:"Large Equip Lockdown",         cc:"",  start:"5:00 PM",  end:"6:00 PM",  special:true,  assignments: mkDay("John") },
  { id:97, cat:"Leadership", role:"Security Lead (PM)",           cc:"",  start:"5:00 PM",  end:"7:00 PM",  special:true,  assignments: mkDay("Kelsey") },
  { id:98, cat:"Floater",    role:"Floater",                      cc:"",  start:"8:00 AM",  end:"5:00 PM",  special:true,  assignments: empty() },
  { id:99, cat:"Floater",    role:"Floater",                      cc:"",  start:"8:00 AM",  end:"2:00 PM",  special:true,  assignments: empty() },
  { id:102,cat:"Media",      role:"Photographer",                 cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:103,cat:"Media",      role:"Photographer",                 cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:104,cat:"Media",      role:"Photographer",                 cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:105,cat:"Media",      role:"Videographer",                 cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:106,cat:"Media",      role:"Videographer",                 cc:"",  start:"10:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
  { id:107,cat:"Special",    role:"Denby Special Projects Lead",  cc:"",  start:"9:00 AM",  end:"5:00 PM",  special:true,  assignments: empty() },
  { id:109,cat:"Special",    role:"Denby Special Project Company Group", cc:"", start:"11:00 AM", end:"5:00 PM", special:true, assignments: empty() },
  { id:110,cat:"Special",    role:"Anchor Ring Doorbells Company",cc:"",  start:"11:00 AM", end:"5:00 PM",  special:true,  assignments: empty() },
];

const CAT_COLORS = {
  "Leadership":"purple","Shuttle":"teal","Parking":"gray","B&B":"green",
  "Logistics":"amber","Signage":"blue","CC-A":"blue","CC-B":"coral",
  "Equipment":"amber","Catering":"green","Registration":"teal",
  "Semi Truck":"gray","Floater":"purple","Media":"teal","Special":"coral",
};

const Badge = ({ color="gray", children, small }) => (
  <span style={{
    background: COLORS[color]?.bg, color: COLORS[color]?.text,
    border: `0.5px solid ${COLORS[color]?.border}`,
    borderRadius: 5, padding: small ? "1px 5px" : "2px 7px",
    fontSize: small ? 11 : 12, fontWeight: 500, whiteSpace: "nowrap"
  }}>{children}</span>
);

const TABS = ["Tracker", "Dashboard", "Reminders"];

export default function App() {
  const [roles, setRoles] = useState(INIT_ROLES);
  const [tab, setTab] = useState(0);
  const [filterCat, setFilterCat] = useState("All");
  const [filterDay, setFilterDay] = useState("All");
  const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);
  const [editing, setEditing] = useState(null); // { id, day }
  const [editVal, setEditVal] = useState("");

  // reminders
  const [reminderDay, setReminderDay] = useState("mon");
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderPreviews, setReminderPreviews] = useState([]);
  const [reminderSent, setReminderSent] = useState(false);
  const [toast, setToast] = useState(null);

  const cats = useMemo(() => ["All", ...Array.from(new Set(INIT_ROLES.map(r => r.cat)))], []);

  const filtered = useMemo(() => roles.filter(r => {
    if (filterCat !== "All" && r.cat !== filterCat) return false;
    if (showOnlyEmpty) {
      const days = filterDay === "All" ? DAY_KEYS : [DAY_KEYS[DAYS.indexOf(filterDay)] ?? filterDay];
      return days.some(d => !filled(r.assignments[d]));
    }
    return true;
  }), [roles, filterCat, filterDay, showOnlyEmpty]);

  const stats = useMemo(() => {
    let total = 0, filledCount = 0;
    roles.forEach(r => DAY_KEYS.forEach(d => { total++; if (filled(r.assignments[d])) filledCount++; }));
    return { total, filled: filledCount, empty: total - filledCount, pct: Math.round(filledCount / total * 100) };
  }, [roles]);

  const dayStats = useMemo(() => DAY_KEYS.map((d, i) => {
    let f = 0, t = roles.length;
    roles.forEach(r => { if (filled(r.assignments[d])) f++; });
    return { label: DAYS[i], f, t, pct: Math.round(f / t * 100) };
  }), [roles]);

  function startEdit(id, day, cur) {
    setEditing({ id, day });
    setEditVal(cur);
  }

  function commitEdit() {
    if (!editing) return;
    setRoles(p => p.map(r => r.id === editing.id
      ? { ...r, assignments: { ...r.assignments, [editing.day]: editVal.trim() } }
      : r
    ));
    setEditing(null);
  }

  function copyDayAcrossWeek(id, srcDay) {
    const role = roles.find(r => r.id === id);
    const val = role?.assignments[srcDay] || "";
    if (!val) return;
    setRoles(p => p.map(r => r.id === id ? { ...r, assignments: mkDay(val) } : r));
    showToast(`Copied "${val}" across all days`);
  }

  function showToast(msg, color = "green") {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  }

  async function generateReminders() {
    const dayIdx = DAY_KEYS.indexOf(reminderDay);
    const dayLabel = DAYS[dayIdx];
    const assigned = roles.filter(r => filled(r.assignments[reminderDay]));
    if (assigned.length === 0) { showToast("No volunteers assigned for that day", "amber"); return; }
    setReminderLoading(true);
    setReminderPreviews([]);
    setReminderSent(false);

    const groups = {};
    assigned.forEach(r => {
      const name = r.assignments[reminderDay];
      if (!groups[name]) groups[name] = [];
      groups[name].push(r);
    });

    const previews = await Promise.all(Object.entries(groups).map(async ([name, rs]) => {
      const roleList = rs.map(r => `• ${r.role} (${r.start}–${r.end})`).join("\n");
      const body = await (async () => {
        try {
          const resp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514", max_tokens: 500,
              messages: [{ role: "user", content:
                `Write a short, warm shift reminder email (2 paragraphs) for volunteer ${name} who is working on ${dayLabel}. Their role(s):\n${roleList}\nSign off as "The Event Coordination Team". Return only the email body.`
              }]
            })
          });
          const d = await resp.json();
          return d.content?.find(b => b.type === "text")?.text || "";
        } catch { return "Reminder could not be generated."; }
      })();
      return { name, roles: rs, dayLabel, subject: `Reminder: Your shift on ${dayLabel}`, body };
    }));

    setReminderPreviews(previews);
    setReminderLoading(false);
  }

  function sendReminders() {
    setReminderSent(true);
    showToast(`${reminderPreviews.length} reminder${reminderPreviews.length > 1 ? "s" : ""} sent`, "teal");
  }

  const visibleDays = filterDay === "All" ? DAY_KEYS : [DAY_KEYS[DAYS.findIndex(d => d === filterDay)]].filter(Boolean);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", padding: "0.75rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>2026 Key Volunteer Tracker</h1>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>Sept 28 – Oct 3 · {roles.length} roles</p>
      </div>

      {toast && (
        <div style={{
          background: COLORS[toast.color]?.bg, color: COLORS[toast.color]?.text,
          border: `0.5px solid ${COLORS[toast.color]?.border}`,
          borderRadius: 8, padding: "8px 12px", marginBottom: "0.75rem", fontSize: 13
        }}>{toast.msg}</div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "1rem" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            background: "none", border: "none",
            borderBottom: tab === i ? "2px solid var(--color-text-primary)" : "2px solid transparent",
            padding: "5px 12px", fontWeight: tab === i ? 500 : 400, cursor: "pointer",
            color: tab === i ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            marginBottom: -1, fontSize: 13
          }}>{t}</button>
        ))}
      </div>

      {/* ── TRACKER ── */}
      {tab === 0 && (
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem", alignItems: "center" }}>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ fontSize: 12, padding: "4px 8px" }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filterDay} onChange={e => setFilterDay(e.target.value)} style={{ fontSize: 12, padding: "4px 8px" }}>
              <option value="All">All days</option>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={showOnlyEmpty} onChange={e => setShowOnlyEmpty(e.target.checked)} />
              Show unfilled only
            </label>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
              {filtered.length} roles · click a cell to assign
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "var(--color-background-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, whiteSpace: "nowrap", borderBottom: "0.5px solid var(--color-border-tertiary)", position: "sticky", left: 0, background: "var(--color-background-secondary)", minWidth: 180 }}>Role</th>
                  <th style={{ textAlign: "center", padding: "6px 4px", fontWeight: 400, color: "var(--color-text-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)", whiteSpace: "nowrap", minWidth: 40 }}>CC</th>
                  <th style={{ textAlign: "center", padding: "6px 4px", fontWeight: 400, color: "var(--color-text-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)", whiteSpace: "nowrap", minWidth: 80 }}>Hours</th>
                  {(filterDay === "All" ? DAYS : DAYS.filter(d => d === filterDay)).map(d => (
                    <th key={d} style={{ textAlign: "center", padding: "6px 6px", fontWeight: 500, borderBottom: "0.5px solid var(--color-border-tertiary)", whiteSpace: "nowrap", minWidth: 90 }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const catColor = CAT_COLORS[r.cat] || "gray";
                  const days = filterDay === "All" ? DAY_KEYS : [DAY_KEYS[DAYS.findIndex(d => d === filterDay)]].filter(Boolean);
                  return (
                    <tr key={r.id} style={{ background: idx % 2 === 0 ? "transparent" : "var(--color-background-secondary)" }}>
                      <td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)", position: "sticky", left: 0, background: idx % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          {r.special && <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS[catColor].text, flexShrink: 0, display: "inline-block" }} />}
                          <span style={{ color: "var(--color-text-primary)" }}>{r.role}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{r.cat}</div>
                      </td>
                      <td style={{ textAlign: "center", padding: "5px 4px", borderBottom: "0.5px solid var(--color-border-tertiary)", color: "var(--color-text-secondary)" }}>{r.cc || "—"}</td>
                      <td style={{ textAlign: "center", padding: "5px 4px", borderBottom: "0.5px solid var(--color-border-tertiary)", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{r.start}–{r.end}</td>
                      {days.map(d => {
                        const val = r.assignments[d];
                        const isEditing = editing?.id === r.id && editing?.day === d;
                        return (
                          <td key={d} style={{ padding: "3px 4px", borderBottom: "0.5px solid var(--color-border-tertiary)", textAlign: "center" }}>
                            {isEditing ? (
                              <input
                                autoFocus
                                value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
                                style={{ width: 82, fontSize: 12, padding: "2px 4px", borderRadius: 4, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}
                              />
                            ) : (
                              <div
                                onClick={() => startEdit(r.id, d, val)}
                                title={val ? `${val} — click to edit, double-click to copy across week` : "Click to assign"}
                                onDoubleClick={() => val && copyDayAcrossWeek(r.id, d)}
                                style={{
                                  minHeight: 26, cursor: "pointer", borderRadius: 5, padding: "3px 5px",
                                  background: filled(val) ? COLORS[catColor].bg : "transparent",
                                  color: filled(val) ? COLORS[catColor].text : "var(--color-text-secondary)",
                                  border: filled(val) ? `0.5px solid ${COLORS[catColor].border}` : "0.5px dashed var(--color-border-tertiary)",
                                  fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 90
                                }}
                              >{filled(val) ? val : <span style={{ opacity: 0.4 }}>—</span>}</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {tab === 1 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginBottom: "1.25rem" }}>
            {[
              ["Total slots", stats.total, "gray"],
              ["Filled", stats.filled, "green"],
              ["Unfilled", stats.empty, stats.empty > 0 ? "red" : "green"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: COLORS[c].text }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Overall coverage</span>
              <span style={{ fontWeight: 500 }}>{stats.pct}%</span>
            </div>
            <div style={{ height: 8, background: "var(--color-border-tertiary)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${stats.pct}%`, background: COLORS.green.text, borderRadius: 4, transition: "width 0.4s" }} />
            </div>
          </div>

          {/* Per-day breakdown */}
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: "0.75rem" }}>Coverage by day</div>
            {dayStats.map(ds => (
              <div key={ds.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span>{ds.label}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{ds.f}/{ds.t} · {ds.pct}%</span>
                </div>
                <div style={{ height: 6, background: "var(--color-border-tertiary)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${ds.pct}%`, background: ds.pct === 100 ? COLORS.green.text : ds.pct > 50 ? COLORS.amber.text : COLORS.red.text, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Unfilled roles */}
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem" }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: "0.75rem" }}>Roles needing volunteers</div>
            {roles.filter(r => DAY_KEYS.some(d => !filled(r.assignments[d]))).slice(0, 15).map(r => {
              const missingDays = DAY_KEYS.filter(d => !filled(r.assignments[d]));
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
                  <span style={{ flex: 1 }}>{r.role}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{r.start}</span>
                  <Badge color="red" small>{missingDays.length}d open</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REMINDERS ── */}
      {tab === 2 && (
        <div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: "0.5rem" }}>Send shift reminders</div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1rem" }}>
              Generate AI-written reminder emails for all volunteers assigned on a given day.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "1rem" }}>
              <select value={reminderDay} onChange={e => { setReminderDay(e.target.value); setReminderPreviews([]); setReminderSent(false); }} style={{ fontSize: 13 }}>
                {DAY_KEYS.map((d, i) => <option key={d} value={d}>{DAYS[i]}</option>)}
              </select>
              <button onClick={generateReminders} disabled={reminderLoading} style={{ fontSize: 13, padding: "6px 14px" }}>
                {reminderLoading ? "Generating…" : "✦ Generate reminders"}
              </button>
            </div>
          </div>

          {reminderPreviews.length > 0 && (
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: "0.75rem" }}>{reminderPreviews.length} reminder{reminderPreviews.length > 1 ? "s" : ""} for {DAYS[DAY_KEYS.indexOf(reminderDay)]}</div>
              {reminderPreviews.map((p, i) => (
                <div key={i} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{p.subject}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                    To: {p.name} · {p.roles.map(r => r.role).join(", ")}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{p.body}</div>
                </div>
              ))}
              {!reminderSent
                ? <button onClick={sendReminders} style={{ fontSize: 13, padding: "6px 16px" }}>Send all {reminderPreviews.length} reminder{reminderPreviews.length > 1 ? "s" : ""}</button>
                : <div style={{ fontSize: 13, color: COLORS.green.text, fontWeight: 500 }}>✓ All reminders sent</div>
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
