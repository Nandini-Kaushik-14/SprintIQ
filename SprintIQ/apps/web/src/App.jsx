import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bot, CheckCircle2, CircleAlert, FolderKanban, Plus, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from './api/client';

const columns = ['To Do', 'In Progress', 'Code Review', 'Done'];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('sprintiq_token') || '');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [stories, setStories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [rawRequirement, setRawRequirement] = useState('');
  const [aiDraft, setAiDraft] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadWorkspace() {
    const [me, projectResponse] = await Promise.all([api.get('/auth/me'), api.get('/projects')]);
    setUser(me.data.data.user);
    const list = projectResponse.data.data.projects;
    setProjects(list);
    if (list.length) await selectProject(list[0]);
  }

  async function selectProject(item) {
    setProject(item);
    const [storyResponse, analyticsResponse] = await Promise.all([
      api.get(`/projects/${item._id}/stories`),
      api.get(`/projects/${item._id}/analytics/summary`)
    ]);
    setStories(storyResponse.data.data.stories);
    setSummary(analyticsResponse.data.data);
  }

  useEffect(() => {
    if (!token) return;
    loadWorkspace().catch(() => {
      localStorage.removeItem('sprintiq_token');
      setToken('');
      setNotice('Please sign in again.');
    });
  }, [token]);

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true); setNotice('');
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister ? { name, email, password } : { email, password };
      const response = await api.post(endpoint, body);
      const nextToken = response.data.data.token;
      localStorage.setItem('sprintiq_token', nextToken);
      setToken(nextToken);
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to authenticate.');
    } finally { setBusy(false); }
  }

  async function createProject(event) {
    event.preventDefault();
    try {
      const response = await api.post('/projects', { name: projectName });
      setProjectName('');
      await loadWorkspace();
      setNotice(`Project "${response.data.data.project.name}" created.`);
    } catch (error) { setNotice(error.response?.data?.message || 'Could not create project.'); }
  }

  async function createStory(event) {
    event.preventDefault();
    if (!project) return;
    try {
      await api.post(`/projects/${project._id}/stories`, { title: storyTitle });
      setStoryTitle('');
      await selectProject(project);
      setNotice('Story added to the backlog.');
    } catch (error) { setNotice(error.response?.data?.message || 'Could not add story.'); }
  }

  async function moveStory(story, status) {
    try {
      await api.patch(`/stories/${story._id}/status`, { status });
      await selectProject(project);
    } catch (error) { setNotice(error.response?.data?.message || 'Could not update story.'); }
  }

  async function estimateStory(event) {
    event.preventDefault();
    setBusy(true); setAiDraft(null);
    try {
      const response = await api.post('/ai/estimate-story', { rawRequirement });
      setAiDraft(response.data.data);
    } catch (error) { setNotice(error.response?.data?.message || 'AI service is unavailable.'); }
    finally { setBusy(false); }
  }

  async function acceptDraft() {
    if (!project || !aiDraft) return;
    try {
      await api.post(`/projects/${project._id}/stories`, {
        title: aiDraft.title,
        description: aiDraft.user_story,
        acceptanceCriteria: (aiDraft.acceptance_criteria || []).map(c => `Given ${c.given}, when ${c.when}, then ${c.then}`),
        storyPoints: aiDraft.story_points
      });
      setAiDraft(null); setRawRequirement('');
      await selectProject(project);
      setNotice('AI draft added. Please review it in the backlog before sprint planning.');
    } catch (error) { setNotice(error.response?.data?.message || 'Could not save AI draft.'); }
  }

  function logout() {
    localStorage.removeItem('sprintiq_token');
    setToken(''); setUser(null); setProjects([]); setProject(null); setStories([]);
  }

  const chartData = useMemo(() => columns.map(status => ({
    status, stories: summary?.statusCounts?.[status] || 0
  })), [summary]);

  if (!token) return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark"><Activity size={22} /></div>
        <p className="eyebrow">AGILE PROJECT INTELLIGENCE</p>
        <h1>Welcome to <span>SprintIQ</span></h1>
        <p className="muted">Plan clearly. Spot risks early. Deliver together.</p>
        <form onSubmit={handleAuth} className="stack">
          {isRegister && <label>Your name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" /></label>}
          <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
          <label>Password<input required minLength="8" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></label>
          <button className="primary" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
        </form>
        <button className="text-button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Sign in' : 'New to SprintIQ? Create an account'}
        </button>
        {notice && <p className="notice">{notice}</p>}
      </section>
    </main>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Activity size={20} /></div><strong>SprintIQ</strong></div>
        <p className="side-label">WORKSPACE</p>
        <div className="project-list">
          {projects.map(item => <button key={item._id} className={`project-link ${project?._id === item._id ? 'selected' : ''}`} onClick={() => selectProject(item)}><FolderKanban size={16} />{item.name}</button>)}
        </div>
        <form className="new-project" onSubmit={createProject}>
          <input required value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="New project name" />
          <button title="Create project"><Plus size={16} /></button>
        </form>
        <div className="sidebar-bottom"><span>{user?.name || 'Team member'}</span><button onClick={logout}>Log out</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">PROJECT OVERVIEW</p><h1>{project?.name || 'Your workspace'}</h1></div><div className="user-chip">{user?.role || 'Developer'}</div></header>
        {notice && <div className="notice-bar" onClick={() => setNotice('')}>{notice} <span>×</span></div>}
        {!project ? (
          <section className="empty-state"><FolderKanban size={34} /><h2>Create your first project</h2><p>Use the project field in the sidebar to get started.</p></section>
        ) : <>
          <section className="metric-grid">
            <Metric label="Total stories" value={summary?.totalStories ?? 0} icon={<FolderKanban />} />
            <Metric label="Completed" value={summary?.completedStories ?? 0} icon={<CheckCircle2 />} />
            <Metric label="Completion" value={`${summary?.completionRate ?? 0}%`} icon={<Activity />} />
            <Metric label="Points committed" value={summary?.pointsCommitted ?? 0} icon={<Sparkles />} />
          </section>

          <div className="content-grid">
            <section className="panel board-panel">
              <div className="panel-heading"><div><p className="eyebrow">SPRINT WORKFLOW</p><h2>Kanban board</h2></div><span className="count-pill">{stories.length} stories</span></div>
              <form className="inline-form" onSubmit={createStory}><input required value={storyTitle} onChange={e => setStoryTitle(e.target.value)} placeholder="Add a user story…" /><button className="primary small"><Plus size={15} /> Add</button></form>
              <div className="board">
                {columns.map(status => <div className="board-column" key={status}><div className="column-title"><span>{status}</span><b>{stories.filter(s => s.status === status).length}</b></div>
                  {stories.filter(s => s.status === status).map(story => <article className="story-card" key={story._id}><strong>{story.title}</strong><p>{story.description || 'No description added yet.'}</p><div className="story-meta"><span>{story.priority}</span><span>{story.storyPoints} pts</span></div><select aria-label={`Move ${story.title}`} value={story.status} onChange={e => moveStory(story, e.target.value)}>{columns.map(c => <option key={c}>{c}</option>)}</select></article>)}
                </div>)}
              </div>
            </section>

            <div className="right-column">
              <section className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">PROJECT HEALTH</p><h2>Work distribution</h2></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#263244" /><XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: 10 }} /><Bar dataKey="stories" fill="#7c8cff" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></section>

              <section className="panel ai-panel"><div className="panel-heading"><div><p className="eyebrow">AI CO-PILOT</p><h2><Bot size={19} /> Story & effort estimator</h2></div><Sparkles size={18} /></div><p className="muted small-copy">Turn a rough requirement into a draft user story, acceptance criteria and story points.</p><form onSubmit={estimateStory} className="stack"><textarea required minLength="8" value={rawRequirement} onChange={e => setRawRequirement(e.target.value)} placeholder="Example: Users should be able to reset their password…" /><button className="primary" disabled={busy}>{busy ? 'Analysing…' : 'Generate story draft'} <ArrowRight size={15} /></button></form>
                {aiDraft && <div className="ai-result"><div className="draft-label"><CircleAlert size={14} /> {aiDraft.is_demo ? 'Demo output' : 'AI suggestion'} · Human review required</div><h3>{aiDraft.title}</h3><p>{aiDraft.user_story}</p><p><b>{aiDraft.story_points} story points</b> · Clarity {aiDraft.clarity_score}/100</p><ul>{(aiDraft.acceptance_criteria || []).map((c, i) => <li key={i}>Given {c.given}, when {c.when}, then {c.then}</li>)}</ul><button className="primary small" onClick={acceptDraft}>Add reviewed draft to backlog</button></div>}
              </section>
            </div>
          </div>
        </>}
      </main>
    </div>
  );
}

function Metric({ label, value, icon }) {
  return <article className="metric-card"><div className="metric-icon">{icon}</div><p>{label}</p><strong>{value}</strong></article>;
}
