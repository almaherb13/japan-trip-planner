import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "japan_trip_v1";

const CATEGORIES = [
  { id: "temple", label: "Templo / Santuario", icon: "⛩️", color: "#8B5CF6" },
  { id: "food", label: "Gastronomía", icon: "🍣", color: "#EF4444" },
  { id: "nature", label: "Naturaleza", icon: "🌸", color: "#10B981" },
  { id: "culture", label: "Cultura / Arte", icon: "🎭", color: "#F59E0B" },
  { id: "shopping", label: "Compras", icon: "🛍️", color: "#EC4899" },
  { id: "transport", label: "Transporte", icon: "🚄", color: "#3B82F6" },
  { id: "hotel", label: "Alojamiento", icon: "🏨", color: "#6366F1" },
  { id: "experience", label: "Experiencia", icon: "✨", color: "#14B8A6" },
  { id: "nightlife", label: "Ocio / Noche", icon: "🏮", color: "#F97316" },
  { id: "other", label: "Otro", icon: "📍", color: "#64748B" },
];

const CITIES = [
  { id: "tokyo", name: "Tokio", emoji: "🗼", color: "#3B82F6" },
  { id: "kyoto", name: "Kioto", emoji: "⛩️", color: "#8B5CF6" },
  { id: "osaka", name: "Osaka", emoji: "🏯", color: "#EF4444" },
  { id: "nara", name: "Nara", emoji: "🦌", color: "#10B981" },
  { id: "hiroshima", name: "Hiroshima", emoji: "☮️", color: "#F59E0B" },
  { id: "hakone", name: "Hakone", emoji: "🗻", color: "#6366F1" },
  { id: "nikko", name: "Nikko", emoji: "🌿", color: "#14B8A6" },
  { id: "other", name: "Otro", emoji: "🗾", color: "#64748B" },
];

const STATUSES = [
  { id: "pending", label: "Pendiente", color: "#94A3B8", bg: "#F1F5F9" },
  { id: "interested", label: "En consideración", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "reserved", label: "Reservado", color: "#3B82F6", bg: "#EFF6FF" },
  { id: "done", label: "Realizado", color: "#10B981", bg: "#ECFDF5" },
  { id: "discarded", label: "Descartado", color: "#EF4444", bg: "#FEF2F2" },
];

const PRIORITIES = [
  { id: "must", label: "Imprescindible", icon: "🔥", color: "#EF4444" },
  { id: "high", label: "Alta", icon: "⭐", color: "#F59E0B" },
  { id: "medium", label: "Media", icon: "💙", color: "#3B82F6" },
  { id: "low", label: "Baja", icon: "🌱", color: "#10B981" },
];

const AVATAR_COLORS = [
  "#EF4444","#F97316","#EAB308","#22C55E","#14B8A6","#3B82F6","#8B5CF6","#EC4899","#06B6D4","#84CC16"
];

const VIEWS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "kanban", label: "Kanban", icon: "📋" },
  { id: "timeline", label: "Timeline", icon: "📅" },
  { id: "cities", label: "Ciudades", icon: "🗾" },
  { id: "participants", label: "Viajeros", icon: "👥" },
  { id: "docs", label: "Documentos", icon: "📁" },
  { id: "reservations", label: "Reservas", icon: "🎫" },
  { id: "votes", label: "Votaciones", icon: "🗳️" },
];

const uid = () => Math.random().toString(36).slice(2, 10);
const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const getCity = (id) => CITIES.find(c => c.id === id) || CITIES[CITIES.length - 1];
const getStatus = (id) => STATUSES.find(s => s.id === id) || STATUSES[0];
const getPriority = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[2];

const defaultData = () => ({
  tripName: "🇯🇵 Japón 2025",
  tripDates: { start: "", end: "" },
  participants: [
    { id: uid(), name: "Tú", color: "#3B82F6", avatar: "👤", interests: ["Templos", "Gastronomía", "Fotografía"] },
  ],
  activities: [
    {
      id: uid(), title: "Fushimi Inari Taisha", description: "Miles de torii naranjas en la montaña. Subir al amanecer para evitar multitudes.", city: "kyoto", category: "temple",
      priority: "must", status: "interested", participants: [], cost: 0, duration: 180, links: ["https://inari.jp"], votes: {}, day: "", time: "",
    },
    {
      id: uid(), title: "Mercado de Nishiki", description: "El 'cocina de Kioto'. Probad el dango, el tofu y los encurtidos.", city: "kyoto", category: "food",
      priority: "high", status: "interested", participants: [], cost: 20, duration: 90, links: [], votes: {}, day: "", time: "",
    },
    {
      id: uid(), title: "Shibuya Crossing", description: "El cruce peatonal más famoso del mundo. Mejor de noche con las luces.", city: "tokyo", category: "experience",
      priority: "must", status: "interested", participants: [], cost: 0, duration: 30, links: [], votes: {}, day: "", time: "",
    },
    {
      id: uid(), title: "Shinkansen Tokio → Kioto", description: "Reservar con JR Pass. El Nozomi tarda 2h15min.", city: "tokyo", category: "transport",
      priority: "must", status: "pending", participants: [], cost: 80, duration: 135, links: ["https://www.jrpass.com"], votes: {}, day: "", time: "08:00",
    },
 ],
  documents: [],
  reservations: [],
  notes: [],
});

function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(13,27,42,0.75)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#1A2744",border:"1px solid rgba(212,168,83,0.3)",borderRadius:"1rem",padding:"1.5rem",width:"100%",maxWidth:wide?"780px":"520px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 25px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem" }}>
          <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1.1rem",fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:"1.3rem",lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width:"100%",padding:"0.5rem 0.75rem",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(248,245,240,0.15)",borderRadius:"0.5rem",color:"#F8F5F0",fontSize:"0.875rem",outline:"none",boxSizing:"border-box" };
const labelStyle = { display:"block",color:"#94A3B8",fontSize:"0.75rem",fontWeight:600,marginBottom:"0.3rem",textTransform:"uppercase",letterSpacing:"0.05em" };
const btnPrimary = { padding:"0.5rem 1.25rem",background:"linear-gradient(135deg,#C0392B,#E74C3C)",border:"none",borderRadius:"0.5rem",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:"0.875rem" };
const btnSecondary = { padding:"0.5rem 1.25rem",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"0.5rem",color:"#F8F5F0",fontWeight:600,cursor:"pointer",fontSize:"0.875rem" };

function Field({ label, children }) {
  return <div style={{ marginBottom:"0.85rem" }}><label style={labelStyle}>{label}</label>{children}</div>;
}

