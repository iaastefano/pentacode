"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FolderOpen, MessageSquare, FileText, Users,
  LogOut, Plus, Trash2, Edit3, Save, X, Play, ExternalLink, Eye, EyeOff, ChevronDown, ChevronRight,
  Upload, ImageIcon, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Tab = "dashboard" | "projects" | "testimonials" | "chats" | "quotes" | "settings";

interface Project {
  id: string; title: string; description: string; url: string | null;
  technologies: string; images: string; order: number; visible: boolean; createdAt: string;
}

interface Testimonial {
  id: string; name: string; company: string | null; photo: string | null;
  text: string; rating: number; videoUrl: string | null; visible: boolean; createdAt: string;
}

interface ChatSession {
  id: string; clientName: string | null; clientEmail: string | null;
  status: string; createdAt: string;
  messages: { id: string; role: string; content: string; createdAt: string }[];
}

interface QuoteRequest {
  id: string; name: string; email: string; phone: string | null;
  description: string | null; audioPath: string | null; status: string; createdAt: string;
}

interface SiteSettingsData {
  projectsCount: number;
  clientsCount: number;
  satisfactionRate: number;
}

const tabs = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
  { id: "projects" as Tab, label: "Proyectos", icon: FolderOpen },
  { id: "testimonials" as Tab, label: "Testimonios", icon: Users },
  { id: "chats" as Tab, label: "Chats IA", icon: MessageSquare },
  { id: "quotes" as Tab, label: "Solicitudes", icon: FileText },
  { id: "settings" as Tab, label: "Configuración", icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>({
    projectsCount: 50,
    clientsCount: 30,
    satisfactionRate: 99,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const refreshSiteSettings = () => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        setSiteSettings({
          projectsCount: Number(data.projectsCount) || 50,
          clientsCount: Number(data.clientsCount) || 30,
          satisfactionRate: Number(data.satisfactionRate) || 99,
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/projects?all=true").then((r) => r.json()).then(setProjects).catch(() => {});
    fetch("/api/testimonials?all=true").then((r) => r.json()).then(setTestimonials).catch(() => {});
    fetch("/api/chats").then((r) => r.json()).then(setChats).catch(() => {});
    fetch("/api/quote").then((r) => r.json()).then(setQuotes).catch(() => {});
    refreshSiteSettings();
  }, []);

  const refreshData = () => {
    fetch("/api/projects?all=true").then((r) => r.json()).then(setProjects).catch(() => {});
    fetch("/api/testimonials?all=true").then((r) => r.json()).then(setTestimonials).catch(() => {});
    fetch("/api/chats").then((r) => r.json()).then(setChats).catch(() => {});
    fetch("/api/quote").then((r) => r.json()).then(setQuotes).catch(() => {});
    refreshSiteSettings();
  };

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <aside className={cn("bg-brand-darkest border-r border-white/5 flex flex-col transition-all", sidebarOpen ? "w-60" : "w-16")}>
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Image src="/logo-pentacode.svg" alt="" width={32} height={32} className="h-8 w-auto" />
          {sidebarOpen && <span className="font-bold text-sm">Admin</span>}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                activeTab === tab.id ? "bg-brand-green/10 text-brand-green" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={18} />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-white/5">
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} />
            {sidebarOpen && <span>Salir</span>}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "dashboard" && <DashboardView projects={projects} testimonials={testimonials} chats={chats} quotes={quotes} />}
        {activeTab === "projects" && <ProjectsView projects={projects} onRefresh={refreshData} />}
        {activeTab === "testimonials" && <TestimonialsView testimonials={testimonials} onRefresh={refreshData} />}
        {activeTab === "chats" && <ChatsView chats={chats} />}
        {activeTab === "quotes" && <QuotesView quotes={quotes} />}
        {activeTab === "settings" && <SettingsView settings={siteSettings} onSave={setSiteSettings} />}
      </main>
    </div>
  );
}

