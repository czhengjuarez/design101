import { useState } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

const CATEGORIES = [
  'Design Craft / Visual Design',
  'User Research / UX Methods',
  'Jobs To Be Done',
  'Information Architecture / OOUX',
  'Design Systems',
  'Books',
  'Tools',
  'Other',
];

export default function Suggest() {
  const [form, setForm] = useState({ title: '', url: '', category: '', note: '', submitter: '' });
  const [status, setStatus] = useState<Status>('idle');

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('done');
      setForm({ title: '', url: '', category: '', note: '', submitter: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <span className="badge badge--brand">Community</span>
      <h1 style={{ marginTop: 'var(--of-space-4)', fontSize: 'var(--of-text-3xl)', marginBottom: 'var(--of-space-3)' }}>
        Suggest a resource
      </h1>
      <p style={{ color: 'var(--of-fg-muted)', fontSize: 'var(--of-text-lg)', marginBottom: 'var(--of-space-8)' }}>
        Found an article, book, tool, or video that belongs in this course?
        Suggest it and we'll review it for the resources or books tab.
      </p>

      {status === 'done' ? (
        <div className="suggest-success">
          <p className="suggest-success-title">Thanks — suggestion received.</p>
          <p className="suggest-success-body">We'll review it and add it to the right module if it fits.</p>
          <button type="button" className="btn btn--ghost" style={{ marginTop: 'var(--of-space-4)' }} onClick={() => setStatus('idle')}>
            Suggest another
          </button>
        </div>
      ) : (
        <form className="suggest-form" onSubmit={submit}>
          <div className="suggest-field">
            <label className="suggest-label" htmlFor="suggest-title">Title <span className="suggest-required">*</span></label>
            <input
              id="suggest-title"
              className="suggest-input"
              type="text"
              placeholder="e.g. Visual Hierarchy in UI Design (NN/g)"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          <div className="suggest-field">
            <label className="suggest-label" htmlFor="suggest-url">URL <span className="suggest-required">*</span></label>
            <input
              id="suggest-url"
              className="suggest-input"
              type="url"
              placeholder="https://"
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
              required
            />
          </div>

          <div className="suggest-field">
            <label className="suggest-label" htmlFor="suggest-category">Module / category</label>
            <select
              id="suggest-category"
              className="suggest-input suggest-select"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              <option value="">— Select one —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="suggest-field">
            <label className="suggest-label" htmlFor="suggest-note">Why it belongs here</label>
            <textarea
              id="suggest-note"
              className="suggest-input suggest-textarea"
              placeholder="One or two sentences on why this is useful for non-designers..."
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              rows={3}
            />
          </div>

          <div className="suggest-field">
            <label className="suggest-label" htmlFor="suggest-submitter">Your name or email (optional)</label>
            <input
              id="suggest-submitter"
              className="suggest-input"
              type="text"
              placeholder="For follow-up if we have questions"
              value={form.submitter}
              onChange={(e) => set('submitter', e.target.value)}
            />
          </div>

          {status === 'error' && (
            <p className="suggest-error">Something went wrong — please try again.</p>
          )}

          <button type="submit" className="btn btn--brand" disabled={status === 'sending' || !form.title.trim() || !form.url.trim()}>
            {status === 'sending' ? 'Sending…' : 'Submit suggestion'}
          </button>
        </form>
      )}
    </div>
  );
}