function ActivityForm({ initial, participants, onSave, onClose }) {
  const blank = { title:"",description:"",city:"tokyo",category:"experience",priority:"medium",status:"interested",participants:[],cost:"",duration:"",links:"",votes:{},day:"",time:"" };
  const [form, setForm] = useState(initial || blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleParticipant = (pid) => {
    set("participants", form.participants.includes(pid) ? form.participants.filter(p => p !== pid) : [...form.participants, pid]);
  };

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Título *">
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="ej. Templo Senso-ji al amanecer" />
          </Field>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Descripción">
            <textarea style={{ ...inputStyle,height:"70px",resize:"vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Notas, recomendaciones, horarios..." />
          </Field>
        </div>
        <Field label="Ciudad">
          <select style={inputStyle} value={form.city} onChange={e => set("city", e.target.value)}>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </Field>
        <Field label="Categoría">
          <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </Field>
        <Field label="Prioridad">
          <select style={inputStyle} value={form.priority} onChange={e => set("priority", e.target.value)}>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
          </select>
        </Field>
        <Field label="Estado">
          <select style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
            {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Coste estimado (€/pp)">
          <input style={inputStyle} type="number" value={form.cost} onChange={e => set("cost", e.target.value)} placeholder="0" />
        </Field>
        <Field label="Duración (minutos)">
          <input style={inputStyle} type="number" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="ej. 120" />
        </Field>
        <Field label="Día planeado">
          <input style={inputStyle} type="date" value={form.day} onChange={e => set("day", e.target.value)} />
        </Field>
        <Field label="Hora">
          <input style={inputStyle} type="time" value={form.time} onChange={e => set("time", e.target.value)} />
        </Field>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Enlace(s) — separados por coma">
            <input style={inputStyle} value={form.links} onChange={e => set("links", e.target.value)} placeholder="https://..." />
          </Field>
        </div>
        {participants.length > 0 && (
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelStyle}>Interesados</label>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"0.4rem" }}>
              {participants.map(p => (
                <button key={p.id} onClick={() => toggleParticipant(p.id)} style={{ padding:"0.3rem 0.75rem",borderRadius:"999px",border:`2px solid ${p.color}`,background:form.participants.includes(p.id)?p.color:"transparent",color:form.participants.includes(p.id)?"#fff":p.color,cursor:"pointer",fontSize:"0.8rem",fontWeight:600 }}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ display:"flex",gap:"0.5rem",justifyContent:"flex-end",marginTop:"1rem" }}>
        <button style={btnSecondary} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} onClick={() => {
          if (!form.title.trim()) return;
          const links = typeof form.links === "string" ? form.links.split(",").map(l => l.trim()).filter(Boolean) : form.links;
          onSave({ ...form, links, cost: Number(form.cost)||0, duration: Number(form.duration)||0 });
        }}>Guardar actividad</button>
      </div>
    </div>
  );
}

function ActivityCard({ act, participants, onEdit, onDelete, onVote, currentUser, compact }) {
  const cat = getCat(act.category);
  const city = getCity(act.city);
  const status = getStatus(act.status);
  const priority = getPriority(act.priority);
  const votes = act.votes || {};
  const voteCount = Object.values(votes).filter(Boolean).length;
  const userVoted = currentUser && votes[currentUser];

  if (compact) return (
    <div onClick={() => onEdit(act)} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderLeft:`3px solid ${cat.color}`,borderRadius:"0.5rem",padding:"0.6rem 0.75rem",cursor:"pointer" }}>
      <div style={{ display:"flex",alignItems:"center",gap:"0.4rem" }}>
        <span style={{ fontSize:"1rem" }}>{cat.icon}</span>
        <span style={{ color:"#F8F5F0",fontSize:"0.82rem",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{act.title}</span>
        <span style={{ fontSize:"0.7rem",background:status.bg,color:status.color,padding:"0.15rem 0.4rem",borderRadius:"0.25rem",fontWeight:700 }}>{status.label}</span>
      </div>
    </div>
  );

  return (
    <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.08)",borderRadius:"0.75rem",padding:"1rem",position:"relative",borderTop:`3px solid ${cat.color}` }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.5rem",marginBottom:"0.5rem" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",flex:1,minWidth:0 }}>
          <span style={{ fontSize:"1.3rem",flexShrink:0 }}>{cat.icon}</span>
          <div style={{ minWidth:0 }}>
            <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.9rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{act.title}</div>
            <div style={{ display:"flex",gap:"0.3rem",marginTop:"0.25rem",flexWrap:"wrap" }}>
              <span style={{ fontSize:"0.7rem",color:city.color,fontWeight:600 }}>{city.emoji} {city.name}</span>
              <span style={{ fontSize:"0.7rem",color:priority.color,fontWeight:600 }}>{priority.icon}</span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:"0.3rem",flexShrink:0 }}>
          <button onClick={() => onEdit(act)} style={{ background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"0.85rem",padding:"0.2rem" }}>✏️</button>
          <button onClick={() => onDelete(act.id)} style={{ background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"0.85rem",padding:"0.2rem" }}>🗑️</button>
        </div>
      </div>

      {act.description && <p style={{ color:"#94A3B8",fontSize:"0.8rem",margin:"0 0 0.6rem",lineHeight:1.4 }}>{act.description}</p>}

      <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.6rem" }}>
        <span style={{ fontSize:"0.72rem",background:status.bg,color:status.color,padding:"0.2rem 0.5rem",borderRadius:"0.25rem",fontWeight:700 }}>{status.label}</span>
        {act.cost > 0 && <span style={{ fontSize:"0.72rem",background:"rgba(212,168,83,0.15)",color:"#D4A853",padding:"0.2rem 0.5rem",borderRadius:"0.25rem",fontWeight:600 }}>€{act.cost}/pp</span>}
        {act.duration > 0 && <span style={{ fontSize:"0.72rem",background:"rgba(100,116,139,0.2)",color:"#94A3B8",padding:"0.2rem 0.5rem",borderRadius:"0.25rem" }}>⏱ {act.duration < 60 ? `${act.duration}min` : `${Math.floor(act.duration/60)}h${act.duration%60?` ${act.duration%60}m`:""}` }</span>}
        {act.day && <span style={{ fontSize:"0.72rem",background:"rgba(99,102,241,0.15)",color:"#818CF8",padding:"0.2rem 0.5rem",borderRadius:"0.25rem" }}>📅 {act.day}{act.time?` ${act.time}`:""}</span>}
      </div>

      {act.participants && act.participants.length > 0 && (
        <div style={{ display:"flex",gap:"0.25rem",flexWrap:"wrap",marginBottom:"0.6rem" }}>
          {act.participants.map(pid => {
            const p = participants.find(x => x.id === pid);
            return p ? <span key={pid} style={{ fontSize:"0.7rem",background:`${p.color}22`,color:p.color,padding:"0.15rem 0.4rem",borderRadius:"999px",fontWeight:600 }}>{p.name}</span> : null;
          })}
        </div>
      )}

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        {act.links && act.links.length > 0 && (
          <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap" }}>
            {act.links.slice(0,2).map((l,i) => (
              <a key={i} href={l} target="_blank" rel="noreferrer" style={{ fontSize:"0.7rem",color:"#60A5FA",textDecoration:"none" }} onClick={e => e.stopPropagation()}>🔗 Link{act.links.length>1?` ${i+1}`:""}</a>
            ))}
          </div>
        )}
        <button onClick={() => onVote && onVote(act.id)} style={{ background:userVoted?"rgba(212,168,83,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${userVoted?"#D4A853":"rgba(255,255,255,0.1)"}`,borderRadius:"999px",color:userVoted?"#D4A853":"#64748B",padding:"0.2rem 0.6rem",cursor:"pointer",fontSize:"0.75rem",display:"flex",alignItems:"center",gap:"0.3rem" }}>
          ⭐ {voteCount}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ data, onAddActivity, onEditActivity, onDeleteActivity, onVote, currentUser }) {
  const { activities, participants } = data;

  const stats = {
    total: activities.length,
    reserved: activities.filter(a => a.status === "reserved").length,
    must: activities.filter(a => a.priority === "must").length,
    totalCost: activities.reduce((s,a) => s + (a.cost||0), 0),
    byCity: CITIES.map(c => ({ ...c, count: activities.filter(a => a.city === c.id).length })).filter(c => c.count > 0),
    topVoted: [...activities].sort((a,b) => Object.values(b.votes||{}).filter(Boolean).length - Object.values(a.votes||{}).filter(Boolean).length).slice(0,3),
    mustDo: activities.filter(a => a.priority === "must" && a.status !== "discarded").slice(0,4),
  };

  const petals = Array.from({length:12},(_,i)=>i);

  return (
    <div style={{ padding:"0" }}>
      <div style={{ position:"relative",background:"linear-gradient(135deg,#0D1B2A 0%,#1A2744 50%,#0D1B2A 100%)",borderRadius:"1rem",padding:"2rem",marginBottom:"1.5rem",overflow:"hidden",minHeight:"160px" }}>
        <div style={{ position:"absolute",right:"1.5rem",bottom:0,fontSize:"7rem",opacity:0.08,lineHeight:1,userSelect:"none" }}>⛩️</div>
        <div style={{ position:"absolute",right:"8rem",bottom:0,fontSize:"5rem",opacity:0.05,lineHeight:1,userSelect:"none" }}>🗻</div>
        {petals.map(i => (
          <div key={i} style={{ position:"absolute",top:`${10+Math.random()*60}%`,left:`${Math.random()*60}%`,fontSize:`${0.6+Math.random()*0.8}rem`,opacity:0.15,transform:`rotate(${Math.random()*360}deg)`,userSelect:"none" }}>🌸</div>
        ))}

        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:"0.75rem",color:"#D4A853",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem" }}>Tu viaje a</div>
          <h1 style={{ margin:"0 0 0.25rem",color:"#F8F5F0",fontSize:"clamp(1.5rem,4vw,2.2rem)",fontWeight:800 }}>{data.tripName}</h1>
          {data.tripDates.start && data.tripDates.end && (
            <div style={{ color:"#94A3B8",fontSize:"0.875rem" }}>📅 {data.tripDates.start} → {data.tripDates.end}</div>
          )}
          <div style={{ display:"flex",gap:"0.5rem",marginTop:"0.75rem",flexWrap:"wrap" }}>
            {participants.map(p => (
              <span key={p.id} style={{ background:`${p.color}22`,color:p.color,border:`1px solid ${p.color}44`,borderRadius:"999px",padding:"0.2rem 0.7rem",fontSize:"0.8rem",fontWeight:600 }}>
                {p.avatar} {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"0.75rem",marginBottom:"1.5rem" }}>
        {[
          { label:"Actividades", value:stats.total, icon:"📍", color:"#3B82F6" },
          { label:"Imprescindibles", value:stats.must, icon:"🔥", color:"#EF4444" },
          { label:"Reservadas", value:stats.reserved, icon:"✅", color:"#10B981" },
          { label:"Coste total est.", value:`€${stats.totalCost}`, icon:"💴", color:"#D4A853" },
        ].map((s,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.07)",borderRadius:"0.75rem",padding:"1rem",textAlign:"center" }}>
            <div style={{ fontSize:"1.5rem",marginBottom:"0.25rem" }}>{s.icon}</div>
            <div style={{ color:s.color,fontSize:"1.4rem",fontWeight:800 }}>{s.value}</div>
            <div style={{ color:"#64748B",fontSize:"0.72rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
        <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(248,245,240,0.07)",borderRadius:"0.75rem",padding:"1rem" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem" }}>
            <h3 style={{ margin:0,color:"#F8F5F0",fontSize:"0.875rem",fontWeight:700 }}>🔥 Imprescindibles</h3>
            <button onClick={onAddActivity} style={{ ...btnPrimary,padding:"0.3rem 0.7rem",fontSize:"0.75rem" }}>+ Añadir</button>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.4rem" }}>
            {stats.mustDo.length === 0 ? <p style={{ color:"#64748B",fontSize:"0.8rem",textAlign:"center",padding:"1rem" }}>Sin actividades imprescindibles aún</p>
              : stats.mustDo.map(a => <ActivityCard key={a.id} act={a} participants={participants} onEdit={onEditActivity} onDelete={onDeleteActivity} onVote={onVote} currentUser={currentUser} compact />)}
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(248,245,240,0.07)",borderRadius:"0.75rem",padding:"1rem" }}>
          <h3 style={{ margin:"0 0 0.75rem",color:"#F8F5F0",fontSize:"0.875rem",fontWeight:700 }}>🗾 Por ciudad</h3>
          {stats.byCity.length === 0 ? <p style={{ color:"#64748B",fontSize:"0.8rem",textAlign:"center",padding:"1rem" }}>Sin actividades</p>
            : stats.byCity.map(c => (
              <div key={c.id} style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.6rem" }}>
                <span style={{ fontSize:"1.1rem" }}>{c.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.2rem" }}>
                    <span style={{ color:"#F8F5F0",fontSize:"0.8rem",fontWeight:600 }}>{c.name}</span>
                    <span style={{ color:c.color,fontSize:"0.8rem",fontWeight:700 }}>{c.count}</span>
                  </div>
                  <div style={{ height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px" }}>
                    <div style={{ height:"100%",background:c.color,borderRadius:"2px",width:`${Math.min(100,(c.count/Math.max(1,stats.total))*100)}%` }} />
                  </div>
                </div>
              </div>
            ))}

          <h3 style={{ margin:"1rem 0 0.75rem",color:"#F8F5F0",fontSize:"0.875rem",fontWeight:700 }}>⭐ Más votadas</h3>
          {stats.topVoted.filter(a => Object.values(a.votes||{}).some(Boolean)).length === 0
            ? <p style={{ color:"#64748B",fontSize:"0.8rem" }}>Todavía no hay votos</p>
            : stats.topVoted.filter(a => Object.values(a.votes||{}).some(Boolean)).map(a => (
              <div key={a.id} style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.4rem" }}>
                <span style={{ fontSize:"0.9rem" }}>{getCat(a.category).icon}</span>
                <span style={{ color:"#F8F5F0",fontSize:"0.8rem",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.title}</span>
                <span style={{ color:"#D4A853",fontSize:"0.8rem",fontWeight:700 }}>⭐{Object.values(a.votes||{}).filter(Boolean).length}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function KanbanView({ data, onAddActivity, onEditActivity, onDeleteActivity, onVote, currentUser }) {
  const { activities, participants } = data;
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? activities : activities.filter(a => a.city === filter);

  return (
    <div>
      <div style={{ display:"flex",gap:"0.5rem",marginBottom:"1rem",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap" }}>
          <button onClick={() => setFilter("all")} style={{ ...btnSecondary,padding:"0.35rem 0.8rem",fontSize:"0.78rem",background:filter==="all"?"rgba(192,57,43,0.3)":undefined,borderColor:filter==="all"?"#C0392B":undefined }}>Todas</button>
          {CITIES.filter(c => activities.some(a => a.city === c.id)).map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{ ...btnSecondary,padding:"0.35rem 0.8rem",fontSize:"0.78rem",background:filter===c.id?`${c.color}33`:undefined,borderColor:filter===c.id?c.color:undefined }}>{c.emoji} {c.name}</button>
          ))}
        </div>
        <button onClick={onAddActivity} style={{ ...btnPrimary,padding:"0.35rem 0.85rem",fontSize:"0.8rem" }}>+ Actividad</button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:`repeat(${STATUSES.length},minmax(220px,1fr))`,gap:"0.75rem",overflowX:"auto" }}>
        {STATUSES.map(status => {
          const cols = filtered.filter(a => a.status === status.id);
          return (
            <div key={status.id} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(248,245,240,0.06)",borderRadius:"0.75rem",padding:"0.75rem",minHeight:"300px" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem" }}>
                <span style={{ color:status.color,fontWeight:700,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.05em" }}>{status.label}</span>
                <span style={{ background:status.bg,color:status.color,borderRadius:"999px",padding:"0.1rem 0.5rem",fontSize:"0.78rem",fontWeight:700 }}>{cols.length}</span>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem" }}>
                {cols.map(a => (
                  <ActivityCard key={a.id} act={a} participants={participants} onEdit={onEditActivity} onDelete={onDeleteActivity} onVote={onVote} currentUser={currentUser} />
                ))}
                {cols.length === 0 && <div style={{ color:"#334155",fontSize:"0.8rem",textAlign:"center",padding:"1.5rem 0" }}>Sin actividades</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineView({ data, onAddActivity, onEditActivity, onDeleteActivity }) {
  const { activities, participants } = data;
  const scheduled = activities.filter(a => a.day && a.status !== "discarded").sort((a,b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return (a.time||"00:00").localeCompare(b.time||"00:00");
  });
  const unscheduled = activities.filter(a => !a.day && a.status !== "discarded");

  const days = [...new Set(scheduled.map(a => a.day))].sort();

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
        <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>📅 Timeline del viaje</h2>
        <button onClick={onAddActivity} style={{ ...btnPrimary,padding:"0.35rem 0.85rem",fontSize:"0.8rem" }}>+ Actividad</button>
      </div>

      {days.length === 0 && (
        <div style={{ background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(248,245,240,0.1)",borderRadius:"0.75rem",padding:"2rem",textAlign:"center",color:"#64748B" }}>
          <div style={{ fontSize:"2rem",marginBottom:"0.5rem" }}>📅</div>
          <p>Ninguna actividad tiene fecha asignada aún.<br/>Edita las actividades y añade día y hora para verlas aquí.</p>
        </div>
      )}

      {days.map(day => {
        const dayActs = scheduled.filter(a => a.day === day);
        const dateLabel = new Date(day + "T12:00:00").toLocaleDateString("es-ES", { weekday:"long",day:"numeric",month:"long" });
        return (
          <div key={day} style={{ marginBottom:"1.5rem" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem" }}>
              <div style={{ width:"2.5rem",height:"2.5rem",background:"linear-gradient(135deg,#C0392B,#E74C3C)",borderRadius:"0.5rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <span style={{ color:"#fff",fontWeight:800,fontSize:"0.9rem" }}>{new Date(day+"T12:00:00").getDate()}</span>
              </div>
              <div>
                <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.9rem",textTransform:"capitalize" }}>{dateLabel}</div>
                <div style={{ color:"#64748B",fontSize:"0.75rem" }}>{dayActs.length} actividades · {dayActs.reduce((s,a)=>s+(a.duration||0),0)} min totales</div>
              </div>
            </div>
            <div style={{ borderLeft:"2px solid rgba(192,57,43,0.3)",paddingLeft:"1.25rem",display:"flex",flexDirection:"column",gap:"0.5rem" }}>
              {dayActs.map(a => {
                const cat = getCat(a.category);
                const city = getCity(a.city);
                return (
                  <div key={a.id} onClick={() => onEditActivity(a)} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.07)",borderLeft:`3px solid ${cat.color}`,borderRadius:"0.5rem",padding:"0.75rem",cursor:"pointer",display:"flex",gap:"0.75rem",alignItems:"flex-start" }}>
                    <div style={{ textAlign:"center",flexShrink:0,minWidth:"3rem" }}>
                      <div style={{ color:"#D4A853",fontWeight:700,fontSize:"0.85rem" }}>{a.time||"—"}</div>
                      {a.duration>0 && <div style={{ color:"#475569",fontSize:"0.7rem" }}>{a.duration}m</div>}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:"0.4rem" }}>
                        <span style={{ fontSize:"1rem" }}>{cat.icon}</span>
                        <span style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.875rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.title}</span>
                      </div>
                      <div style={{ color:"#64748B",fontSize:"0.75rem",marginTop:"0.15rem" }}>{city.emoji} {city.name}{a.description?` · ${a.description.substring(0,60)}${a.description.length>60?"…":""}`:""}</div>
                    </div>
                    {a.cost>0 && <div style={{ color:"#D4A853",fontSize:"0.8rem",fontWeight:700,flexShrink:0 }}>€{a.cost}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {unscheduled.length > 0 && (
        <div style={{ marginTop:"1.5rem",background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(248,245,240,0.08)",borderRadius:"0.75rem",padding:"1rem" }}>
          <h3 style={{ margin:"0 0 0.75rem",color:"#94A3B8",fontSize:"0.85rem",fontWeight:700 }}>📌 Sin fecha asignada ({unscheduled.length})</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"0.5rem" }}>
            {unscheduled.map(a => <ActivityCard key={a.id} act={a} participants={participants} onEdit={onEditActivity} onDelete={onDeleteActivity} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}

function CitiesView({ data, onAddActivity, onEditActivity, onDeleteActivity, onVote, currentUser }) {
  const { activities, participants } = data;
  const [selected, setSelected] = useState(null);

  const citiesWithActivities = CITIES.filter(c => activities.some(a => a.city === c.id));
  const displayCities = citiesWithActivities.length > 0 ? citiesWithActivities : CITIES.slice(0,4);

  const cityActs = (cityId) => activities.filter(a => a.city === cityId && a.status !== "discarded");

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
        <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>🗾 Organización por ciudades</h2>
        <button onClick={onAddActivity} style={{ ...btnPrimary,padding:"0.35rem 0.85rem",fontSize:"0.8rem" }}>+ Actividad</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem" }}>
        {displayCities.map(city => {
          const acts = cityActs(city.id);
          const isOpen = selected === city.id;
          return (
            <div key={city.id} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${isOpen?city.color:"rgba(248,245,240,0.07)"}`,borderRadius:"0.75rem",overflow:"hidden" }}>
              <div onClick={() => setSelected(isOpen ? null : city.id)} style={{ padding:"1rem",cursor:"pointer",borderBottom:isOpen?`1px solid ${city.color}33`:"none",background:isOpen?`${city.color}11`:"transparent" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"0.75rem" }}>
                  <span style={{ fontSize:"1.8rem" }}>{city.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.95rem" }}>{city.name}</div>
                    <div style={{ color:city.color,fontSize:"0.78rem",fontWeight:600 }}>{acts.length} actividades</div>
                  </div>
                  <div style={{ display:"flex",gap:"0.3rem" }}>
                    {CATEGORIES.filter(cat => acts.some(a => a.category === cat.id)).slice(0,4).map(cat => (
                      <span key={cat.id} style={{ fontSize:"0.9rem" }}>{cat.icon}</span>
                    ))}
                  </div>
                </div>
                {acts.length > 0 && (
                  <div style={{ display:"flex",gap:"0.3rem",marginTop:"0.6rem",flexWrap:"wrap" }}>
                    {STATUSES.map(s => {
                      const n = acts.filter(a => a.status === s.id).length;
                      return n > 0 ? <span key={s.id} style={{ fontSize:"0.68rem",background:s.bg,color:s.color,padding:"0.1rem 0.4rem",borderRadius:"0.25rem",fontWeight:700 }}>{n} {s.label}</span> : null;
                    })}
                  </div>
                )}
              </div>
              {isOpen && (
                <div style={{ padding:"0.75rem",display:"flex",flexDirection:"column",gap:"0.4rem",maxHeight:"300px",overflowY:"auto" }}>
                  {acts.length === 0 ? (
                    <div style={{ color:"#64748B",fontSize:"0.8rem",textAlign:"center",padding:"1rem" }}>Sin actividades para {city.name}</div>
                  ) : acts.map(a => (
                    <ActivityCard key={a.id} act={a} participants={participants} onEdit={onEditActivity} onDelete={onDeleteActivity} onVote={onVote} currentUser={currentUser} compact />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParticipantsView({ data, onUpdateData }) {
  const { participants, activities } = data;
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("👤");
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0]);

  const avatars = ["👤","👩","👨","🧑","👩‍💼","👨‍💼","🧑‍💼","👩‍🎨","👨‍🎨","🧑‍🎨","🧳"];

  const addParticipant = () => {
    if (!newName.trim()) return;
    const updated = [...participants, { id: uid(), name: newName.trim(), color: newColor, avatar: newAvatar, interests: [] }];
    onUpdateData({ ...data, participants: updated });
    setNewName(""); setShowForm(false);
  };

  const removeParticipant = (pid) => {
    onUpdateData({ ...data, participants: participants.filter(p => p.id !== pid) });
  };

  const updateInterests = (pid, text) => {
    const updated = participants.map(p => p.id === pid ? { ...p, interests: text.split(",").map(i => i.trim()).filter(Boolean) } : p);
    onUpdateData({ ...data, participants: updated });
  };

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
        <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>👥 Viajeros ({participants.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnPrimary}>+ Viajero</button>
      </div>

      {showForm && (
        <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.1)",borderRadius:"0.75rem",padding:"1rem",marginBottom:"1rem" }}>
          <Field label="Nombre">
            <input style={inputStyle} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre del viajero" onKeyDown={e => e.key==="Enter" && addParticipant()} />
          </Field>
          <Field label="Avatar">
            <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap" }}>
              {avatars.map(a => <button key={a} onClick={() => setNewAvatar(a)} style={{ fontSize:"1.3rem",background:newAvatar===a?"rgba(192,57,43,0.3)":"rgba(255,255,255,0.05)",border:`1px solid ${newAvatar===a?"#C0392B":"rgba(255,255,255,0.1)"}`,borderRadius:"0.4rem",padding:"0.3rem 0.5rem",cursor:"pointer" }}>{a}</button>)}
            </div>
          </Field>
          <Field label="Color">
            <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap" }}>
              {AVATAR_COLORS.map(c => <button key={c} onClick={() => setNewColor(c)} style={{ width:"1.5rem",height:"1.5rem",borderRadius:"50%",background:c,border:`2px solid ${newColor===c?"#fff":"transparent"}`,cursor:"pointer" }} />)}
            </div>
          </Field>
          <div style={{ display:"flex",gap:"0.5rem" }}>
            <button style={btnSecondary} onClick={() => setShowForm(false)}>Cancelar</button>
            <button style={btnPrimary} onClick={addParticipant}>Añadir</button>
          </div>
        </div>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem" }}>
        {participants.map(p => {
          const myActs = activities.filter(a => a.participants?.includes(p.id));
          const myVotes = activities.filter(a => a.votes?.[p.id]);
          return (
            <div key={p.id} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${p.color}33`,borderRadius:"0.75rem",padding:"1.25rem" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem" }}>
                <div style={{ width:"2.8rem",height:"2.8rem",background:`${p.color}22`,border:`2px solid ${p.color}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0 }}>
                  {p.avatar}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"1rem" }}>{p.name}</div>
                  <div style={{ color:"#64748B",fontSize:"0.75rem" }}>{myActs.length} actividades · {myVotes.length} votos</div>
                </div>
                <button onClick={() => removeParticipant(p.id)} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"1rem" }}>🗑️</button>
              </div>

              <Field label="Intereses (separados por coma)">
                <input style={inputStyle} defaultValue={p.interests.join(", ")} onBlur={e => updateInterests(p.id, e.target.value)} placeholder="Templos, gastronomía, fotografía..." />
              </Field>

              {p.interests.length > 0 && (
                <div style={{ display:"flex",gap:"0.3rem",flexWrap:"wrap",marginTop:"0.25rem" }}>
                  {p.interests.map((int,i) => <span key={i} style={{ fontSize:"0.72rem",background:`${p.color}18`,color:p.color,padding:"0.15rem 0.5rem",borderRadius:"999px" }}>{int}</span>)}
                </div>
              )}

              {myActs.length > 0 && (
                <div style={{ marginTop:"0.75rem" }}>
                  <div style={{ color:"#64748B",fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase",marginBottom:"0.3rem" }}>Sus actividades</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:"0.25rem" }}>
                    {myActs.slice(0,3).map(a => (
                      <div key={a.id} style={{ display:"flex",alignItems:"center",gap:"0.4rem" }}>
                        <span style={{ fontSize:"0.8rem" }}>{getCat(a.category).icon}</span>
                        <span style={{ color:"#94A3B8",fontSize:"0.78rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.title}</span>
                      </div>
                    ))}
                    {myActs.length > 3 && <span style={{ color:"#475569",fontSize:"0.72rem" }}>+{myActs.length-3} más</span>}
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

function VotesView({ data, onVote, currentUser }) {
  const { activities, participants } = data;
  const sorted = [...activities].filter(a => a.status !== "discarded").sort((a,b) => {
    const va = Object.values(a.votes||{}).filter(Boolean).length;
    const vb = Object.values(b.votes||{}).filter(Boolean).length;
    return vb - va;
  });

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem" }}>
        <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>🗳️ Votaciones grupales</h2>
      </div>
      <p style={{ color:"#64748B",fontSize:"0.8rem",marginBottom:"1rem" }}>Vota las actividades que más te interesan. Las más populares subirán al top.</p>

      <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
        {sorted.map((a,i) => {
          const votes = a.votes || {};
          const voteCount = Object.values(votes).filter(Boolean).length;
          const userVoted = currentUser && votes[currentUser];
          const cat = getCat(a.category);
          const maxVotes = participants.length || 1;

          return (
            <div key={a.id} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(248,245,240,0.07)",borderRadius:"0.75rem",padding:"1rem",display:"flex",gap:"1rem",alignItems:"center" }}>
              <div style={{ color:"#334155",fontWeight:800,fontSize:"1.1rem",minWidth:"1.5rem",textAlign:"center" }}>#{i+1}</div>
              <span style={{ fontSize:"1.3rem" }}>{cat.icon}</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.875rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.title}</div>
                <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginTop:"0.4rem" }}>
                  <div style={{ flex:1,height:"6px",background:"rgba(255,255,255,0.06)",borderRadius:"3px" }}>
                    <div style={{ height:"100%",background:"linear-gradient(90deg,#D4A853,#F59E0B)",borderRadius:"3px",width:`${(voteCount/maxVotes)*100}%` }} />
                  </div>
                  <span style={{ color:"#D4A853",fontWeight:700,fontSize:"0.8rem",flexShrink:0 }}>{voteCount}/{maxVotes}</span>
                </div>
                <div style={{ display:"flex",gap:"0.25rem",marginTop:"0.35rem",flexWrap:"wrap" }}>
                  {participants.map(p => (
                    <span key={p.id} title={p.name} style={{ width:"1.2rem",height:"1.2rem",borderRadius:"50%",background:votes[p.id]?p.color:"rgba(255,255,255,0.06)",border:`1px solid ${votes[p.id]?p.color:"rgba(255,255,255,0.1)"}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem" }}>{votes[p.id]?"✓":""}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => onVote(a.id)} style={{ background:userVoted?"rgba(212,168,83,0.2)":"rgba(255,255,255,0.05)",border:`2px solid ${userVoted?"#D4A853":"rgba(255,255,255,0.1)"}`,borderRadius:"0.5rem",color:userVoted?"#D4A853":"#64748B",padding:"0.5rem 0.75rem",cursor:"pointer",fontWeight:700,flexShrink:0,fontSize:"0.85rem" }}>
                {userVoted?"⭐ Votado":"☆ Votar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocsView({ data, onUpdateData }) {
  const { documents } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"",type:"note",city:"",content:"",link:"" });
  const docTypes = [
    { id:"note", label:"Nota", icon:"📝" },
    { id:"guide", label:"Guía", icon:"📖" },
    { id:"link", label:"Enlace", icon:"🔗" },
    { id:"image", label:"Imagen", icon:"🖼️" },
    { id:"pdf", label:"PDF", icon:"📄" },
  ];

  const addDoc = () => {
    if (!form.title.trim()) return;
    onUpdateData({ ...data, documents: [...documents, { id:uid(), ...form, date:new Date().toISOString() }] });
    setForm({ title:"",type:"note",city:"",content:"",link:"" }); setShowForm(false);
  };

  const removeDoc = (id) => onUpdateData({ ...data, documents: documents.filter(d => d.id !== id) });

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
        <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>📁 Documentos y guías</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnPrimary}>+ Documento</button>
      </div>

      {showForm && (
        <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.1)",borderRadius:"0.75rem",padding:"1rem",marginBottom:"1rem" }}>
          <Field label="Título *">
            <input style={inputStyle} value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="ej. Guía de Kioto 2025" />
          </Field>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
            <Field label="Tipo">
              <select style={inputStyle} value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                {docTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </Field>
            <Field label="Ciudad">
              <select style={inputStyle} value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))}>
                <option value="">General</option>
                {CITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </Field>
          </div>
          {(form.type === "note" || form.type === "guide") && (
            <Field label="Contenido">
              <textarea style={{ ...inputStyle,height:"100px",resize:"vertical" }} value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} placeholder="Escribe aquí..." />
            </Field>
          )}
          {(form.type === "link" || form.type === "pdf") && (
            <Field label="URL / Enlace">
              <input style={inputStyle} value={form.link} onChange={e => setForm(f=>({...f,link:e.target.value}))} placeholder="https://..." />
            </Field>
          )}
          <div style={{ display:"flex",gap:"0.5rem" }}>
            <button style={btnSecondary} onClick={() => setShowForm(false)}>Cancelar</button>
            <button style={btnPrimary} onClick={addDoc}>Guardar</button>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div style={{ background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(248,245,240,0.08)",borderRadius:"0.75rem",padding:"2rem",textAlign:"center",color:"#64748B" }}>
          <div style={{ fontSize:"2rem",marginBottom:"0.5rem" }}>📁</div>
          <p>Aún no hay documentos. Añade guías, notas, enlaces o recursos para el viaje.</p>
        </div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"0.75rem" }}>
          {documents.map(d => {
            const dtype = docTypes.find(t => t.id === d.type) || docTypes[0];
            const city = d.city ? getCity(d.city) : null;
            return (
              <div key={d.id} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.08)",borderRadius:"0.75rem",padding:"1rem" }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.5rem",marginBottom:"0.5rem" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
                    <span style={{ fontSize:"1.3rem" }}>{dtype.icon}</span>
                    <div>
                      <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.85rem" }}>{d.title}</div>
                      {city && <div style={{ color:city.color,fontSize:"0.72rem",fontWeight:600 }}>{city.emoji} {city.name}</div>}
                    </div>
                  </div>
                  <button onClick={() => removeDoc(d.id)} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"0.9rem" }}>🗑️</button>
                </div>
                {d.content && <p style={{ color:"#94A3B8",fontSize:"0.78rem",margin:"0 0 0.4rem",lineHeight:1.4,maxHeight:"80px",overflow:"hidden" }}>{d.content}</p>}
                {d.link && <a href={d.link} target="_blank" rel="noreferrer" style={{ color:"#60A5FA",fontSize:"0.78rem",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>🔗 {d.link}</a>}
                <div style={{ color:"#334155",fontSize:"0.68rem",marginTop:"0.5rem" }}>{new Date(d.date).toLocaleDateString("es-ES")}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReservationsView({ data, onUpdateData }) {
  const { reservations } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"",type:"activity",link:"",status:"pending",notes:"",city:"",cost:"" });
  const resTypes = [
    { id:"hotel", label:"Hotel", icon:"🏨" },
    { id:"flight", label:"Vuelo", icon:"✈️" },
    { id:"transport", label:"Transporte", icon:"🚄" },
    { id:"restaurant", label:"Restaurante", icon:"🍣" },
    { id:"activity", label:"Actividad/Entrada", icon:"🎟️" },
    { id:"other", label:"Otro", icon:"📋" },
  ];
  const resStatuses = [
    { id:"pending", label:"Pendiente", color:"#94A3B8" },
    { id:"reserved", label:"Reservado", color:"#3B82F6" },
    { id:"paid", label:"Pagado", color:"#10B981" },
    { id:"cancelled", label:"Cancelado", color:"#EF4444" },
  ];

  const addRes = () => {
    if (!form.title.trim()) return;
    onUpdateData({ ...data, reservations: [...reservations, { id:uid(), ...form, cost:Number(form.cost)||0, date:new Date().toISOString() }] });
    setForm({ title:"",type:"activity",link:"",status:"pending",notes:"",city:"",cost:"" }); setShowForm(false);
  };

  const updateStatus = (id, status) => {
    onUpdateData({ ...data, reservations: reservations.map(r => r.id===id?{...r,status}:r) });
  };

  const removeRes = (id) => onUpdateData({ ...data, reservations: reservations.filter(r => r.id !== id) });

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
        <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>🎫 Gestión de reservas</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnPrimary}>+ Reserva</button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.5rem",marginBottom:"1rem" }}>
        {resStatuses.map(s => {
          const n = reservations.filter(r => r.status === s.id).length;
          return (
            <div key={s.id} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(248,245,240,0.06)",borderRadius:"0.5rem",padding:"0.6rem",textAlign:"center" }}>
              <div style={{ color:s.color,fontWeight:800,fontSize:"1.2rem" }}>{n}</div>
              <div style={{ color:"#64748B",fontSize:"0.68rem",fontWeight:600,textTransform:"uppercase" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.1)",borderRadius:"0.75rem",padding:"1rem",marginBottom:"1rem" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Título *">
                <input style={inputStyle} value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="ej. Hotel Kyoto Garden" />
              </Field>
            </div>
            <Field label="Tipo">
              <select style={inputStyle} value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                {resTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </Field>
            <Field label="Estado">
              <select style={inputStyle} value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                {resStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Coste total (€)">
              <input style={inputStyle} type="number" value={form.cost} onChange={e => setForm(f=>({...f,cost:e.target.value}))} placeholder="0" />
            </Field>
            <Field label="Ciudad">
              <select style={inputStyle} value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))}>
                <option value="">General</option>
                {CITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Enlace (reserva, confirmación...)">
                <input style={inputStyle} value={form.link} onChange={e => setForm(f=>({...f,link:e.target.value}))} placeholder="https://..." />
              </Field>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Notas">
                <input style={inputStyle} value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} placeholder="Número de reserva, instrucciones..." />
              </Field>
            </div>
          </div>
          <div style={{ display:"flex",gap:"0.5rem" }}>
            <button style={btnSecondary} onClick={() => setShowForm(false)}>Cancelar</button>
            <button style={btnPrimary} onClick={addRes}>Guardar</button>
          </div>
        </div>
      )}

      {reservations.length === 0 ? (
        <div style={{ background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(248,245,240,0.08)",borderRadius:"0.75rem",padding:"2rem",textAlign:"center",color:"#64748B" }}>
          <div style={{ fontSize:"2rem",marginBottom:"0.5rem" }}>🎫</div>
          <p>No hay reservas aún. Añade hoteles, vuelos, entradas y transportes.</p>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:"0.6rem" }}>
          {reservations.map(r => {
            const rtype = resTypes.find(t => t.id === r.type) || resTypes[resTypes.length-1];
            const rstatus = resStatuses.find(s => s.id === r.status) || resStatuses[0];
            const city = r.city ? getCity(r.city) : null;
            return (
              <div key={r.id} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(248,245,240,0.07)",borderRadius:"0.75rem",padding:"0.85rem",display:"flex",gap:"0.75rem",alignItems:"center" }}>
                <span style={{ fontSize:"1.4rem",flexShrink:0 }}>{rtype.icon}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ color:"#F8F5F0",fontWeight:700,fontSize:"0.875rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.title}</div>
                  <div style={{ display:"flex",gap:"0.4rem",marginTop:"0.25rem",flexWrap:"wrap" }}>
                    {city && <span style={{ color:city.color,fontSize:"0.72rem",fontWeight:600 }}>{city.emoji} {city.name}</span>}
                    {r.cost > 0 && <span style={{ color:"#D4A853",fontSize:"0.72rem",fontWeight:600 }}>€{r.cost}</span>}
                    {r.notes && <span style={{ color:"#64748B",fontSize:"0.72rem" }}>{r.notes}</span>}
                  </div>
                  {r.link && <a href={r.link} target="_blank" rel="noreferrer" style={{ color:"#60A5FA",fontSize:"0.72rem" }} onClick={e=>e.stopPropagation()}>🔗 Abrir enlace</a>}
                </div>
                <div style={{ display:"flex",gap:"0.4rem",alignItems:"center",flexShrink:0 }}>
                  <select value={r.status} onChange={e => updateStatus(r.id,e.target.value)} style={{ ...inputStyle,width:"auto",padding:"0.25rem 0.5rem",fontSize:"0.75rem",color:rstatus.color }}>
                    {resStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <button onClick={() => removeRes(r.id)} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer" }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function JapanTripPlanner() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultData();
    } catch { return defaultData(); }
  });

  const [view, setView] = useState("dashboard");
  const [editActivity, setEditActivity] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); return d.participants?.[0]?.id || null; } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const saveActivity = useCallback((act) => {
    const exists = data.activities.find(a => a.id === act.id);
    const updated = exists
      ? data.activities.map(a => a.id === act.id ? act : a)
      : [...data.activities, { ...act, id: uid(), votes: {} }];
    setData(d => ({ ...d, activities: updated }));
    setEditActivity(null);
    setShowAddActivity(false);
  }, [data.activities]);

  const deleteActivity = useCallback((id) => {
    setData(d => ({ ...d, activities: d.activities.filter(a => a.id !== id) }));
    setEditActivity(null);
  }, []);

  const voteActivity = useCallback((actId) => {
    if (!currentUser) return;
    setData(d => ({
      ...d,
      activities: d.activities.map(a => a.id === actId
        ? { ...a, votes: { ...a.votes, [currentUser]: !a.votes?.[currentUser] } }
        : a
      )
    }));
  }, [currentUser]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="japan-trip.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { setData(JSON.parse(ev.target.result)); } catch { alert("Error al importar: JSON inválido"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const currentParticipant = data.participants.find(p => p.id === currentUser);

  const renderView = () => {
    const props = { data, onAddActivity:()=>setShowAddActivity(true), onEditActivity:setEditActivity, onDeleteActivity:deleteActivity, onVote:voteActivity, currentUser, onUpdateData:setData };
    switch(view) {
      case "dashboard": return <Dashboard {...props} />;
      case "kanban": return <KanbanView {...props} />;
      case "timeline": return <TimelineView {...props} />;
      case "cities": return <CitiesView {...props} />;
      case "participants": return <ParticipantsView {...props} />;
      case "docs": return <DocsView {...props} />;
      case "reservations": return <ReservationsView {...props} />;
      case "votes": return <VotesView {...props} />;
      default: return null;
    }
  };

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0D1B2A",fontFamily:"Inter, -apple-system, sans-serif",color:"#F8F5F0" }}>
      <div style={{ width:sidebarOpen?"220px":"60px",flexShrink:0,background:"rgba(26,39,68,0.95)",borderRight:"1px solid rgba(248,245,240,0.06)",display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <div style={{ padding:"1rem",borderBottom:"1px solid rgba(248,245,240,0.06)",display:"flex",alignItems:"center",gap:"0.6rem",minHeight:"60px" }}>
          <span style={{ fontSize:"1.4rem",flexShrink:0 }}>🗾</span>
          {sidebarOpen && <div>
            <div style={{ color:"#F8F5F0",fontWeight:800,fontSize:"0.85rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"140px" }}>{data.tripName}</div>
            <div style={{ color:"#D4A853",fontSize:"0.65rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em" }}>Trip Planner</div>
          </div>}
        </div>

        <nav style={{ flex:1,padding:"0.5rem",overflowY:"auto" }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{ width:"100%",display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.55rem 0.65rem",borderRadius:"0.5rem",border:"none",background:view===v.id?"rgba(192,57,43,0.25)":"transparent",color:view===v.id?"#F8F5F0":"#94A3B8",cursor:"pointer",fontSize:"0.82rem",fontWeight:view===v.id?700:500,textAlign:"left",marginBottom:"0.1rem",whiteSpace:"nowrap" }}>
              <span style={{ fontSize:"1rem",flexShrink:0 }}>{v.icon}</span>
              {sidebarOpen && v.label}
            </button>
          ))}
        </nav>

        {sidebarOpen && data.participants.length > 0 && (
          <div style={{ padding:"0.75rem",borderTop:"1px solid rgba(248,245,240,0.06)" }}>
            <div style={{ color:"#475569",fontSize:"0.68rem",fontWeight:600,textTransform:"uppercase",marginBottom:"0.3rem" }}>Eres</div>
            <select value={currentUser||""} onChange={e => setCurrentUser(e.target.value)} style={{ ...inputStyle,fontSize:"0.78rem",padding:"0.3rem 0.5rem" }}>
              <option value="">— Seleccionar —</option>
              {data.participants.map(p => <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>)}
            </select>
          </div>
        )}

        <div style={{ padding:"0.5rem",borderTop:"1px solid rgba(248,245,240,0.06)",display:"flex",flexDirection:"column",gap:"0.25rem" }}>
          {sidebarOpen && <>
            <button onClick={exportData} style={{ ...btnSecondary,width:"100%",fontSize:"0.75rem",padding:"0.35rem",justifyContent:"center",display:"flex",gap:"0.3rem" }}>📤 Exportar</button>
            <label style={{ ...btnSecondary,width:"100%",fontSize:"0.75rem",padding:"0.35rem",cursor:"pointer",textAlign:"center",boxSizing:"border-box" }}>
              📥 Importar<input type="file" accept=".json" onChange={importData} style={{ display:"none" }} />
            </label>
          </>}
          <button onClick={() => setSidebarOpen(o=>!o)} style={{ ...btnSecondary,width:"100%",fontSize:"0.75rem",padding:"0.35rem",justifyContent:"center",display:"flex" }}>
            {sidebarOpen?"◀":"▶"}
          </button>
        </div>
      </div>

      <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden" }}>
        <div style={{ height:"60px",borderBottom:"1px solid rgba(248,245,240,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.25rem",background:"rgba(13,27,42,0.6)",position:"sticky",top:0,zIndex:10,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
            <span style={{ color:"#D4A853",fontSize:"1.1rem" }}>{VIEWS.find(v=>v.id===view)?.icon}</span>
            <h2 style={{ margin:0,color:"#F8F5F0",fontSize:"1rem",fontWeight:700 }}>{VIEWS.find(v=>v.id===view)?.label}</h2>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
            <input value={data.tripName} onChange={e => setData(d=>({...d,tripName:e.target.value}))} style={{ ...inputStyle,width:"auto",maxWidth:"180px",fontSize:"0.8rem",padding:"0.3rem 0.6rem",textAlign:"center" }} />
            {currentParticipant && (
              <div style={{ background:`${currentParticipant.color}22`,border:`1px solid ${currentParticipant.color}44`,borderRadius:"999px",padding:"0.25rem 0.7rem",fontSize:"0.78rem",color:currentParticipant.color,fontWeight:600,flexShrink:0 }}>
                {currentParticipant.avatar} {currentParticipant.name}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex:1,overflowY:"auto",padding:"1.25rem" }}>
          {renderView()}
        </div>
      </div>

      {showAddActivity && (
        <Modal title="➕ Nueva actividad" onClose={() => setShowAddActivity(false)} wide>
          <ActivityForm participants={data.participants} onSave={saveActivity} onClose={() => setShowAddActivity(false)} />
        </Modal>
      )}
      {editActivity && (
        <Modal title="✏️ Editar actividad" onClose={() => setEditActivity(null)} wide>
          <ActivityForm initial={{ ...editActivity, links: editActivity.links?.join(", ")||"" }} participants={data.participants} onSave={saveActivity} onClose={() => setEditActivity(null)} />
          <div style={{ borderTop:"1px solid rgba(248,245,240,0.08)",marginTop:"1rem",paddingTop:"0.75rem",display:"flex",justifyContent:"flex-end" }}>
            <button onClick={() => { deleteActivity(editActivity.id); }} style={{ ...btnSecondary,color:"#EF4444",borderColor:"#EF4444",fontSize:"0.8rem" }}>🗑️ Eliminar actividad</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
