import { useRef, useState, useEffect } from 'react';

interface Citation {
  title: string;
  url: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

interface Props {
  moduleId: string;
  moduleTitle: string;
  suggestions: string[];
}

export default function AskTutor({ moduleId, moduleTitle, suggestions }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, question: q, history }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer ?? 'No answer.', citations: data.citations ?? [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'The tutor is unavailable right now. (This needs the Worker running with the Workers AI binding — `npm run dev:worker`.)',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tutor">
      <div className="tutor-head">
        <span className="dot" />
        <strong>Ask the Tutor</strong>
        <span>· grounded in {moduleTitle}</span>
      </div>

      <div className="tutor-log" ref={logRef}>
        {messages.length === 0 && (
          <div className="tutor-empty">
            <p>Ask anything about this module. The tutor reasons with you and cites the lesson.</p>
            <div className="tutor-suggestions">
              {suggestions.map((s) => (
                <button key={s} type="button" className="tutor-chip" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`tutor-msg ${m.role}`}>
            <div className="tutor-bubble">{m.content}</div>
            {m.citations && m.citations.length > 0 && (
              <div className="tutor-cites">
                {m.citations.map((c, j) => (
                  <a key={j} className="tutor-cite" href={c.url} target="_blank" rel="noopener noreferrer">
                    ↗ {c.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="tutor-msg assistant">
            <div className="tutor-bubble">Thinking…</div>
          </div>
        )}
      </div>

      <form
        className="tutor-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          className="tutor-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          aria-label="Ask the tutor a question"
        />
        <button type="submit" className="btn btn--brand" disabled={loading || !input.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
