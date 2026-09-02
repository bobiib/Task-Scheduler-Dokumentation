const tasks = [
  {
    id: 1,
    title: "Sprint-Planning abschliessen",
    label: "Development",
    labelClass: "dev",
    due: "Heute · 14:00",
    dueHot: true,
    repeat: "Wöchentlich",
    reminder: "1 Std. vorher",
    user: "Liam",
    initials: "LB",
    date: "2026-08-26",
    time: "14:00",
    description: "Sprint-Planung finalisieren und offene Punkte für das Team festhalten.",
    recurring: true,
    completed: false
  },
  {
    id: 2,
    title: "Projektstatusbericht Sprint 1",
    label: "Schule",
    labelClass: "school",
    due: "14. Okt. · 17:00",
    repeat: "",
    reminder: "3 Tage vorher",
    user: "Liam + Team",
    initials: "LB",
    date: "2026-10-14",
    time: "17:00",
    description: "Statusbericht für Sprint 1 fertigstellen und auf Teams ablegen.",
    recurring: false,
    completed: false
  },
  {
    id: 3,
    title: "Server-Backup prüfen",
    label: "IT",
    labelClass: "it",
    due: "Heute · 18:30",
    dueHot: true,
    repeat: "Täglich",
    reminder: "30 Min. vorher",
    user: "Dmytro",
    initials: "DY",
    date: "2026-08-26",
    time: "18:30",
    description: "Automatisches Backup prüfen und Fehlermeldungen dokumentieren.",
    recurring: true,
    completed: false
  },
  {
    id: 4,
    title: "Mockups finalisieren",
    label: "Design",
    labelClass: "design",
    due: "02. Sept. · 12:00",
    repeat: "",
    reminder: "1 Tag vorher",
    user: "Liam",
    initials: "LB",
    date: "2026-09-02",
    time: "12:00",
    description: "Pflichtenheft-Mockups fertigstellen und für die Abgabe vorbereiten.",
    recurring: false,
    completed: false
  },
  {
    id: 5,
    title: "Team-Meeting vorbereiten",
    label: "Organisation",
    labelClass: "org",
    due: "Donnerstag · 09:00",
    repeat: "Wöchentlich",
    reminder: "1 Std. vorher",
    user: "Boris",
    initials: "BO",
    date: "2026-08-27",
    time: "09:00",
    description: "Agenda aktualisieren und offene Fragen für das Team sammeln.",
    recurring: true,
    completed: false
  },
  {
    id: 6,
    title: "Zwischenpräsentation planen",
    label: "Schule",
    labelClass: "school",
    due: "24. Nov. · 16:00",
    repeat: "",
    reminder: "7 Tage vorher",
    user: "Projektteam",
    initials: "PT",
    date: "2026-11-24",
    time: "16:00",
    description: "Zwischenpräsentation als Video planen, Rollen und Inhalte verteilen.",
    recurring: false,
    completed: false
  }
];

const viewRoot = document.getElementById("viewRoot");
const overlayRoot = document.getElementById("overlayRoot");
const nav = document.getElementById("mainNav");
let currentView = "dashboard";
let activeFilters = { user: "Alle", label: "Alle", status: "Offen" };

let labels = [
  { id: 1, name: "Development", cls: "dev" },
  { id: 2, name: "Schule", cls: "school" },
  { id: 3, name: "IT", cls: "it" },
  { id: 4, name: "Design", cls: "design" },
  { id: 5, name: "Organisation", cls: "org" }
];

let people = [
  { id: 1, initials: "LB", name: "Liam", role: "Backend Developer" },
  { id: 2, initials: "DY", name: "Dmytro", role: "Frontend Developer" },
  { id: 3, initials: "BO", name: "Boris", role: "Developer" },
  { id: 4, initials: "FA", name: "Fabio", role: "Developer" }
];

let teams = [
  { id: 1, initials: "PT", name: "Projektteam", members: ["Liam", "Dmytro", "Boris", "Fabio"] }
];


