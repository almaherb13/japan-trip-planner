import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "japan_trip_v1";

const CATEGORIES = [
  { id: "temple", label: "Templo / Santuario", icon: "鉀╋笍", color: "#8B5CF6" },
  { id: "food", label: "Gastronom铆a", icon: "馃崳", color: "#EF4444" },
  { id: "nature", label: "Naturaleza", icon: "馃尭", color: "#10B981" },
  { id: "culture", label: "Cultura / Arte", icon: "馃幁", color: "#F59E0B" },
  { id: "shopping", label: "Compras", icon: "馃泹锔�", color: "#EC4899" },
  { id: "transport", label: "Transporte", icon: "馃殑", color: "#3B82F6" },
  { id: "hotel", label: "Alojamiento", icon: "馃彣", color: "#6366F1" },
  { id: "experience", label: "Experiencia", icon: "鉁�", color: "#14B8A6" },
  { id: "nightlife", label: "Ocio / Noche", icon: "馃彯", color: "#F97316" },
  { id: "other", label: "Otro", icon: "馃搷", color: "#64748B" },
];

const CITIES = [
  { id: "tokyo", name: "Tokio", emoji: "馃椉", color: "#3B82F6" },
  { id: "kyoto", name: "Kioto", emoji: "鉀╋笍", color: "#8B5CF6" },
  { id: "osaka", name: "Osaka", emoji: "馃彲", color: "#EF4444" },
  { id: "nara", name: "Nara", emoji: "馃", color: "#10B981" },
  { id: "hiroshima", name: "Hiroshima", emoji: "鈽笍", color: "#F59E0B" },
  { id: "hakone", name: "Hakone", emoji: "馃椈", color: "#6366F1" },
  { id: "nikko", name: "Nikko", emoji: "馃尶", color: "#14B8A6" },
  { id: "other", name: "Otro", emoji: "馃椌", color: "#64748B" },
];

const STATUSES = [
  { id: "pending", label: "Pendiente", color: "#94A3B8", bg: "#F1F5F9" },
  { id: "interested", label: "En consideraci贸n", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "reserved", label: "Reservado", color: "#3B82F6", bg: "#EFF6FF" },
  { id: "done", label: "Realizado", color: "#10B981", bg: "#ECFDF5" },
  { id: "discarded", label: "Descartado", color: "#EF4444", bg: "#FEF2F2" },
];

const PRIORITIES = [
  { id: "must", label: "Imprescindible", icon: "馃敟", color: "#EF4444" },
  { id: "high", label: "Alta", icon: "猸�", color: "#F59E0B" },
  { id: "medium", label: "Media", icon: "馃挋", color: "#3B82F6" },
  { id: "low", label: "Baja", icon: "馃尡", color: "#10B981" },
];

const AVATAR_COLORS = [
  "#EF4444","#F97316","#EAB308","#22C55E","#14B8A6","#3B82F6","#8B5CF6","#EC4899","#06B6D4","#84CC16"
];

const VIEWS = [
  { id: "dashboard", label: "Dashboard", icon: "馃彔" },
  { id: "kanban", label: "Kanban", icon: "馃搵" },
  { id: "timeline", label: "Timeline", icon: "馃搮" },
  { id: "cities", label: "Ciudades", icon: "馃椌" },
  { id: "participants", label: "Viajeros", icon: "馃懃" },
  { id: "docs", label: "Documentos", icon: "馃搧" },
  { id: "reservations", label: "Reservas", icon: "馃帿" },
  { id: "votes", label: "Votaciones", icon: "馃棾锔�" },
];

const uid = () => Math.random().toString(36).slice(2, 10);
const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const getCity = (id) => CITIES.find(c => c.id === id) || CITIES[CITIES.length - 1];
const getStatus = (id) => STATUSES.find(s => s.id === id) || STATUSES[0];
const getPriority = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[2];

