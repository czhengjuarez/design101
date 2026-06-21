import { useState, useEffect, useCallback } from 'react';

interface Suggestion {
  id: string;
  title: string;
  url: string;
  category: string | null;
  note: string | null;
  submitter: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

export default function Admin() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return (
      <div style={{ maxWidth: 400 }}>
        <span className="badge badge--arc">Admin</span>
        <h1 style={{ marginTop: 'var(--of-space-4)', fontSize: 'var(--of-text-2xl)', marginBottom: 'var(--of-space-6)' }}>
          Sign in
        </h1>
        <form className="suggest-form" onSubmit={(e) => { e.preventDefault(); if (key.trim()) setAuthed(true); }}>
          <div className="suggest-field">
            <label className="suggest-label" htmlFor="admin-key">Admin passphrase</label>
            <input
              id="admin-key"
              className="suggest-input"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="passphrase"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn--brand" disabled={!key.trim()}>Continue</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--of-space-8)' }}>
        <h1 style={{ fontSize: 'var(--of-text-2xl)' }}>Admin</h1>
        <button type="button" className="btn btn--ghost" style={{ fontSize: 'var(--of-text-sm)' }} onClick={() => { setAuthed(false); setKey(''); }}>
          Sign out
        </button>
      </div>
      <SuggestionsPanel adminKey={key} />
      <div style={{ marginTop: 'var(--of-space-12)', borderTop: '1px solid var(--of-border-subtle)', paddingTop: 'var(--of-space-8)' }}>
        <CommunityPanel adminKey={key} />
      </div>
    </div>
  );
}

function CommunityPanel({ adminKey }: { adminKey: string }) {
  const [posts, setPosts] = useState<{ id: string; title: string; name: string | null; submitted_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/community')
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function remove(id: string) {
    await fetch(`/api/admin/community/${id}`, { method: 'DELETE', headers: { 'X-Admin-Key': adminKey } });
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--of-text-lg)', marginBottom: 'var(--of-space-5)' }}>
        Community posts <span className="badge badge--arc">{posts.length}</span>
      </h2>
      {loading && <p style={{ color: 'var(--of-fg-subtle)' }}>Loading…</p>}
      {!loading && posts.length === 0 && <p style={{ color: 'var(--of-fg-subtle)' }}>No posts yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--of-space-3)' }}>
        {posts.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--of-space-4)', border: '1px solid var(--of-border-line)', borderRadius: 'var(--of-radius-md)', background: 'var(--of-bg-elevated)' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 2 }}>{p.title}</p>
              <p style={{ fontSize: 'var(--of-text-xs)', color: 'var(--of-fg-subtle)' }}>
                {p.name || 'Anonymous'} · {new Date(p.submitted_at).toLocaleDateString()}
              </p>
            </div>
            <button type="button" style={{ fontSize: 'var(--of-text-sm)', color: 'var(--of-fg-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--of-space-2)' }} onClick={() => remove(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionsPanel({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/suggestions', { headers: { 'X-Admin-Key': adminKey } });
      if (res.status === 401) { setError('Wrong passphrase.'); setLoading(false); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: Suggestion['status']) {
    await fetch(`/api/admin/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
      body: JSON.stringify({ status }),
    });
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  }

  async function remove(id: string) {
    await fetch(`/api/admin/suggestions/${id}`, { method: 'DELETE', headers: { 'X-Admin-Key': adminKey } });
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  const visible = filter === 'all' ? items : items.filter((s) => s.status === filter);
  const counts = { all: items.length, pending: items.filter((s) => s.status === 'pending').length, approved: items.filter((s) => s.status === 'approved').length, rejected: items.filter((s) => s.status === 'rejected').length };

  if (loading) return <p style={{ color: 'var(--of-fg-subtle)' }}>Loading suggestions…</p>;
  if (error) return <p style={{ color: 'var(--of-fg-danger)' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--of-space-5)' }}>
        <h2 style={{ fontSize: 'var(--of-text-lg)' }}>
          Content suggestions
          {counts.pending > 0 && <span className="badge badge--brand" style={{ marginLeft: 'var(--of-space-3)' }}>{counts.pending} pending</span>}
        </h2>
        <button type="button" className="btn btn--ghost" style={{ fontSize: 'var(--of-text-sm)' }} onClick={load}>Refresh</button>
      </div>

      {/* Filter tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--of-space-6)' }}>
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button key={f} className={`tab-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="admin-empty">
          <p>No {filter === 'all' ? '' : filter} suggestions yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--of-space-4)' }}>
          {visible.map((s) => (
            <div key={s.id} className="suggestion-card">
              <div className="suggestion-card-header">
                <div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="suggestion-title">{s.title}</a>
                  <p className="suggestion-url">{s.url}</p>
                </div>
                <span className={`badge suggestion-status--${s.status}`}>{s.status}</span>
              </div>
              {s.category && <p className="suggestion-meta">Module: {s.category}</p>}
              {s.note && <p className="suggestion-note">{s.note}</p>}
              {s.submitter && <p className="suggestion-meta">From: {s.submitter}</p>}
              <p className="suggestion-meta">{new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <div className="suggestion-actions">
                {s.status !== 'approved' && (
                  <button type="button" className="btn btn--ghost" style={{ fontSize: 'var(--of-text-sm)' }} onClick={() => updateStatus(s.id, 'approved')}>Approve</button>
                )}
                {s.status !== 'rejected' && (
                  <button type="button" className="btn btn--ghost" style={{ fontSize: 'var(--of-text-sm)' }} onClick={() => updateStatus(s.id, 'rejected')}>Reject</button>
                )}
                {s.status === 'approved' && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn--brand" style={{ fontSize: 'var(--of-text-sm)' }}>
                    Add to modules.ts ↗
                  </a>
                )}
                <button type="button" style={{ fontSize: 'var(--of-text-sm)', color: 'var(--of-fg-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--of-space-2)' }} onClick={() => remove(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