const stats = [
  {icon:"☷", cls:"primary", label:"Offen", value:"8", foot:"2 neu seit gestern"},
  {icon:"◷", cls:"orange", label:"Heute fällig", value:"3", foot:"Nächster um 14:00"},
  {icon:"□", cls:"primary", label:"Diese Woche", value:"12", foot:"Bis Freitag geplant"},
  {icon:"✓", cls:"green", label:"Erledigt", value:"24", foot:"+18% diese Woche"}
];

function setView(view) {
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  render();
}

nav.addEventListener("click", e => {
  const btn = e.target.closest("[data-view]");
  if (!btn) return;
  setView(btn.dataset.view);
});

function pageHeader(title, subtitle, action = "") {
  return `
    <div class="page-header">
      <div>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      ${action}
    </div>
  `;
}

function toolbar(includeViewToggle = true) {
  return `
    <div class="toolbar">
      <div class="search-box"><span>⌕</span><input id="taskSearch" placeholder="Tasks durchsuchen ..." /></div>
      <button class="filter-button" onclick="openFilter()">Alle User <span>⌄</span></button>
      <button class="filter-button" onclick="openFilter()">Zeitraum <span>⌄</span></button>
      <button class="filter-button" onclick="openFilter()">Labels <span>⌄</span></button>
      <div class="toolbar-spacer"></div>
      ${includeViewToggle ? `
      <div class="view-toggle">
        <button class="${currentView === "dashboard" ? "active" : ""}" onclick="setView('dashboard')" title="Kachelansicht">▦</button>
        <button class="${currentView === "timeline" ? "active" : ""}" onclick="setView('timeline')" title="Timeline">≡</button>
      </div>` : ""}
    </div>
  `;
}

function taskCard(t) {
  return `
    <article class="task-card" onclick="openTaskDetail(${t.id})">
      <div class="task-card-top">
        <span class="label ${t.labelClass}">${t.label}</span>
        <button class="check ${t.completed ? "checked" : ""}" onclick="event.stopPropagation(); toggleTask(${t.id})" title="Als abgeschlossen markieren"></button>
      </div>
      <div class="task-title">${t.title}</div>
      <div class="task-meta">
        <div class="meta-line"><span>□</span><span class="${t.dueHot ? "due-hot" : ""}">${t.due}</span></div>
        <div class="meta-line">
          ${t.repeat ? `<span class="meta-pill">↻ ${t.repeat}</span>` : ""}
          ${t.reminder ? `<span class="meta-pill">♢ ${t.reminder}</span>` : ""}
        </div>
      </div>
      <div class="task-footer">
        <div class="assignee"><span class="avatar small">${t.initials}</span><span>${t.user}</span></div>
        <button class="more-button" onclick="event.stopPropagation(); openTaskDetail(${t.id})">•••</button>
      </div>
    </article>
  `;
}

function dashboard() {
  const visible = tasks.filter(t => !t.completed);
  return `
    ${pageHeader("Meine Tasks", "Plane, priorisiere und erledige deine Aufgaben an einem Ort.",
      `<button class="primary-button" onclick="openTaskForm()">＋ Neuer Task</button>`)}
    <div class="stats-grid">
      ${stats.map(s => `
        <div class="stat-card">
          <div class="stat-icon ${s.cls}">${s.icon}</div>
          <div><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-foot">${s.foot}</div></div>
        </div>`).join("")}
    </div>
    ${toolbar(true)}
    <div class="section-head"><h2>Aktuelle Tasks</h2><span class="count-chip">${visible.length} offen</span></div>
    <div class="task-grid" id="taskGrid">${visible.map(taskCard).join("")}</div>
  `;
}

const timelineEvents = [
  { day: 1, top: 9.09*2 + 1, height: 9.09*1.2, title:"Mockups finalisieren", meta:"10:00 · Liam", cls:"red" },
  { day: 2, top: 9.09*4 + 1, height: 9.09*1.25, title:"Sprint-Planning", meta:"12:00 · Liam", cls:"" },
  { day: 3, top: 9.09*1 + 1, height: 9.09*1.1, title:"Team-Meeting", meta:"09:00 · Boris", cls:"orange" },
  { day: 3, top: 9.09*6 + 1, height: 9.09*1.15, title:"Server-Backup prüfen", meta:"14:00 · Dmytro", cls:"blue" },
  { day: 4, top: 9.09*3 + 1, height: 9.09*1.1, title:"Projekt Review", meta:"11:00 · Projektteam", cls:"green" },
  { day: 5, top: 9.09*5 + 1, height: 9.09*1.15, title:"Sprint-Abschluss", meta:"13:00 · Team", cls:"" }
];

