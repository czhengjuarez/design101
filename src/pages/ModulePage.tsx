import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { modules, getModule } from '../data/modules';
import CourseIcon from '../components/CourseIcon';
import SlideDeck from '../components/SlideDeck';
import CritiqueExercise from '../components/CritiqueExercise';
import DecisionDrill from '../components/DecisionDrill';
import AskTutor from '../components/AskTutor';
import DownloadCurriculum from '../components/DownloadCurriculum';

type Tab = 'slides' | 'resources' | 'books' | 'practice' | 'tutor';

const TAB_LABELS: Record<Tab, string> = {
  slides: 'Slides',
  resources: 'Resources',
  books: 'Books',
  practice: 'Practice',
  tutor: 'Ask the Tutor',
};

export default function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const mod = id ? getModule(id) : undefined;
  const [tab, setTab] = useState<Tab>('slides');

  useEffect(() => {
    setTab('slides');
    window.scrollTo(0, 0);
  }, [id]);

  if (!mod) return <Navigate to="/" replace />;

  const idx = modules.findIndex((m) => m.id === mod.id);
  const prev = idx > 0 ? modules[idx - 1] : null;
  const next = idx < modules.length - 1 ? modules[idx + 1] : null;

  const { resources, books, practice } = mod;

  return (
    <>
      <div className="module-header">
        <p className="module-header-eyebrow">
          <span className="eyebrow-icon"><CourseIcon name={mod.icon} size={14} /></span>
          Module {mod.number} · {mod.arc}
        </p>
        <h1>{mod.title}</h1>
        <p className="desc">{mod.subtitle} — {mod.description}</p>
      </div>

      <div className="tabs-row">
        <div className="tabs" role="tablist">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`tab-btn${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
        <DownloadCurriculum module={mod} />
      </div>

      {/* Slides */}
      {tab === 'slides' && (
        <div className="tab-panel">
          <SlideDeck slides={mod.slides} />
        </div>
      )}

      {/* Resources */}
      {tab === 'resources' && (
        <div className="tab-panel resource-list">
          {resources.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-item">
              <span className="resource-type">{r.type}</span>
              <span className="resource-body">
                <strong>{r.title}</strong>
                <span>{r.description}</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Books */}
      {tab === 'books' && (
        <div className="tab-panel books-list">
          {books.map((b) => (
            <a key={b.title} href={b.url} target="_blank" rel="noopener noreferrer" className="book-card">
              {b.thumbnailUrl && (
                <img
                  src={b.thumbnailUrl}
                  alt={`${b.title} cover`}
                  className="book-thumb"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <div className="book-info">
                {b.topPick && <span className="book-top-pick">Top pick</span>}
                <h4>{b.title}</h4>
                <p className="book-author">by {b.author}</p>
                {b.note && <p className="book-note">{b.note}</p>}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Practice */}
      {tab === 'practice' && (
        <div className="tab-panel">
          {practice.critique.length > 0 && (
            <section className="section">
              <h2 className="section-title">Critique · Spot the issue</h2>
              <p className="practice-intro">
                No submission — train your eye. Read each prompt against your own product,
                form your critique, then reveal what to look for.
              </p>
              {practice.critique.map((ex, i) => (
                <CritiqueExercise key={i} exercise={ex} index={i} />
              ))}
            </section>
          )}
          {practice.decisions.length > 0 && (
            <section className="section">
              <h2 className="section-title">Judgment · When to call a designer</h2>
              <p className="practice-intro">
                Ship it, fix it yourself, or escalate? Make the call, then check your reasoning.
              </p>
              {practice.decisions.map((d, i) => (
                <DecisionDrill key={i} drill={d} />
              ))}
            </section>
          )}
        </div>
      )}

      {/* Ask the Tutor */}
      {tab === 'tutor' && (
        <div className="tab-panel">
          <AskTutor moduleId={mod.id} moduleTitle={mod.title} suggestions={practice.tutorPrompts} />
        </div>
      )}

      {/* Prev / Next navigation */}
      <nav className="module-nav" aria-label="Module navigation">
        {prev ? (
          <Link to={`/modules/${prev.id}`} className="module-nav-link">
            <span className="module-nav-dir">← Previous</span>
            <span className="module-nav-title">{prev.number}. {prev.title}</span>
          </Link>
        ) : (
          <Link to="/" className="module-nav-link">
            <span className="module-nav-dir">← Back</span>
            <span className="module-nav-title">All modules</span>
          </Link>
        )}
        {next && (
          <Link to={`/modules/${next.id}`} className="module-nav-link module-nav-link--next">
            <span className="module-nav-dir">Next →</span>
            <span className="module-nav-title">{next.number}. {next.title}</span>
          </Link>
        )}
      </nav>
    </>
  );
}