const defaultData = () => ({
  tripName: "馃嚡馃嚨 Jap贸n 2025",
  tripDates: { start: "", end: "" },
  participants: [
    { id: uid(), name: "T煤", color: "#3B82F6", avatar: "馃懁", interests: ["Templos", "Gastronom铆a", "Fotograf铆a"] },
  ],
  activities: [
    {
      id: uid(), title: "Fushimi Inari Taisha", description: "Miles de torii naranjas en la monta帽a. Subir al amanecer para evitar multitudes.", city: "kyoto", category: "temple",
      priority: "must", status: "interested", participants: [], cost: 0, duration: 180, links: ["https://inari.jp"], votes: {}, day: "", time: "",
    },
    {
      id: uid(), title: "Mercado de Nishiki", description: "El 'cocina de Kioto'. Probad el dango, el tofu y los encurtidos.", city: "kyoto", category: "food",
      priority: "high", status: "interested", participants: [], cost: 20, duration: 90, links: [], votes: {}, day: "", time: "",
    },
    {
      id: uid(), title: "Shibuya Crossing", description: "El cruce peatonal m谩s famoso del mundo. Mejor de noche con las luces.", city: "tokyo", category: "experience",
      priority: "must", status: "interested", participants: [], cost: 0, duration: 30, links: [], votes: {}, day: "", time: "",
    },
    {
      id: uid(), title: "Shinkansen Tokio 鈫� Kioto", description: "Reservar con JR Pass. El Nozomi tarda 2h15min.", city: "tokyo", category: "transport",
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
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:"1.3rem",lineHeight:1 }}>脳</button>
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
          <Field label="T铆tulo *">
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="ej. Templo Senso-ji al amanecer" />
          </Field>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Descripci贸n">
            <textarea style={{ ...inputStyle,height:"70px",resize:"vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Notas, recomendaciones, horarios..." />
          </Field>
        </div>
        <Field label="Ciudad">
          <select style={inputStyle} value={form.city} onChange={e => set("city", e.target.value)}>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </Field>
        <Field label="Categor铆a">
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
        <Field label="Coste estimado (鈧�/pp)">
          <input style={inputStyle} type="number" value={form.cost} onChange={e => set("cost", e.target.value)} placeholder="0" />
        </Field>
        <Field label="Duraci贸n (minutos)">
          <input style={inputStyle} type="number" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="ej. 120" />
        </Field>
        <Field label="D铆a planeado">
          <input style={inputStyle} type="date" value={form.day} onChange={e => set("day", e.target.value)} />
        </Field>
        <Field label="Hora">
          <input style={inputStyle} type="time" value={form.time} onChange={e => set("time", e.target.value)} />
        </Field>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Enlace(s) 鈥� separados por coma">
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
          <button onClick={() => onEdit(act)} style={{ background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"0.85rem",padding:"0.2rem" }}>鉁忥笍</button>
          <button onClick={() => onDelete(act.id)} style={{ background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"0.85rem",padding:"0.2rem" }}>馃棏锔�</button>
        </div>
      </div>

      {act.description && <p style={{ color:"#94A3B8",fontSize:"0.8rem",margin:"0 0 0.6rem",lineHeight:1.4 }}>{act.description}</p>}

      <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.6rem" }}>
        <span style={{ fontSize:"0.72rem",background:status.bg,color:status.color,padding:"0.2rem 0.5rem",borderRadius:"0.25rem",fontWeight:700 }}>{status.label}</span>
        {act.cost > 0 && <span style={{ fontSize:"0.72rem",background:"rgba(212,168,83,0.15)",color:"#D4A853",padding:"0.2rem 0.5rem",borderRadius:"0.25rem",fontWeight:600 }}>鈧瑊act.cost}/pp</span>}
        {act.duration > 0 && <span style={{ fontSize:"0.72rem",background:"rgba(100,116,139,0.2)",color:"#94A3B8",padding:"0.2rem 0.5rem",borderRadius:"0.25rem" }}>鈴� {act.duration < 60 ? `${act.duration}min` : `${Math.floor(act.duration/60)}h${act.duration%60?` ${act.duration%60}m`:""}` }</span>}
        {act.day && <span style={{ fontSize:"0.72rem",background:"rgba(99,102,241,0.15)",color:"#818CF8",padding:"0.2rem 0.5rem",borderRadius:"0.25rem" }}>馃搮 {act.day}{act.time?` ${act.time}`:""}</span>}
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
              <a key={i} href={l} target="_blank" rel="noreferrer" style={{ fontSize:"0.7rem",color:"#60A5FA",textDecoration:"none" }} onClick={e => e.stopPropagation()}>馃敆 Link{act.links.length>1?` ${i+1}`:""}</a>
            ))}
          </div>
        )}
        <button onClick={() => onVote && onVote(act.id)} style={{ background:userVoted?"rgba(212,168,83,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${userVoted?"#D4A853":"rgba(255,255,255,0.1)"}`,borderRadius:"999px",color:userVoted?"#D4A853":"#64748B",padding:"0.2rem 0.6rem",cursor:"pointer",fontSize:"0.75rem",display:"flex",alignItems:"center",gap:"0.3rem" }}>
          猸� {voteCount}
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
        <div style={{ position:"absolute",right:"1.5rem",bottom:0,fontSize:"7rem",opacity:0.08,lineHeight:1,userSelect:"none" }}>鉀╋笍</div>
        <div style={{ position:"absolute",right:"8rem",bottom:0,fontSize:"5rem",opacity:0.05,lineHeight:1,userSelect:"none" }}>馃椈</div>
        {petals.map(i => (
          <div key={i} style={{ position:"absolute",top:`${10+Math.random()*60}%`,left:`${Math.random()*60}%`,fontSize:`${0.6+Math.random()*0.8}rem`,opacity:0.15,transform:`rotate(${Math.random()*360}deg)`,userSelect:"none" }}>馃尭</div>
        ))}

        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:"0.75rem",color:"#D4A853",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem" }}>Tu viaje a</div>
          <h1 style={{ margin:"0 0 0.25rem",color:"#F8F5F0",fontSize:"clamp(1.5rem,4vw,2.2rem)",fontWeight:800 }}>{data.tripName}</h1>
          {data.tripDates.start && data.tripDates.end && (
            <div style={{ color:"#94A3B8",fontSize:"0.875rem" }}>馃搮 {data.tripDates.start} 鈫� {data.tripDates.end}</div>
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
          { label:"Actividades", value:stats.total, icon:"馃搷", color:"#3B82F6" },
          { label:"Imprescindibles", value:stats.must, icon:"馃敟", color:"#EF4444" },
          { label:"Reservadas", value:stats.reserved, icon:"鉁�", color:"#10B981" },
          { label:"Coste total est.", value:`鈧�${stats.totalCost}`, icon:"馃挻", color:"#D4A853" },
        ].map((s,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(248,245,240,0.07)",borderRadius:"0.75rem",padding:"1rem",textAlign:"center" }}>
            <div style={{ fontSize:"1.5rem",ma
