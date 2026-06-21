import { useState, useRef, useCallback } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function Share() {
  const [form, setForm] = useState({ title: '', description: '', name: '', contact: '' });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function applyFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { setErrorMsg('Image must be under 10 MB.'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrorMsg('');
  }

  const onPaste = useCallback((e: React.ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith('image/'));
    if (file) { e.preventDefault(); applyFile(file); }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
    if (file) applyFile(file);
  }, []);

  function removeImage() {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      if (form.name.trim()) fd.append('name', form.name.trim());
      if (form.contact.trim()) fd.append('contact', form.contact.trim());
      if (image) fd.append('image', image);
      const res = await fetch('/api/community', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('done');
      setForm({ title: '', description: '', name: '', contact: '' });
      removeImage();
    } catch (err) {
      setErrorMsg(String(err));
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div style={{ maxWidth: 600 }}>
        <div className="suggest-success">
          <p className="suggest-success-title">Your post is live.</p>
          <p className="suggest-success-body">It will appear in the Community space for others to find and reach out.</p>
          <div style={{ display: 'flex', gap: 'var(--of-space-3)', justifyContent: 'center', marginTop: 'var(--of-space-5)' }}>
            <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>Share another</button>
            <a href="/community" className="btn btn--brand">See the community</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <span className="badge badge--brand">Community</span>
      <h1 style={{ marginTop: 'var(--of-space-4)', fontSize: 'var(--of-text-3xl)', marginBottom: 'var(--of-space-3)' }}>
        Share your teaching
      </h1>
      <p style={{ color: 'var(--of-fg-muted)', fontSize: 'var(--of-text-lg)', marginBottom: 'var(--of-space-8)', lineHeight: 'var(--of-leading-relaxed)' }}>
        Teaching non-designers about design? Using this curriculum or your own approach?
        Share what you did — a workshop, a session, a moment that clicked — so others can learn from it too.
      </p>

      <form className="suggest-form" onSubmit={submit} onPaste={onPaste}>

        {/* Image drop zone */}
        <div
          className={`share-dropzone${dragging ? ' share-dropzone--over' : ''}${preview ? ' share-dropzone--has-image' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !preview && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !preview && fileRef.current?.click()}
          aria-label="Upload or paste an image"
        >
          {preview ? (
            <div className="share-preview-wrap">
              <img src={preview} alt="Preview" className="share-preview-img" />
              <button
                type="button"
                className="share-preview-remove"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                aria-label="Remove image"
              >✕</button>
            </div>
          ) : (
            <div className="share-dropzone-inner">
              <div className="share-dropzone-icon">🖼</div>
              <p className="share-dropzone-label">Drop an image, click to browse, or paste from clipboard</p>
              <p className="share-dropzone-hint">JPG, PNG, GIF, WebP · max 10 MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) applyFile(f); }}
          />
        </div>

        <div className="suggest-field">
          <label className="suggest-label" htmlFor="share-title">
            Title <span className="suggest-required">*</span>
          </label>
          <input
            id="share-title"
            className="suggest-input"
            type="text"
            placeholder="e.g. Visual hierarchy workshop for our engineering team"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
          />
        </div>

        <div className="suggest-field">
          <label className="suggest-label" htmlFor="share-desc">
            What happened <span className="suggest-required">*</span>
          </label>
          <textarea
            id="share-desc"
            className="suggest-input suggest-textarea"
            placeholder="Tell us what you taught, how it went, what worked, what surprised you. The more detail the better — someone else will learn from this."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={6}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--of-space-4)' }}>
          <div className="suggest-field">
            <label className="suggest-label" htmlFor="share-name">Your name <span style={{ color: 'var(--of-fg-subtle)', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="share-name"
              className="suggest-input"
              type="text"
              placeholder="How you'd like to be known"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div className="suggest-field">
            <label className="suggest-label" htmlFor="share-contact">Email or link <span style={{ color: 'var(--of-fg-subtle)', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="share-contact"
              className="suggest-input"
              type="text"
              placeholder="So others can reach you"
              value={form.contact}
              onChange={(e) => set('contact', e.target.value)}
            />
          </div>
        </div>

        {errorMsg && <p className="suggest-error">{errorMsg}</p>}

        <button
          type="submit"
          className="btn btn--brand"
          disabled={status === 'sending' || !form.title.trim() || !form.description.trim()}
        >
          {status === 'sending' ? 'Posting…' : 'Post to community'}
        </button>
      </form>
    </div>
  );
}
