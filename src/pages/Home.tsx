import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import CourseIcon from '../components/CourseIcon';

export default function Home() {
  return (
    <div>
      <header className="hero">
        <span className="badge badge--brand">Design training for non-designers</span>
        <h1>
          Ship UI with good taste.<br />
          Know when to call a designer.
        </h1>
        <p className="lede">
          A practical course in product design craft for engineers, PMs, and anyone who ships UI.
          Not to make you a designer — to give you the vocabulary and judgment to make better
          design decisions, and the instinct to know when a decision needs a designer.
        </p>
        <blockquote className="hero-quote">
          <p>Quality scales when knowledge scales. If design is the only place quality lives, quality becomes a bottleneck. Build bridges instead.</p>
          <cite>The teaching philosophy behind this course</cite>
        </blockquote>
      </header>

      <p className="section-label">Five modules · Arc</p>
      <div className="arc-strip">
        {['See', 'Know', 'Why', 'Structure', 'Scale'].map((step, i, arr) => (
          <span key={step}>
            <span className="arc-step">{step}</span>
            {i < arr.length - 1 && <span className="arc-arrow">→</span>}
          </span>
        ))}
      </div>

      <div className="module-grid">
        {modules.map((m) => (
          <Link key={m.id} to={`/modules/${m.id}`} className="module-card">
            <div className="module-card-top">
              <span className="module-icon"><CourseIcon name={m.icon} size={20} /></span>
              <span className="badge badge--arc">{m.arc}</span>
            </div>
            <h3>{m.number}. {m.title}</h3>
            <p className="subtitle">{m.subtitle}</p>
            <p className="desc">{m.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
