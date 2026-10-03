import ImageIcon from './ImageIcon';
import { useState, useRef, useCallback } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

const MAX_EDGE = 1280;

// Downscale in the browser so uploads stay small and fast.
function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas unavailable')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image.')); };
    img.src = url;
  });
}

export default function AICritique() {
  const [intent, setIntent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [critique, setCritique] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function applyFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { setErrorMsg('Image must be under 10 MB.'); return; }
    try {
      setPreview(await toDataUrl(file));
      setErrorMsg('');
      setCritique('');
      setStatus('idle');
    } catch (err) {
      setErrorMsg(String((err as Error).message || err));
    }
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
    setPreview(null);
    setCritique('');
    setStatus('idle');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!intent.trim() || !preview) {
      setErrorMsg(
        !intent.trim() && !preview
          ? 'Add a screenshot and say what the screen is trying to do.'
          : !intent.trim()
            ? 'Say what this screen is trying to do (step 1) before requesting a critique.'
            : 'Add a screenshot first: drop it in the box, click to browse, or paste it.',
      );
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview, intent: intent.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setCritique(data.critique);
      setStatus('done');
    } catch (err) {
      setErrorMsg(String((err as Error).message || err));
      setStatus('error');
    }
  }

  return (
    <form className="suggest-form" onSubmit={submit} onPaste={onPaste}>
      <div className="suggest-field">
        <label className="suggest-label" htmlFor="ai-intent">
          1. What is this screen trying to do? <span className="suggest-required">*</span>
        </label>
        <input
          id="ai-intent"
          className="suggest-input"
          type="text"
          placeholder="e.g. Get a new visitor to start a free trial"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className="suggest-field">
        <span className="suggest-label">
          Before you submit: where does your eye land first? Write it down, then compare.
        </span>
        <div
          className={`share-dropzone${dragging ? ' share-dropzone--over' : ''}${preview ? ' share-dropzone--has-image' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !preview && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !preview && fileRef.current?.click()}
          aria-label="Upload or paste a screenshot"
        >
          {preview ? (
            <div className="share-preview-wrap">
              <img src={preview} alt="Your screenshot" className="share-preview-img" />
              <button
                type="button"
                className="share-preview-remove"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                aria-label="Remove screenshot"
              >✕</button>
            </div>
          ) : (
            <div className="share-dropzone-inner">
              <div className="share-dropzone-icon"><ImageIcon /></div>
              <p className="share-dropzone-label">Drop a screenshot, click to browse, or paste from clipboard</p>
              <p className="share-dropzone-hint">Use a screen you own. Don't include customer data or secrets.</p>
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
      </div>

      {errorMsg && <p className="suggest-error">{errorMsg}</p>}

      <button
        type="submit"
        className="btn btn--brand"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Critiquing…' : 'Critique my screen'}
      </button>

      {status === 'sending' && (
        <p className="share-dropzone-hint" role="status">Looking at your screen. This can take 10 to 20 seconds.</p>
      )}

      {critique && (
        <div className="tutor-bubble ai-critique-result" role="region" aria-label="AI critique">
          {critique}
        </div>
      )}
    </form>
  );
}
