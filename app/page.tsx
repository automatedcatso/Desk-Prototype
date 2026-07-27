"use client";

import { useMemo, useState } from "react";

type View = "Dashboard" | "Projects" | "CP Network" | "Leads" | "Commissions";
type PartnerModule = "Browse" | "Compare" | "My Leads" | "My Commissions";
type LeadStatus = "New" | "Contacted" | "Site Visit" | "Booked";

const navigation: { label: View; icon: string; count?: number }[] = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Projects", icon: "▰" },
  { label: "CP Network", icon: "◎", count: 5 },
  { label: "Leads", icon: "↗", count: 12 },
  { label: "Commissions", icon: "₹", count: 2 },
];

const partnerNavigation: { label: PartnerModule; icon: string }[] = [
  { label: "Browse", icon: "⌕" },
  { label: "Compare", icon: "⇄" },
  { label: "My Leads", icon: "↗" },
  { label: "My Commissions", icon: "₹" },
];

const initialLeads = [
  { buyer: "Aarav Mehta", phone: "•••• 4821", project: "Vanya Residences", cp: "Rohan Shah", budget: "₹1.24 Cr", status: "Site Visit" as LeadStatus, age: "12 min ago", duplicate: false },
  { buyer: "Neha Kulkarni", phone: "•••• 1178", project: "The Grove", cp: "Priya B.", budget: "₹86 L", status: "Contacted" as LeadStatus, age: "34 min ago", duplicate: false },
  { buyer: "Kabir Nair", phone: "•••• 9024", project: "Aria Heights", cp: "Sahil Jain", budget: "₹1.08 Cr", status: "New" as LeadStatus, age: "1 hr ago", duplicate: true },
  { buyer: "Mira Deshmukh", phone: "•••• 3440", project: "Vanya Residences", cp: "Ananya Rao", budget: "₹1.46 Cr", status: "Booked" as LeadStatus, age: "Yesterday", duplicate: false },
];

const projects = [
  { name: "Vanya Residences", locality: "Kharadi", developer: "Northstar Realty", config: "2 & 3 BHK", price: "₹94 L – ₹1.58 Cr", minPrice: 94, commission: "2.5%", units: "28 of 148 left", unitsLeft: 28, unitsTotal: 148, possession: "Dec 2027", rera: "P52100054821", status: "Active", tone: "sage" },
  { name: "Aria Heights", locality: "Baner", developer: "Northstar Realty", config: "2, 3 & 4 BHK", price: "₹1.08 – ₹2.42 Cr", minPrice: 108, commission: "2.0%", units: "41 of 202 left", unitsLeft: 41, unitsTotal: 202, possession: "Jun 2028", rera: "P52100061204", status: "Active", tone: "sand" },
  { name: "The Grove", locality: "Wagholi", developer: "Northstar Realty", config: "1 & 2 BHK", price: "₹54 – ₹92 L", minPrice: 54, commission: "3.0%", units: "63 of 284 left", unitsLeft: 63, unitsTotal: 284, possession: "Mar 2027", rera: "P52100049716", status: "Active", tone: "slate" },
  { name: "Cedar Court", locality: "Kondhwa", developer: "Northstar Realty", config: "2 BHK", price: "₹72 – ₹88 L", minPrice: 72, commission: "2.25%", units: "0 of 96 left", unitsLeft: 0, unitsTotal: 96, possession: "Ready", rera: "P52100043892", status: "Sold Out", tone: "rose" },
];

const partners = [
  { name: "Rohan Shah", agency: "Urban Keys Realty", locality: "Kharadi", leads: 48, bookings: 7, status: "Active" },
  { name: "Priya Bhosale", agency: "Nest Square", locality: "Baner", leads: 36, bookings: 5, status: "Active" },
  { name: "Sahil Jain", agency: "Blue Door Homes", locality: "Viman Nagar", leads: 21, bookings: 3, status: "Pending" },
  { name: "Ananya Rao", agency: "OwnSpace Realty", locality: "Hinjewadi", leads: 29, bookings: 4, status: "Active" },
];

const commissions = [
  { cp: "Ananya Rao", agency: "OwnSpace Realty", project: "Vanya Residences", buyer: "Mira Deshmukh", amount: "₹3,65,000", due: "12 Aug 2026", status: "Pending" },
  { cp: "Rohan Shah", agency: "Urban Keys Realty", project: "Aria Heights", buyer: "Vihaan Shah", amount: "₹2,42,000", due: "06 Aug 2026", status: "Disputed" },
  { cp: "Priya Bhosale", agency: "Nest Square", project: "The Grove", buyer: "Ishaan Joshi", amount: "₹2,58,000", due: "28 Jul 2026", status: "Approved" },
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return <span className="avatar" aria-hidden="true">{initials}</span>;
}