function DashboardView({ projects, testimonials, chats, quotes }: { projects: Project[]; testimonials: Testimonial[]; chats: ChatSession[]; quotes: QuoteRequest[] }) {
  const stats = [
    { label: "Proyectos", value: projects.length, icon: FolderOpen },
    { label: "Testimonios", value: testimonials.length, icon: Users },
    { label: "Chats IA", value: chats.length, icon: MessageSquare },
    { label: "Solicitudes", value: quotes.length, icon: FileText },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className="text-brand-green" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Últimas solicitudes</h2>
        <div className="space-y-2">
          {quotes.slice(0, 5).map((q) => (
            <div key={q.id} className="glass rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{q.name}</p>
                <p className="text-xs text-white/40">{q.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {q.audioPath && <Play size={14} className="text-brand-green" />}
                <span className="text-xs text-white/30">{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsView({ projects, onRefresh }: { projects: Project[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", url: "", technologies: "", images: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const imageList: string[] = (() => {
    try { return JSON.parse(form.images || "[]"); } catch { return []; }
  })();

  const startEdit = (p: Project) => {
    setEditing(p.id);
    setForm({
      title: p.title, description: p.description, url: p.url || "",
      technologies: p.technologies, images: p.images,
    });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", description: "", url: "", technologies: '["Next.js"]', images: "[]" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => {
          const current: string[] = (() => { try { return JSON.parse(prev.images || "[]"); } catch { return []; } })();
          return { ...prev, images: JSON.stringify([...current, data.path]) };
        });
      } else {
        alert(data.error || "Error al subir la imagen");
      }
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = imageList.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: JSON.stringify(updated) }));
  };

  const save = async () => {
    const images = imageList.length > 0 ? form.images : JSON.stringify(["/images/placeholder-project.svg"]);
    const data = { ...form, images, url: form.url || null };
    if (editing === "new") {
      await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch(`/api/projects/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setEditing(null);
    onRefresh();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar proyecto?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const toggleVisibility = async (p: Project) => {
    await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !p.visible }),
    });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <button onClick={startNew} className="btn-primary text-sm py-2"><Plus size={16} /> Nuevo</button>
      </div>

      {editing && (
        <div className="glass rounded-xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción" rows={3} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none resize-none" />
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="URL del proyecto" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none" />
          <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder='Tecnologías (JSON: ["React","Node.js"])' className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none" />

          {/* Image upload */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Imágenes del proyecto</label>
            <div className="flex flex-wrap gap-3">
              {imageList.map((img, i) => (
                <div key={i} className="relative group w-28 h-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-28 h-20 rounded-lg border-2 border-dashed border-white/10 hover:border-brand-green/40 flex flex-col items-center justify-center gap-1 text-white/30 hover:text-white/60 transition-colors"
              >
                {uploadingImage ? (
                  <span className="text-xs">Subiendo...</span>
                ) : (
                  <>
                    <Upload size={16} />
                    <span className="text-[10px]">Subir imagen</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={save} className="btn-primary text-sm py-2"><Save size={14} /> Guardar</button>
            <button onClick={() => setEditing(null)} className="btn-secondary text-sm py-2"><X size={14} /> Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects.map((p) => {
          const thumbs: string[] = (() => { try { return JSON.parse(p.images || "[]"); } catch { return []; } })();
          const thumb = thumbs[0] || "/images/placeholder-project.svg";
          return (
            <div key={p.id} className={cn("glass rounded-lg p-4 flex items-center justify-between gap-4", !p.visible && "opacity-50")}>
              <div className="relative w-16 h-11 rounded-md overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-xs text-white/40 line-clamp-1">{p.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleVisibility(p)} className="p-2 rounded-lg hover:bg-white/5 text-white/40">
                  {p.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-white/5 text-white/40"><Edit3 size={14} /></button>
                <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TestimonialsView({ testimonials, onRefresh }: { testimonials: Testimonial[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", company: "", text: "", rating: "5", videoUrl: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (t: Testimonial) => {
    setEditing(t.id);
    setForm({ name: t.name, company: t.company || "", text: t.text, rating: String(t.rating), videoUrl: t.videoUrl || "" });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ name: "", company: "", text: "", rating: "5", videoUrl: "" });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const res = await fetch("/api/upload/video", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, videoUrl: data.path }));
      } else {
        alert(data.error || "Error al subir el video");
      }
    } catch {
      alert("Error al subir el video");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const save = async () => {
    const data = { ...form, rating: parseInt(form.rating), company: form.company || null, videoUrl: form.videoUrl || null };
    if (editing === "new") {
      await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch(`/api/testimonials/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setEditing(null);
    onRefresh();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar testimonio?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const toggleVisibility = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !t.visible }),
    });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonios</h1>
        <button onClick={startNew} className="btn-primary text-sm py-2"><Plus size={16} /> Nuevo</button>
      </div>

      {editing && (
        <div className="glass rounded-xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none" />
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Empresa" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none" />
          </div>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Testimonio" rows={3} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none resize-none" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="Rating (1-5)" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none" />
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm hover:border-brand-green/50 transition-colors text-left"
              >
                {uploading ? "Subiendo..." : form.videoUrl ? "Video subido ✓" : "Subir video (opcional)"}
              </button>
              {form.videoUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, videoUrl: "" })}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          {form.videoUrl && (
            <div className="rounded-lg overflow-hidden bg-white/5 aspect-video max-w-sm">
              <video src={form.videoUrl} controls className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary text-sm py-2"><Save size={14} /> Guardar</button>
            <button onClick={() => setEditing(null)} className="btn-secondary text-sm py-2"><X size={14} /> Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {testimonials.map((t) => (
          <div key={t.id} className={cn("glass rounded-lg p-4 flex items-center justify-between", !t.visible && "opacity-50")}>
            <div className="flex-1">
              <p className="font-medium text-sm">
                {t.name} {t.company && <span className="text-white/30">- {t.company}</span>}
                {t.videoUrl && <span className="ml-2 text-brand-green text-xs">🎬 Video</span>}
              </p>
              <p className="text-xs text-white/40 line-clamp-1">{t.text}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleVisibility(t)} className="p-2 rounded-lg hover:bg-white/5 text-white/40">
                {t.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => startEdit(t)} className="p-2 rounded-lg hover:bg-white/5 text-white/40"><Edit3 size={14} /></button>
              <button onClick={() => remove(t.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-white/30 text-center py-8">No hay testimonios aún</p>}
      </div>
    </div>
  );
}

function SettingsView({
  settings,
  onSave,
}: {
  settings: SiteSettingsData;
  onSave: (value: SiteSettingsData) => void;
}) {
  const [form, setForm] = useState({
    projectsCount: String(settings.projectsCount),
    clientsCount: String(settings.clientsCount),
    satisfactionRate: String(settings.satisfactionRate),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      projectsCount: String(settings.projectsCount),
      clientsCount: String(settings.clientsCount),
      satisfactionRate: String(settings.satisfactionRate),
    });
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        projectsCount: Number(form.projectsCount),
        clientsCount: Number(form.clientsCount),
        satisfactionRate: Number(form.satisfactionRate),
      };
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "No se pudo guardar");
        return;
      }
      onSave({
        projectsCount: Number(data.projectsCount) || payload.projectsCount,
        clientsCount: Number(data.clientsCount) || payload.clientsCount,
        satisfactionRate: Number(data.satisfactionRate) || payload.satisfactionRate,
      });
      alert("Configuración guardada");
    } catch {
      alert("No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <div className="glass rounded-xl p-6 space-y-4 max-w-2xl">
        <p className="text-sm text-white/50">
          Estos valores se muestran en la sección principal del sitio: Proyectos, Clientes y Satisfacción.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-white/40 mb-2 block">Proyectos</label>
            <input
              type="number"
              min="0"
              value={form.projectsCount}
              onChange={(e) => setForm((prev) => ({ ...prev, projectsCount: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-2 block">Clientes</label>
            <input
              type="number"
              min="0"
              value={form.clientsCount}
              onChange={(e) => setForm((prev) => ({ ...prev, clientsCount: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-2 block">Satisfacción (%)</label>
            <input
              type="number"
              min="0"
              value={form.satisfactionRate}
              onChange={(e) => setForm((prev) => ({ ...prev, satisfactionRate: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-brand-green/50 focus:outline-none"
            />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-60">
          <Save size={14} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

function ChatsView({ chats }: { chats: ChatSession[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Conversaciones de Chat IA</h1>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div key={chat.id} className="glass rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === chat.id ? null : chat.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="text-left">
                <p className="font-medium text-sm">
                  {chat.clientName || "Cliente anónimo"}
                  <span className="text-white/30 ml-2 text-xs">{chat.messages.length} mensajes</span>
                </p>
                <p className="text-xs text-white/40">{new Date(chat.createdAt).toLocaleString()}</p>
              </div>
              {expanded === chat.id ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />}
            </button>
            {expanded === chat.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                {chat.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : ""}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === "user" ? "bg-brand-green/20 text-brand-green" : "bg-white/5 text-white/70"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {chats.length === 0 && <p className="text-white/30 text-center py-8">No hay conversaciones aún</p>}
      </div>
    </div>
  );
}

function QuotesView({ quotes }: { quotes: QuoteRequest[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Presupuesto</h1>
      <div className="space-y-3">
        {quotes.map((q) => (
          <div key={q.id} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">{q.name}</p>
                <p className="text-sm text-white/40">{q.email} {q.phone && `• ${q.phone}`}</p>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium",
                q.status === "new" ? "bg-brand-green/10 text-brand-green" : q.status === "contacted" ? "bg-yellow-500/10 text-yellow-400" : "bg-white/10 text-white/40"
              )}>
                {q.status}
              </span>
            </div>
            {q.description && <p className="text-sm text-white/60 mb-3">{q.description}</p>}
            {q.audioPath && (
              <audio controls className="w-full h-10 mt-2" src={q.audioPath}>
                <track kind="captions" />
              </audio>
            )}
            <p className="text-xs text-white/30 mt-3">{new Date(q.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {quotes.length === 0 && <p className="text-white/30 text-center py-8">No hay solicitudes aún</p>}
      </div>
    </div>
  );
}
