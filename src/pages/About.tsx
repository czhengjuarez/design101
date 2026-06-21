export default function About() {
  return (
    <div className="prose">
      <span className="badge badge--brand">About</span>
      <h1 style={{ marginTop: 'var(--of-space-4)', fontSize: 'var(--of-text-3xl)' }}>
        Why this exists
      </h1>
      <p style={{ fontSize: 'var(--of-text-lg)', color: 'var(--of-fg-muted)' }}>
        AI made shipping faster than ever, and let more people ship. Business moves on speed;
        design moves on quality. The gap between those two clocks just got bigger.
      </p>

      <h2>Quality can’t be a gate</h2>
      <p>
        If design review is the only place quality gets checked, it becomes a bottleneck — and
        people route around it. The answer isn’t more reviewers. It’s distributing basic quality
        knowledge closer to where decisions are made.
      </p>

      <h2>Taste is a trained rubric</h2>
      <p>
        The most impactful thing isn’t reviewing more work — it’s teaching what “good” actually
        means. What a clear empty state does for a user. What makes a call-to-action land. Why a
        spacing choice feels wrong even when you can’t name it. This course teaches that rubric.
      </p>

      <h2>What you’ll be able to do</h2>
      <ul>
        <li><strong>See</strong> — read and critique design with vocabulary and reasoning.</li>
        <li><strong>Know</strong> — ground decisions in user evidence, and decide when it’s incomplete.</li>
        <li><strong>Why</strong> — identify the real job a product serves and evaluate designs against it.</li>
        <li><strong>Structure</strong> — map product structure and catch object-model conflicts early.</li>
        <li><strong>Scale</strong> — work within a design system correctly, and know when it must evolve.</li>
      </ul>

      <h2>How to use it</h2>
      <p>
        There’s nothing to submit. Each module has slides, curated resources and books, and three
        kinds of practice: <strong>critique exercises</strong> to train your eye,
        <strong> “when to call a designer” drills</strong> to train your judgment, and an
        <strong> AI tutor</strong> you can ask anything, grounded in the curriculum.
      </p>
      <p style={{ color: 'var(--of-fg-subtle)', fontSize: 'var(--of-text-sm)' }}>
        Built on the <a href="https://github.com/czhengjuarez/Keel" target="_blank" rel="noopener noreferrer">Keel</a> design
        system. Resources draw from a <a href="https://design-resources.coscient.workers.dev" target="_blank" rel="noopener noreferrer">living library of design resources</a>.
      </p>
    </div>
  );
}