function Status({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status ${tone || String(children).toLowerCase().replace(" ", "-")}`}><i />{children}</span>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Dashboard");
  const [workspace, setWorkspace] = useState<"Developer" | "Partner">("Developer");
  const [partnerModule, setPartnerModule] = useState<PartnerModule>("Browse");
  const [partnerShortlist, setPartnerShortlist] = useState<string[]>(["Vanya Residences"]);
  const [leads, setLeads] = useState(initialLeads);
  const [approvedPartners, setApprovedPartners] = useState<string[]>([]);
  const [approvedCommissions, setApprovedCommissions] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const advanceLead = (buyer: string) => {
    const flow: LeadStatus[] = ["New", "Contacted", "Site Visit", "Booked"];
    setLeads((items) => items.map((lead) => {
      if (lead.buyer !== buyer || lead.status === "Booked") return lead;
      return { ...lead, status: flow[flow.indexOf(lead.status) + 1] };
    }));
    notify(`${buyer}'s lead moved forward`);
  };

  const headline = useMemo(() => {
    if (workspace === "Partner") {
      if (partnerModule === "Compare") return "Compare every detail. Recommend with confidence.";
      if (partnerModule === "My Leads") return "Every buyer. Every update. One clear pipeline.";
      if (partnerModule === "My Commissions") return "Your earnings, without the guesswork.";
      return "Find the right project for every buyer.";
    }
    if (activeView === "Dashboard") return "Good morning, Ishaan.";
    return activeView;
  }, [activeView, partnerModule, workspace]);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${workspace === "Partner" ? "partner-sidebar" : ""}`}>
        <div>
          <button className="brand" onClick={() => workspace === "Partner" ? setPartnerModule("Browse") : setActiveView("Dashboard")}>
            <span className="brand-mark">D</span>
            <span>Desk</span>
          </button>

          <div className="workspace-switch" role="group" aria-label="Preview workspace">
            <button className={workspace === "Developer" ? "selected" : ""} onClick={() => setWorkspace("Developer")}>Developer</button>
            <button className={workspace === "Partner" ? "selected" : ""} onClick={() => { setWorkspace("Partner"); setPartnerModule("Browse"); }}>Partner</button>
          </div>

          <p className="nav-section-label">{workspace === "Developer" ? "Developer tools" : "Partner tools"}</p>
          <nav className={workspace === "Partner" ? "partner-nav" : ""} aria-label={workspace === "Developer" ? "Developer navigation" : "Partner navigation"}>
            {workspace === "Developer" ? navigation.map((item) => (
              <button
                key={item.label}
                className={activeView === item.label ? "nav-item active" : "nav-item"}
                onClick={() => setActiveView(item.label)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.count ? <b>{item.count}</b> : null}
              </button>
            )) : partnerNavigation.map((item) => {
              const count = item.label === "Compare" ? partnerShortlist.length : item.label === "My Leads" ? seededPartnerLeads.length : item.label === "My Commissions" ? 1 : 0;
              return (
                <button
                  key={item.label}
                  className={partnerModule === item.label ? "nav-item active" : "nav-item"}
                  onClick={() => setPartnerModule(item.label)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {count ? <b>{count}</b> : null}
                </button>
              );
            })}
          </nav>
          {workspace === "Partner" ? <div className="partner-sidebar-card"><span>Approved access</span><strong>4 live projects</strong><small>Northstar Realty inventory</small></div> : null}
        </div>

        <div className="sidebar-foot">
          <button className="nav-item"><span className="nav-icon">?</span><span>Help centre</span></button>
          <div className="profile">
            <Avatar name={workspace === "Partner" ? "Rohan Shah" : "Ishaan Kapoor"} />
            <div><strong>{workspace === "Partner" ? "Rohan Shah" : "Ishaan Kapoor"}</strong><span>{workspace === "Partner" ? "Urban Keys Realty" : "Developer admin"}</span></div>
            <button aria-label="Open profile menu">•••</button>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="crumbs"><span>{workspace === "Partner" ? "Urban Keys Realty" : "Northstar Realty"}</span><i>/</i><strong>{workspace === "Partner" ? partnerModule : activeView}</strong></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search">⌕</button>
            <button className="icon-button has-notice" aria-label="Notifications">◦</button>
            <button className="primary small" onClick={() => { if (workspace === "Partner") setPartnerModule("My Leads"); notify(workspace === "Partner" ? "Open a project to submit a new lead" : "New lead form ready"); }}>＋ New lead</button>
          </div>
        </header>

        <div className="content">
          <div className="page-heading" key={`${workspace}-${workspace === "Partner" ? partnerModule : activeView}`}>
            <div>
              <p className="eyebrow">{workspace === "Partner" ? `${partnerModule} · Partner workspace` : activeView === "Dashboard" ? "Monday, 27 July" : "Northstar Realty"}</p>
              <h1>{headline}</h1>
              <p>{workspace === "Partner" ? "A focused workspace for your projects, buyers, and earnings." : activeView === "Dashboard" ? "Here’s what’s moving across your partner network today." : `Manage ${activeView.toLowerCase()} with one shared source of truth.`}</p>
            </div>
            <button className="date-control">Last 30 days <span>⌄</span></button>
          </div>

          {workspace === "Partner" ? (
            <PartnerView module={partnerModule} setModule={setPartnerModule} shortlist={partnerShortlist} setShortlist={setPartnerShortlist} notify={notify} />
          ) : activeView === "Dashboard" ? (
            <Dashboard leads={leads} advanceLead={advanceLead} setActiveView={setActiveView} />
          ) : activeView === "Projects" ? (
            <ProjectsView notify={notify} />
          ) : activeView === "Leads" ? (
            <LeadsView leads={leads} advanceLead={advanceLead} />
          ) : activeView === "CP Network" ? (
            <PartnersView approved={approvedPartners} onApprove={(name) => { setApprovedPartners((p) => [...p, name]); notify(`${name} is now active`); }} />
          ) : (
            <CommissionsView approved={approvedCommissions} onApprove={(buyer) => { setApprovedCommissions((p) => [...p, buyer]); notify(`Commission for ${buyer} approved`); }} />
          )}
        </div>
      </section>
      {toast ? <div className="toast"><span>✓</span>{toast}</div> : null}
    </main>
  );
}

function Dashboard({ leads, advanceLead, setActiveView }: { leads: typeof initialLeads; advanceLead: (buyer: string) => void; setActiveView: (view: View) => void }) {
  const stats = [
    { label: "Total leads", value: "284", trend: "+18.4%", meta: "12 duplicates", tone: "ink" },
    { label: "Active partners", value: "68", trend: "+6.2%", meta: "5 await approval", tone: "blue" },
    { label: "Bookings", value: "32", trend: "+12.1%", meta: "across 6 projects", tone: "sage" },
    { label: "Commission payable", value: "₹18.4 L", trend: "₹4.6 L", meta: "2 under dispute", tone: "sand" },
  ];
  return (
    <>
      <section className="stats-grid">
        {stats.map((stat) => (
          <article className={`stat-card ${stat.tone}`} key={stat.label}>
            <div className="stat-label"><span>{stat.label}</span><button aria-label={`More about ${stat.label}`}>•••</button></div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-meta"><strong>{stat.label === "Commission payable" ? stat.trend : `↗ ${stat.trend}`}</strong><span>{stat.meta}</span></div>
          </article>
        ))}
      </section>

      <section className="overview-grid">
        <article className="panel funnel-panel">
          <div className="panel-head">
            <div><h2>Lead funnel</h2><p>Conversion across active inventory</p></div>
            <button>View report ↗</button>
          </div>
          <div className="funnel">
            {[
              { label: "New", value: 124, width: 100, color: "navy" },
              { label: "Contacted", value: 86, width: 72, color: "blue" },
              { label: "Site visit", value: 42, width: 46, color: "mint" },
              { label: "Booked", value: 32, width: 32, color: "gold" },
            ].map((stage) => (
              <div className="funnel-row" key={stage.label}>
                <span>{stage.label}</span>
                <div className="funnel-track"><div className={stage.color} style={{ width: `${stage.width}%` }}><b>{stage.value}</b></div></div>
                <small>{Math.round(stage.value / 2.84)}%</small>
              </div>
            ))}
          </div>
          <div className="conversion-note"><span>↗</span><div><strong>11.3% booking conversion</strong><p>Up 2.4% from the previous period</p></div></div>
        </article>

        <article className="panel attention">
          <div className="panel-head">
            <div><h2>Needs your attention</h2><p>Three workflows are waiting</p></div>
            <span className="attention-count">19</span>
          </div>
          {[
            { icon: "!", title: "Duplicate leads", meta: "12 need ownership review", view: "Leads" as View, tone: "rose" },
            { icon: "◎", title: "Partner approvals", meta: "5 partners waiting", view: "CP Network" as View, tone: "blue" },
            { icon: "₹", title: "Commission disputes", meta: "₹2.84 L in question", view: "Commissions" as View, tone: "sand" },
          ].map((item) => (
            <button className="attention-row" key={item.title} onClick={() => setActiveView(item.view)}>
              <span className={`attention-icon ${item.tone}`}>{item.icon}</span>
              <span><strong>{item.title}</strong><small>{item.meta}</small></span>
              <b>→</b>
            </button>
          ))}
        </article>
      </section>

      <article className="panel recent-panel">
        <div className="panel-head">
          <div><h2>Recent leads</h2><p>Live activity from your partner network</p></div>
          <button onClick={() => setActiveView("Leads")}>View all leads →</button>
        </div>
        <LeadTable leads={leads} advanceLead={advanceLead} compact />
      </article>
    </>
  );
}

function LeadTable({ leads, advanceLead, compact = false }: { leads: typeof initialLeads; advanceLead: (buyer: string) => void; compact?: boolean }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Buyer</th><th>Project</th><th>Channel partner</th><th>Budget</th><th>Status</th><th aria-label="Actions" /></tr></thead>
        <tbody>
          {(compact ? leads.slice(0, 4) : leads).map((lead) => (
            <tr key={lead.buyer}>
              <td><div className="person-cell"><Avatar name={lead.buyer} /><span><strong>{lead.buyer}{lead.duplicate ? <em title="Possible duplicate">!</em> : null}</strong><small>{lead.phone} · {lead.age}</small></span></div></td>
              <td><strong>{lead.project}</strong></td>
              <td>{lead.cp}</td>
              <td><strong>{lead.budget}</strong></td>
              <td><Status>{lead.status}</Status></td>
              <td><button className="table-action" onClick={() => advanceLead(lead.buyer)} disabled={lead.status === "Booked"}>{lead.status === "Booked" ? "Done" : "Advance →"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectsView({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
          <div className={`project-visual ${project.tone}`}>
            <span>{project.locality}</span><b>{project.name.slice(0, 1)}</b><Status>{project.status}</Status>
          </div>
          <div className="project-body">
            <div><h2>{project.name}</h2><p>{project.config} · {project.locality}</p></div>
            <dl><div><dt>Price range</dt><dd>{project.price}</dd></div><div><dt>Partner fee</dt><dd>{project.commission}</dd></div><div><dt>Inventory</dt><dd>{project.units}</dd></div><div><dt>RERA</dt><dd>{project.rera}</dd></div></dl>
            <div className="card-actions"><button className="secondary" onClick={() => notify(`${project.name} details opened`)}>View details</button><button className="primary" onClick={() => notify(`${project.name} is ready to edit`)}>Edit project</button></div>
          </div>
        </article>
      ))}
      <button className="add-card" onClick={() => notify("New project form ready")}><span>＋</span><strong>Add a project</strong><small>Publish new inventory to partners</small></button>
    </div>
  );
}

function LeadsView({ leads, advanceLead }: { leads: typeof initialLeads; advanceLead: (buyer: string) => void }) {
  return <article className="panel list-page"><div className="toolbar"><div className="search-box">⌕ <input aria-label="Search leads" placeholder="Search buyer, project or partner" /></div><button className="filter-button">All statuses ⌄</button><button className="filter-button">Newest first ⌄</button></div><LeadTable leads={leads} advanceLead={advanceLead} /></article>;
}

function PartnersView({ approved, onApprove }: { approved: string[]; onApprove: (name: string) => void }) {
  return <article className="panel list-page"><div className="toolbar"><div className="search-box">⌕ <input aria-label="Search partners" placeholder="Search partner or agency" /></div><button className="filter-button">All localities ⌄</button><button className="filter-button">All statuses ⌄</button></div><div className="table-wrap"><table><thead><tr><th>Partner</th><th>Locality</th><th>Lifetime leads</th><th>Bookings</th><th>Status</th><th /></tr></thead><tbody>{partners.map((partner) => { const isApproved = approved.includes(partner.name) || partner.status === "Active"; return <tr key={partner.name}><td><div className="person-cell"><Avatar name={partner.name} /><span><strong>{partner.name}</strong><small>{partner.agency}</small></span></div></td><td>{partner.locality}</td><td><strong>{partner.leads}</strong></td><td><strong>{partner.bookings}</strong></td><td><Status>{isApproved ? "Active" : "Pending"}</Status></td><td>{isApproved ? <button className="table-action">View →</button> : <button className="approve" onClick={() => onApprove(partner.name)}>Approve</button>}</td></tr>; })}</tbody></table></div></article>;
}

function CommissionsView({ approved, onApprove }: { approved: string[]; onApprove: (buyer: string) => void }) {
  return <article className="panel list-page"><div className="commission-summary"><div><span>Pending approval</span><strong>₹8.46 L</strong></div><div><span>Approved, unpaid</span><strong>₹9.94 L</strong></div><div><span>Paid this cycle</span><strong>₹12.82 L</strong></div></div><div className="table-wrap"><table><thead><tr><th>Channel partner</th><th>Project / buyer</th><th>Amount</th><th>Due</th><th>Status</th><th /></tr></thead><tbody>{commissions.map((item) => { const isApproved = approved.includes(item.buyer) || item.status === "Approved"; return <tr key={item.buyer}><td><div className="person-cell"><Avatar name={item.cp} /><span><strong>{item.cp}</strong><small>{item.agency}</small></span></div></td><td><strong>{item.project}</strong><br/><small>{item.buyer}</small></td><td><strong>{item.amount}</strong></td><td>{item.due}</td><td><Status>{isApproved ? "Approved" : item.status}</Status></td><td>{item.status === "Disputed" ? <button className="resolve">Resolve</button> : isApproved ? <button className="table-action">Mark paid</button> : <button className="approve" onClick={() => onApprove(item.buyer)}>Approve</button>}</td></tr>; })}</tbody></table></div></article>;
}

type PartnerLead = {
  buyer: string;
  phone: string;
  project: string;
  budget: string;
  submitted: string;
  status: LeadStatus | "Rejected";
  duplicate: boolean;
};
type PartnerCommission = {
  project: string;
  buyer: string;
  amount: string;
  due: string;
  status: "Pending" | "Approved" | "Paid" | "Disputed";
};

const seededPartnerLeads: PartnerLead[] = [
  { buyer: "Aarav Mehta", phone: "98765 48210", project: "Vanya Residences", budget: "₹1.24 Cr", submitted: "27 Jul 2026", status: "Site Visit", duplicate: false },
  { buyer: "Ishita Verma", phone: "98220 01178", project: "The Grove", budget: "₹84 L", submitted: "25 Jul 2026", status: "Contacted", duplicate: true },
  { buyer: "Vihaan Shah", phone: "97654 39024", project: "Aria Heights", budget: "₹1.18 Cr", submitted: "18 Jul 2026", status: "Booked", duplicate: false },
  { buyer: "Reyansh Pillai", phone: "98901 23440", project: "Vanya Residences", budget: "₹1.42 Cr", submitted: "11 Jul 2026", status: "Rejected", duplicate: false },
];

const seededPartnerCommissions: PartnerCommission[] = [
  { project: "Aria Heights", buyer: "Vihaan Shah", amount: "₹2,36,000", due: "06 Aug 2026", status: "Approved" },
  { project: "Vanya Residences", buyer: "Mira Deshmukh", amount: "₹3,65,000", due: "12 Aug 2026", status: "Pending" },
  { project: "The Grove", buyer: "Ishaan Joshi", amount: "₹2,58,000", due: "28 Jul 2026", status: "Paid" },
];

function PartnerView({ module, setModule, shortlist, setShortlist, notify }: { module: PartnerModule; setModule: (module: PartnerModule) => void; shortlist: string[]; setShortlist: React.Dispatch<React.SetStateAction<string[]>>; notify: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const [locality, setLocality] = useState("All");
  const [budget, setBudget] = useState("All");
  const [projectStatus, setProjectStatus] = useState("All");
  const [leadProject, setLeadProject] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerMobile, setBuyerMobile] = useState("");
  const [buyerBudget, setBuyerBudget] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [partnerLeads, setPartnerLeads] = useState<PartnerLead[]>(seededPartnerLeads);
  const [partnerCommissions, setPartnerCommissions] = useState<PartnerCommission[]>(seededPartnerCommissions);
  const [queryTarget, setQueryTarget] = useState<string | null>(null);
  const [queryNote, setQueryNote] = useState("");
  const [queryError, setQueryError] = useState("");

  const duplicateMobile = buyerMobile.replace(/\D/g, "") === "9822001178";
  const visibleProjects = projects.filter((project) => {
    const textMatch = `${project.name} ${project.locality}`.toLowerCase().includes(search.toLowerCase());
    const localityMatch = locality === "All" || project.locality === locality;
    const statusMatch = projectStatus === "All" || project.status === projectStatus;
    const budgetMatch =
      budget === "All" ||
      (budget === "Under ₹60 L" && project.minPrice < 60) ||
      (budget === "₹60 L – ₹1 Cr" && project.minPrice >= 60 && project.minPrice <= 100) ||
      (budget === "₹1 Cr – ₹1.5 Cr" && project.minPrice > 100 && project.minPrice <= 150) ||
      (budget === "Above ₹1.5 Cr" && project.minPrice > 150);
    return textMatch && localityMatch && statusMatch && budgetMatch;
  });

  const openLeadForm = (project: string) => {
    setLeadProject(project);
    setBuyerName("");
    setBuyerMobile("");
    setBuyerBudget("");
    setFormErrors({});
  };

  const submitLead = () => {
    const errors: Record<string, string> = {};
    if (!leadProject) errors.project = "Choose an active project.";
    if (!buyerName.trim()) errors.name = "Enter the buyer’s name.";
    if (!/^\d{10}$/.test(buyerMobile.replace(/\D/g, ""))) errors.mobile = "Enter a valid 10-digit mobile number.";
    if (!buyerBudget || Number(buyerBudget) <= 0) errors.budget = "Enter a valid budget.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    setPartnerLeads((current) => [{
      buyer: buyerName.trim(),
      phone: buyerMobile.replace(/\D/g, "").replace(/(\d{5})(\d{5})/, "$1 $2"),
      project: leadProject || "",
      budget: `₹${Number(buyerBudget).toLocaleString("en-IN")}`,
      submitted: "27 Jul 2026",
      status: "New",
      duplicate: duplicateMobile,
    }, ...current]);
    setLeadProject(null);
    setModule("My Leads");
    notify(duplicateMobile ? "Lead submitted and flagged for duplicate review" : "Lead submitted successfully");
  };

  const toggleShortlist = (project: string) => {
    const selected = shortlist.includes(project);
    if (!selected && shortlist.length === 3) {
      notify("You can compare up to 3 projects");
      return;
    }
    setShortlist((current) => selected ? current.filter((item) => item !== project) : [...current, project]);
  };

  const submitQuery = () => {
    if (!queryNote.trim()) {
      setQueryError("Add a short note so the developer can review your query.");
      return;
    }
    setPartnerCommissions((current) => current.map((item) => item.buyer === queryTarget ? { ...item, status: "Disputed" } : item));
    setQueryTarget(null);
    setQueryNote("");
    setQueryError("");
    notify("Query raised. The developer has been notified.");
  };

  return (
    <section className="partner-workspace">
      <div className="partner-identity">
        <div>
          <span className="partner-kicker">Urban Keys Realty</span>
          <strong>Rohan Shah</strong>
          <small>Approved partner · Kharadi</small>
        </div>
        <div className="partner-quick-stats">
          <span><b>12</b> active leads</span>
          <span><b>₹4.82 L</b> pending</span>
        </div>
      </div>

      <div className="module-stage" key={module}>
      {module === "Browse" ? (
        <>
          <div className="partner-toolbar">
            <label className="search-large">⌕<input aria-label="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects or localities" /></label>
            <label className="select-control"><span>Locality</span><select value={locality} onChange={(event) => setLocality(event.target.value)}><option>All</option><option>Kharadi</option><option>Baner</option><option>Wagholi</option><option>Kondhwa</option></select></label>
            <label className="select-control"><span>Budget</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option>All</option><option>Under ₹60 L</option><option>₹60 L – ₹1 Cr</option><option>₹1 Cr – ₹1.5 Cr</option><option>Above ₹1.5 Cr</option></select></label>
            <label className="select-control"><span>Status</span><select value={projectStatus} onChange={(event) => setProjectStatus(event.target.value)}><option>All</option><option>Active</option><option>Sold Out</option></select></label>
          </div>

          <div className="results-line">
            <span><strong>{visibleProjects.length}</strong> projects available</span>
            <button onClick={() => setModule("Compare")}>Compare shortlist <b>{shortlist.length}</b> →</button>
          </div>

          {visibleProjects.length ? <section className="partner-projects">
            {visibleProjects.map((project) => {
              const selected = shortlist.includes(project.name);
              const availability = Math.round((project.unitsLeft / project.unitsTotal) * 100);
              return (
                <article className={`listing-card ${project.status === "Sold Out" ? "sold-out" : ""}`} key={project.name}>
                  <div className={`listing-visual ${project.tone}`}>
                    <span className="listing-location">{project.locality}</span>
                    <div className="listing-monogram">{project.name.slice(0, 2).toUpperCase()}</div>
                    <button className={selected ? "compare selected" : "compare"} onClick={() => toggleShortlist(project.name)}>{selected ? "✓ Added" : "＋ Compare"}</button>
                  </div>
                  <div className="listing-content">
                    <div>
                      <Status>{project.status}</Status>
                      <h2>{project.name}</h2>
                      <p>{project.developer} · {project.config}</p>
                    </div>
                    <div className="listing-facts">
                      <div><span>Price range</span><strong>{project.price}</strong></div>
                      <div><span>Possession</span><strong>{project.possession}</strong></div>
                    </div>
                    <div className="commission-banner"><span>Your commission</span><strong>{project.commission}</strong><small>on booked value</small></div>
                    <div className="inventory">
                      <span>{project.units}</span>
                      <i><b style={{ width: `${availability}%` }} /></i>
                    </div>
                    <button className="primary full" disabled={project.status === "Sold Out"} onClick={() => openLeadForm(project.name)}>{project.status === "Sold Out" ? "Sold out · reference only" : "Submit a lead →"}</button>
                  </div>
                </article>
              );
            })}
          </section> : <div className="empty-state"><span>⌕</span><h2>No projects match these filters</h2><p>Try a broader locality, budget, or status.</p><button className="secondary" onClick={() => { setSearch(""); setLocality("All"); setBudget("All"); setProjectStatus("All"); }}>Clear filters</button></div>}
        </>
      ) : null}

      {module === "Compare" ? (
        <CompareProjects shortlist={shortlist} remove={(name) => setShortlist((current) => current.filter((item) => item !== name))} submit={openLeadForm} goBrowse={() => setModule("Browse")} />
      ) : null}

      {module === "My Leads" ? (
        <section className="partner-section">
          <div className="section-title-row"><div><span className="partner-kicker">Your pipeline</span><h2>My leads</h2><p>Submitted leads are locked to preserve a reliable ownership record.</p></div><button className="primary" onClick={() => openLeadForm(projects.find((project) => project.status === "Active")?.name || "")}>＋ Submit lead</button></div>
          <div className="lead-pipeline">
            {["New", "Contacted", "Site Visit", "Booked"].map((status) => <span key={status}><b>{partnerLeads.filter((lead) => lead.status === status).length}</b>{status}</span>)}
          </div>
          <article className="panel partner-table">
            <div className="table-wrap"><table><thead><tr><th>Buyer</th><th>Project</th><th>Budget</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{partnerLeads.map((lead) => <tr key={`${lead.buyer}-${lead.project}`}><td><div className="person-cell"><Avatar name={lead.buyer} /><span><strong>{lead.buyer}{lead.duplicate ? <em title="Possible duplicate">!</em> : null}</strong><small>{lead.phone}{lead.duplicate ? " · Duplicate review" : ""}</small></span></div></td><td><strong>{lead.project}</strong></td><td>{lead.budget}</td><td>{lead.submitted}</td><td><Status>{lead.status}</Status></td></tr>)}</tbody></table></div>
          </article>
          <p className="integrity-note"><span>i</span>Need a correction? Contact the developer team. Leads cannot be edited or deleted after submission.</p>
        </section>
      ) : null}

      {module === "My Commissions" ? (
        <section className="partner-section">
          <div className="section-title-row"><div><span className="partner-kicker">Earnings</span><h2>My commissions</h2><p>Track every earned commission from booking to payout.</p></div><button className="secondary" onClick={() => notify("Commission statement prepared")}>Export statement</button></div>
          <div className="earning-cards">
            <article className="earning-card dark"><span>Lifetime commission</span><strong>₹18.64 L</strong><small>Across 7 bookings</small></article>
            <article className="earning-card lime"><span>Paid out</span><strong>₹13.82 L</strong><small>74% of lifetime earnings</small></article>
            <article className="earning-card cream"><span>Still pending</span><strong>₹4.82 L</strong><small>2 open commissions</small></article>
          </div>
          <article className="panel partner-table"><div className="table-wrap"><table><thead><tr><th>Project / buyer</th><th>Amount</th><th>Due date</th><th>Status</th><th /></tr></thead><tbody>{partnerCommissions.map((item) => <tr key={item.buyer}><td><strong>{item.project}</strong><br/><small>{item.buyer}</small></td><td><strong>{item.amount}</strong></td><td>{item.due}</td><td><Status>{item.status}</Status></td><td>{item.status === "Pending" || item.status === "Approved" ? <button className="query-link" onClick={() => { setQueryTarget(item.buyer); setQueryNote(""); setQueryError(""); }}>Raise a query</button> : item.status === "Disputed" ? <span className="dispute-note">Developer reviewing</span> : <span className="paid-note">Paid off-platform</span>}</td></tr>)}</tbody></table></div></article>
        </section>
      ) : null}
      </div>

      {leadProject ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLeadProject(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="lead-title">
            <div className="modal-head"><div><span className="partner-kicker">New buyer</span><h2 id="lead-title">Submit a lead</h2><p>We’ll preserve this timestamp as your ownership record.</p></div><button aria-label="Close lead form" onClick={() => setLeadProject(null)}>×</button></div>
            <div className="form-grid">
              <label className="field full-field"><span>Project</span><select value={leadProject} onChange={(event) => setLeadProject(event.target.value)}>{projects.filter((project) => project.status === "Active").map((project) => <option key={project.name}>{project.name}</option>)}</select>{formErrors.project ? <small>{formErrors.project}</small> : null}</label>
              <label className="field full-field"><span>Buyer name</span><input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} placeholder="e.g. Aditi Sharma" autoFocus />{formErrors.name ? <small>{formErrors.name}</small> : null}</label>
              <label className="field"><span>Mobile number</span><div className="phone-field"><b>+91</b><input inputMode="numeric" maxLength={10} value={buyerMobile} onChange={(event) => setBuyerMobile(event.target.value.replace(/\D/g, ""))} placeholder="10-digit number" /></div>{formErrors.mobile ? <small>{formErrors.mobile}</small> : null}</label>
              <label className="field"><span>Buyer budget</span><div className="phone-field"><b>₹</b><input inputMode="numeric" value={buyerBudget} onChange={(event) => setBuyerBudget(event.target.value.replace(/\D/g, ""))} placeholder="e.g. 12000000" /></div>{formErrors.budget ? <small>{formErrors.budget}</small> : null}</label>
            </div>
            {duplicateMobile ? <div className="duplicate-warning"><span>!</span><div><strong>Possible duplicate found</strong><p>This mobile number already exists for The Grove, submitted on 25 Jul 2026. You can still submit; the developer will review ownership.</p></div></div> : null}
            <div className="modal-actions"><button className="secondary" onClick={() => setLeadProject(null)}>Cancel</button><button className="primary" onClick={submitLead}>{duplicateMobile ? "Submit and flag for review" : "Submit lead"}</button></div>
          </section>
        </div>
      ) : null}

      {queryTarget ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQueryTarget(null); }}>
          <section className="modal query-modal" role="dialog" aria-modal="true" aria-labelledby="query-title">
            <div className="modal-head"><div><span className="partner-kicker">Commission query</span><h2 id="query-title">Tell us what doesn’t look right</h2><p>For {queryTarget}. The developer finance team will review your note.</p></div><button aria-label="Close query form" onClick={() => setQueryTarget(null)}>×</button></div>
            <label className="field full-field"><span>Query note</span><textarea value={queryNote} onChange={(event) => setQueryNote(event.target.value)} placeholder="Explain the expected amount or any sale-value mismatch…" rows={5} />{queryError ? <small>{queryError}</small> : null}</label>
            <div className="modal-actions"><button className="secondary" onClick={() => setQueryTarget(null)}>Cancel</button><button className="primary" onClick={submitQuery}>Raise query</button></div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function CompareProjects({ shortlist, remove, submit, goBrowse }: { shortlist: string[]; remove: (name: string) => void; submit: (name: string) => void; goBrowse: () => void }) {
  const selected = projects.filter((project) => shortlist.includes(project.name));
  if (!selected.length) return <div className="empty-state compare-empty"><span>＋</span><h2>Your comparison is empty</h2><p>Add up to three projects from Browse to compare them side by side.</p><button className="primary" onClick={goBrowse}>Browse projects</button></div>;
  const rows: { label: string; render: (project: typeof projects[number]) => React.ReactNode }[] = [
    { label: "Locality", render: (project) => project.locality },
    { label: "Developer", render: (project) => project.developer },
    { label: "Configuration", render: (project) => project.config },
    { label: "Price range", render: (project) => project.price },
    { label: "Possession", render: (project) => project.possession },
    { label: "Inventory", render: (project) => `${project.unitsLeft} / ${project.unitsTotal} left` },
    { label: "CP commission", render: (project) => <strong className="comparison-commission">{project.commission}</strong> },
    { label: "Status", render: (project) => <Status>{project.status}</Status> },
    { label: "RERA number", render: (project) => <code>{project.rera}</code> },
  ];
  return (
    <section className="partner-section">
      <div className="section-title-row"><div><span className="partner-kicker">Shortlist</span><h2>Compare projects</h2><p>Compare up to three opportunities on the details that matter.</p></div><button className="secondary" onClick={goBrowse}>＋ Add project</button></div>
      <div className="compare-shell">
        <div className="compare-grid" style={{ gridTemplateColumns: `150px repeat(${selected.length}, minmax(190px, 1fr))` }}>
          <div className="compare-label top-label">Project</div>
          {selected.map((project) => <div className={`compare-project-head ${project.tone}`} key={project.name}><button aria-label={`Remove ${project.name}`} onClick={() => remove(project.name)}>×</button><span>{project.locality}</span><strong>{project.name}</strong><small>{project.config}</small></div>)}
          {rows.flatMap((row) => [<div className="compare-label" key={`${row.label}-label`}>{row.label}</div>, ...selected.map((project) => <div className="compare-value" key={`${row.label}-${project.name}`}>{row.render(project)}</div>)])}
          <div className="compare-label action-label">Next step</div>
          {selected.map((project) => <div className="compare-value compare-action" key={`action-${project.name}`}><button className="primary full" disabled={project.status === "Sold Out"} onClick={() => submit(project.name)}>{project.status === "Sold Out" ? "Sold out" : "Submit lead →"}</button></div>)}
        </div>
      </div>
      <p className="integrity-note"><span>i</span>Your comparison stays available while you move around the partner workspace.</p>
    </section>
  );
}