function timeline() {
  const days = [
    ["Mo","24. Aug."], ["Di","25. Aug."], ["Mi","26. Aug."], ["Do","27. Aug."], ["Fr","28. Aug."]
  ];
  return `
    ${pageHeader("Timeline", "Behalte alle Tasks auf einer Zeitachse im Blick.",
      `<button class="primary-button" onclick="openTaskForm()">＋ Neuer Task</button>`)}
    ${toolbar(true)}
    <div class="timeline-toolbar">
      <div class="timeline-toolbar-left">
        <button class="secondary-button">‹</button>
        <button class="secondary-button">Heute</button>
        <button class="secondary-button">›</button>
        <strong style="font-size:14px; margin-left:6px;">24.–28. August 2026</strong>
      </div>
      <div class="timeline-toolbar-right">
        <div class="segmented"><button class="active">Woche</button><button>Monat</button></div>
      </div>
    </div>
    <div class="timeline-card">
      <div class="timeline-head">
        <div></div>
        ${days.map((d,i) => `<div class="${i===2 ? "today" : ""}"><strong>${d[0]}</strong><span>${d[1]}</span></div>`).join("")}
      </div>
      <div class="timeline-body">
        <div class="time-axis">
          ${Array.from({length:11}, (_,i)=>`<div class="time-label">${String(i+8).padStart(2,"0")}:00</div>`).join("")}
        </div>
        <div class="timeline-grid">
          ${Array.from({length:5}, (_,i)=>`
            <div class="day-col">
              <div class="hour-lines"></div>
              ${timelineEvents.filter(e => e.day === i+1).map(e => `
                <div class="timeline-event ${e.cls}" style="top:${e.top}%; height:${e.height}%;">
                  <h4>${e.title}</h4><p>${e.meta}</p>
                </div>`).join("")}
            </div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function allTasks() {
  const openCount = tasks.filter(t => !t.completed).length;
  return `
    ${pageHeader("Alle Tasks", "Alle einmaligen und wiederkehrenden Tasks zentral verwalten.",
      `<button class="primary-button" onclick="openTaskForm()">＋ Neuer Task</button>`)}

    <div class="alltasks-summary">
      <div class="summary-left">
        <span class="summary-badge"><strong>${tasks.length}</strong> Tasks gesamt</span>
        <span class="summary-badge open"><strong>${openCount}</strong> offen</span>
        <span class="summary-badge recurring"><strong>${tasks.filter(t => t.recurring).length}</strong> wiederkehrend</span>
      </div>
      <div class="summary-right">Letzte Aktualisierung: heute</div>
    </div>

    ${toolbar(false)}

    <div class="task-table-card">
      <div class="task-table-head">
        <div>Task</div>
        <div>Termin</div>
        <div>Wiederholung</div>
        <div>Zugewiesen</div>
        <div>Status</div>
        <div></div>
      </div>

      <div class="task-table-body">
        ${tasks.map(t => `
          <div class="task-table-row" onclick="openTaskDetail(${t.id})">
            <div class="task-cell-main">
              <div class="task-row-title">${t.title}</div>
              <div class="task-row-sub">
                <span class="label ${t.labelClass}">${t.label}</span>
                ${t.reminder ? `<span class="row-meta">♢ ${t.reminder}</span>` : ""}
              </div>
            </div>

            <div>
              <div class="date-chip ${t.dueHot ? "urgent" : ""}">
                <span class="date-icon">□</span>
                <span>${t.due}</span>
              </div>
            </div>

            <div>
              ${t.repeat
                ? `<span class="repeat-chip">↻ ${t.repeat}</span>`
                : `<span class="repeat-chip once">Einmalig</span>`}
            </div>

            <div class="table-assignee">
              <span class="avatar small">${t.initials}</span>
              <span>${t.user}</span>
            </div>

            <div>
              <span class="status-badge ${t.completed ? "done" : "open"}">
                <span class="status-dot"></span>
                ${t.completed ? "Erledigt" : "Offen"}
              </span>
            </div>

            <div class="table-actions">
              <button class="row-action-button" onclick="event.stopPropagation(); openTaskDetail(${t.id})" title="Details">•••</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function labelsView() {
  return `
    ${pageHeader("Labels", "Erstelle, verwalte und lösche Labels für deine Tasks.",
      `<button class="primary-button" onclick="openLabelForm()">＋ Neues Label</button>`)}
    <div class="management-grid">
      ${labels.map(l => `
        <div class="management-card">
          <div>
            <span class="label ${l.cls}">${l.name}</span>
            <div class="management-title">${l.name}</div>
            <div class="management-sub">${tasks.filter(t => t.label === l.name).length} Tasks</div>
          </div>
          <button class="danger-icon-button" onclick="deleteLabel(${l.id})" title="Label löschen">×</button>
        </div>`).join("")}
    </div>
  `;
}

function teamView() {
  return `
    ${pageHeader("Team", "Verwalte Personen und Teams für die Task-Zuweisung.",
      `<div style="display:flex;gap:8px;">
        <button class="secondary-button" onclick="openTeamForm()">＋ Neues Team</button>
        <button class="primary-button" onclick="openPersonForm()">＋ Neue Person</button>
      </div>`)}

    <div class="section-head"><h2>Personen</h2><span class="count-chip">${people.length} Personen</span></div>
    <div class="management-grid" style="margin-bottom:28px;">
      ${people.map(p => `
        <div class="management-card">
          <div class="management-person">
            <span class="avatar">${p.initials}</span>
            <div>
              <div class="management-title">${p.name}</div>
              <div class="management-sub">${p.role}</div>
            </div>
          </div>
          <button class="danger-icon-button" onclick="deletePerson(${p.id})" title="Person löschen">×</button>
        </div>`).join("")}
    </div>

    <div class="section-head"><h2>Teams</h2><span class="count-chip">${teams.length} Team</span></div>
    <div class="management-grid">
      ${teams.map(t => `
        <div class="management-card">
          <div class="management-person">
            <span class="avatar">${t.initials}</span>
            <div>
              <div class="management-title">${t.name}</div>
              <div class="management-sub">${t.members.join(", ")}</div>
            </div>
          </div>
          <button class="danger-icon-button" onclick="deleteTeam(${t.id})" title="Team löschen">×</button>
        </div>`).join("")}
    </div>
  `;
}

function render() {
  if (currentView === "dashboard") viewRoot.innerHTML = dashboard();
  else if (currentView === "timeline") viewRoot.innerHTML = timeline();
  else if (currentView === "tasks") viewRoot.innerHTML = allTasks();
  else if (currentView === "labels") viewRoot.innerHTML = labelsView();
  else viewRoot.innerHTML = teamView();

  const search = document.getElementById("taskSearch");
  if (search) {
    search.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll(".task-card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }
}

function openTaskForm(taskId = null) {
  const task = tasks.find(t => t.id === taskId);
  const edit = !!task;
  overlayRoot.innerHTML = `
    <div class="overlay" onclick="if(event.target===this) closeOverlay()">
      <div class="modal large">
        <div class="modal-header">
          <div><h2>${edit ? "Task bearbeiten" : "Neuer Task"}</h2><p>Termin, Wiederholung, Labels, User und Reminder definieren.</p></div>
          <button class="close-button" onclick="closeOverlay()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-field full"><label>Titel</label><input class="input" id="fTitle" value="${task?.title || ""}" placeholder="z. B. Projektstatusbericht Sprint 1"></div>
            <div class="form-field full"><label>Beschreibung</label><textarea class="textarea" id="fDesc">${task?.description || ""}</textarea></div>
            <div class="form-field"><label>Termin</label><input class="input" type="date" id="fDate" value="${task?.date || "2026-09-02"}"></div>
            <div class="form-field"><label>Uhrzeit</label><input class="input" type="time" id="fTime" value="${task?.time || "12:00"}"></div>
            <div class="form-field full">
              <label>Terminierungsart</label>
              <div class="radio-group">
                <label class="radio-row"><input type="radio" name="scheduleType" checked> Bestimmtes Datum, z. B. 6. Dezember</label>
                <label class="radio-row"><input type="radio" name="scheduleType"> Bestimmte Woche, z. B. 1. Woche im August</label>
                <label class="radio-row"><input type="radio" name="scheduleType"> Wochentag im Monat, z. B. 3. Donnerstag</label>
              </div>
            </div>
            <div class="form-field"><label>Wiederholung</label><select class="select" id="fRepeat"><option>Keine</option><option>Täglich</option><option>Wöchentlich</option><option>Monatlich</option></select></div>
            <div class="form-field"><label>Label</label><select class="select" id="fLabel"><option>Schule</option><option>Development</option><option>IT</option><option>Design</option><option>Organisation</option></select></div>
            <div class="form-field"><label>Zugewiesen an</label><select class="select" id="fUser"><option>Liam</option><option>Dmytro</option><option>Benjamin</option><option>Projektteam</option></select></div>
            <div class="form-field"><label>Reminder</label><select class="select" id="fReminder"><option>30 Min. vorher</option><option>1 Std. vorher</option><option>1 Tag vorher</option><option>3 Tage vorher</option><option>7 Tage vorher</option></select></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" onclick="closeOverlay()">Abbrechen</button>
          <button class="primary-button" onclick="saveTask(${taskId || "null"})">${edit ? "Änderungen speichern" : "Task erstellen"}</button>
        </div>
      </div>
    </div>`;
}

function saveTask(taskId) {
  const title = document.getElementById("fTitle").value.trim();
  if (!title) return toast("Bitte einen Titel eingeben.");
  if (taskId) {
    const t = tasks.find(x => x.id === taskId);
    t.title = title;
    t.description = document.getElementById("fDesc").value;
  } else {
    tasks.push({
      id: Math.max(...tasks.map(t=>t.id))+1,
      title,
      description: document.getElementById("fDesc").value,
      label: document.getElementById("fLabel").value,
      labelClass: "school",
      due: "Neu geplant",
      repeat: document.getElementById("fRepeat").value === "Keine" ? "" : document.getElementById("fRepeat").value,
      reminder: document.getElementById("fReminder").value,
      user: document.getElementById("fUser").value,
      initials: "LB",
      date: document.getElementById("fDate").value,
      time: document.getElementById("fTime").value,
      recurring: document.getElementById("fRepeat").value !== "Keine",
      completed:false
    });
  }
  closeOverlay(); render(); toast(taskId ? "Task aktualisiert." : "Task erstellt.");
}

function openTaskDetail(id) {
  const t = tasks.find(x => x.id === id);
  overlayRoot.innerHTML = `
    <div class="overlay" onclick="if(event.target===this) closeOverlay()"></div>
    <aside class="drawer">
      <div class="drawer-header">
        <div><span class="label ${t.labelClass}">${t.label}</span><h2 style="margin:10px 0 0;font-size:21px;">${t.title}</h2></div>
        <button class="close-button" onclick="closeOverlay()">×</button>
      </div>
      <div class="drawer-body">
        <p style="color:var(--text-secondary);font-size:13px;line-height:1.55;">${t.description}</p>
        <div class="detail-grid" style="margin-top:18px;">
          <div class="detail-item"><span>Fällig</span><strong>${t.due}</strong></div>
          <div class="detail-item"><span>Zugewiesen</span><strong>${t.user}</strong></div>
          <div class="detail-item"><span>Wiederholung</span><strong>${t.repeat || "Keine"}</strong></div>
          <div class="detail-item"><span>Reminder</span><strong>${t.reminder}</strong></div>
          <div class="detail-item"><span>Status</span><strong>${t.completed ? "Erledigt" : "Offen"}</strong></div>
          <div class="detail-item"><span>Typ</span><strong>${t.recurring ? "Wiederkehrender Task" : "Einmaliger Task"}</strong></div>
        </div>
        ${t.recurring ? `<div style="margin-top:18px;padding:12px;border-radius:11px;background:#fff7e6;color:#925c00;font-size:11px;">
          Beim Abschliessen wird nur diese einzelne Instanz als erledigt markiert. Zukünftige Instanzen bleiben offen.
        </div>` : ""}
      </div>
      <div class="drawer-footer">
        <button class="secondary-button" onclick="openTaskForm(${t.id})">Bearbeiten</button>
        <button class="primary-button" onclick="toggleTask(${t.id}); closeOverlay();">${t.completed ? "Wieder öffnen" : "Als erledigt markieren"}</button>
      </div>
    </aside>`;
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  t.completed = !t.completed;
  render();
  toast(t.recurring && t.completed ? "Nur diese Instanz wurde abgeschlossen." : (t.completed ? "Task abgeschlossen." : "Task wieder geöffnet."));
}

function openFilter() {
  overlayRoot.innerHTML = `
    <div class="overlay" onclick="if(event.target===this) closeOverlay()">
      <div class="filter-panel">
        <div class="modal-header"><div><h2>Filter</h2><p>Taskansicht nach Zeitraum, Usern, Labels und Status einschränken.</p></div><button class="close-button" onclick="closeOverlay()">×</button></div>
        <div class="modal-body">
          <div class="filter-section">
            <h4>Zeitraum</h4>
            <div class="form-grid"><input class="input" type="date" value="2026-08-26"><input class="input" type="date" value="2026-09-30"></div>
          </div>
          <div class="filter-section">
            <h4>Zugewiesen an</h4>
            <label class="check-row"><input type="checkbox" checked> Liam</label>
            <label class="check-row"><input type="checkbox"> Dmytro</label>
            <label class="check-row"><input type="checkbox"> Benjamin</label>
            <label class="check-row"><input type="checkbox"> Projektteam</label>
          </div>
          <div class="filter-section">
            <h4>Labels</h4>
            <label class="check-row"><input type="checkbox" checked> Schule</label>
            <label class="check-row"><input type="checkbox" checked> Development</label>
            <label class="check-row"><input type="checkbox"> IT</label>
            <label class="check-row"><input type="checkbox"> Design</label>
          </div>
          <div class="filter-section">
            <h4>Status</h4>
            <label class="check-row"><input type="checkbox" checked> Offen</label>
            <label class="check-row"><input type="checkbox"> Erledigt</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" onclick="resetFilters()">Zurücksetzen</button>
          <button class="primary-button" onclick="applyFilters()">Anwenden</button>
        </div>
      </div>
    </div>`;
}

function applyFilters() { closeOverlay(); toast("Filter angewendet."); }
function resetFilters() { toast("Filter zurückgesetzt."); }

function openLabelForm() {
  overlayRoot.innerHTML = `
    <div class="overlay" onclick="if(event.target===this) closeOverlay()">
      <div class="modal" style="max-width:480px;">
        <div class="modal-header">
          <div><h2>Neues Label</h2><p>Erstelle eine neue Kategorie für Tasks.</p></div>
          <button class="close-button" onclick="closeOverlay()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-field"><label>Name</label><input class="input" id="newLabelName" placeholder="z. B. Finanzen"></div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" onclick="closeOverlay()">Abbrechen</button>
          <button class="primary-button" onclick="createLabel()">Label erstellen</button>
        </div>
      </div>
    </div>`;
}

function createLabel() {
  const name = document.getElementById("newLabelName").value.trim();
  if (!name) return toast("Bitte einen Namen eingeben.");
  if (labels.some(l => l.name.toLowerCase() === name.toLowerCase())) return toast("Dieses Label existiert bereits.");
  const classes = ["dev","school","it","design","org"];
  labels.push({ id: Date.now(), name, cls: classes[labels.length % classes.length] });
  closeOverlay();
  render();
  toast("Label erstellt.");
}

function deleteLabel(id) {
  const label = labels.find(l => l.id === id);
  if (!label) return;
  if (!confirm(`Label "${label.name}" wirklich löschen?`)) return;
  labels = labels.filter(l => l.id !== id);
  render();
  toast("Label gelöscht.");
}

function openPersonForm() {
  overlayRoot.innerHTML = `
    <div class="overlay" onclick="if(event.target===this) closeOverlay()">
      <div class="modal" style="max-width:520px;">
        <div class="modal-header">
          <div><h2>Neue Person</h2><p>Füge eine Person für die Task-Zuweisung hinzu.</p></div>
          <button class="close-button" onclick="closeOverlay()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-field"><label>Name</label><input class="input" id="newPersonName" placeholder="Name"></div>
            <div class="form-field"><label>Rolle</label><input class="input" id="newPersonRole" placeholder="z. B. Developer"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" onclick="closeOverlay()">Abbrechen</button>
          <button class="primary-button" onclick="createPerson()">Person erstellen</button>
        </div>
      </div>
    </div>`;
}

function createPerson() {
  const name = document.getElementById("newPersonName").value.trim();
  const role = document.getElementById("newPersonRole").value.trim() || "Benutzer";
  if (!name) return toast("Bitte einen Namen eingeben.");
  if (people.some(p => p.name.toLowerCase() === name.toLowerCase())) return toast("Diese Person existiert bereits.");
  const initials = name.split(/\s+/).map(x => x[0]).join("").slice(0,2).toUpperCase();
  people.push({ id: Date.now(), initials, name, role });
  closeOverlay();
  render();
  toast("Person erstellt.");
}

function deletePerson(id) {
  const person = people.find(p => p.id === id);
  if (!person) return;
  if (!confirm(`${person.name} wirklich löschen?`)) return;
  people = people.filter(p => p.id !== id);
  teams = teams.map(t => ({ ...t, members: t.members.filter(m => m !== person.name) }));
  render();
  toast("Person gelöscht.");
}

function openTeamForm() {
  overlayRoot.innerHTML = `
    <div class="overlay" onclick="if(event.target===this) closeOverlay()">
      <div class="modal" style="max-width:560px;">
        <div class="modal-header">
          <div><h2>Neues Team</h2><p>Erstelle ein Team aus bestehenden Personen.</p></div>
          <button class="close-button" onclick="closeOverlay()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-field"><label>Teamname</label><input class="input" id="newTeamName" placeholder="z. B. Entwicklung"></div>
          <div class="filter-section" style="margin-top:18px;">
            <h4>Mitglieder</h4>
            ${people.map(p => `<label class="check-row"><input type="checkbox" class="team-member-check" value="${p.name}"> ${p.name}</label>`).join("")}
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" onclick="closeOverlay()">Abbrechen</button>
          <button class="primary-button" onclick="createTeam()">Team erstellen</button>
        </div>
      </div>
    </div>`;
}

function createTeam() {
  const name = document.getElementById("newTeamName").value.trim();
  const members = [...document.querySelectorAll(".team-member-check:checked")].map(x => x.value);
  if (!name) return toast("Bitte einen Teamnamen eingeben.");
  if (!members.length) return toast("Bitte mindestens eine Person auswählen.");
  if (teams.some(t => t.name.toLowerCase() === name.toLowerCase())) return toast("Dieses Team existiert bereits.");
  const initials = name.split(/\s+/).map(x => x[0]).join("").slice(0,2).toUpperCase();
  teams.push({ id: Date.now(), initials, name, members });
  closeOverlay();
  render();
  toast("Team erstellt.");
}

function deleteTeam(id) {
  const team = teams.find(t => t.id === id);
  if (!team) return;
  if (!confirm(`Team "${team.name}" wirklich löschen?`)) return;
  teams = teams.filter(t => t.id !== id);
  render();
  toast("Team gelöscht.");
}

function closeOverlay() { overlayRoot.innerHTML = ""; }
function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2200);
}

window.setView = setView;
window.openTaskForm = openTaskForm;
window.openTaskDetail = openTaskDetail;
window.openFilter = openFilter;
window.closeOverlay = closeOverlay;
window.toggleTask = toggleTask;
window.saveTask = saveTask;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;

window.openLabelForm = openLabelForm;
window.createLabel = createLabel;
window.deleteLabel = deleteLabel;
window.openPersonForm = openPersonForm;
window.createPerson = createPerson;
window.deletePerson = deletePerson;
window.openTeamForm = openTeamForm;
window.createTeam = createTeam;
window.deleteTeam = deleteTeam;


render();
