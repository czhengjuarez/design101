// ============================================================
// Server-side curriculum knowledge for the AI tutor.
// This is the tutor's grounding corpus — kept in sync with
// src/data/modules.ts but lives here so the Worker never trusts
// the client for what it teaches.
// ============================================================

export const TEACHING_PHILOSOPHY = `
You are the tutor for "Design 101", a course teaching non-designers (engineers, PMs,
cross-functional contributors) the practical craft of product design. Your north star:
quality should be DISTRIBUTED, not gated. Taste is a trained rubric, and you teach it.

Goals for the learner:
- Ship low-impact UI with good taste and sound design principles.
- Build informed judgment — a third option between deferring to designers and overriding on gut.
- Know WHEN to escalate to a designer: ship low-impact themselves, escalate high-impact / net-new.

How to answer:
- Be Socratic when useful: ask a clarifying question, then teach. Push the learner to reason.
- Ground answers in THIS module's material below. Name the principle at stake.
- Be concise and concrete; prefer examples over abstractions.
- If a decision is high-impact, high-visibility, or net-new with no existing pattern,
  explicitly recommend involving a designer.
- Stay within product-design craft. If asked something outside scope, say so briefly.
- Never invent citations. Only the "further reading" provided to you may be cited.
`.trim();

export const CURRICULUM = {
  'design-craft': {
    title: 'Design Craft — How to See',
    body: `
Goal: vocabulary and judgment to read, evaluate, and critique design (not to become a visual designer).
- Visual hierarchy: what the eye sees first/second/third via size, weight, contrast, position. Flat hierarchy = nothing lands.
- Typography: function over font choice. Line length affects reading; weight creates hierarchy; mixing display and body type wrong breaks trust.
- Color: information not decoration. Contrast ratios are an accessibility floor. Semantic color (error red, success green) used consistently. Watch color doing undefined work.
- Spacing & layout: proximity (close = related), whitespace is structure, crowded feels stressful, sparse feels premium. Use spacing tokens.
- Gestalt: similarity, proximity, continuity, closure, figure/ground. Violations feel "off" — naming why is the skill.
- Critique framework: What is it trying to do? Does it do that? What works? What doesn't, and why? Avoid "I like it / I don't."`,
    keywords: ['hierarchy', 'typography', 'type', 'font', 'color', 'contrast', 'spacing', 'layout', 'gestalt', 'whitespace', 'critique', 'visual', 'accessibility'],
  },
  'user-centered': {
    title: 'User-Centered Design — How to Know',
    body: `
Goal: ground decisions in evidence, and decide when evidence is incomplete.
- Mental models: users arrive with assumptions; match them = intuitive, violate them = confusion.
- Three methods: usability testing (watch without helping), cognitive walkthrough ("what would a user think here?"), contextual inquiry (what are they really trying to do?).
- Nielsen's 10 heuristics: visibility of system status, match to real world, user control & freedom, error prevention, recognition over recall, etc. Cover most common UX failures.
- User journeys: map across a whole task — entry, decision points, error states, exits, drop-off.
- Navigating ambiguity (the one soft skill): know when to run more research, when to prototype/test, when to make the call. Ambiguity is a craft problem, not a people problem.`,
    keywords: ['user', 'research', 'usability', 'heuristic', 'nielsen', 'mental model', 'journey', 'testing', 'evidence', 'walkthrough', 'ambiguity', 'flow'],
  },
  'jobs-to-be-done': {
    title: 'Jobs To Be Done — How to Think in Whys',
    body: `
Goal: identify the real job a product serves and evaluate designs against it. JTBD is a design tool, not a sentence template.
- A job is not a task: the job is the progress a person is trying to make in a situation.
- Three dimensions: functional (the outcome), emotional (how they want to feel), social (how they want to be seen). Human products address all three.
- Four forces of progress: push (frustration), pull (attraction), anxiety (fear it won't work), habit (comfort of current). Explains why superior products lose to familiar ones.
- Switch interview: "tell me about the day you decided to look for something different." The switch reveals the job.
- Bridge to OOUX: jobs surface which objects matter, in which context, with which attributes.`,
    keywords: ['job', 'jtbd', 'task', 'functional', 'emotional', 'social', 'four forces', 'push', 'pull', 'anxiety', 'habit', 'switch', 'interview', 'why', 'progress'],
  },
  'ooux': {
    title: 'OOUX — How to Structure',
    body: `
Goal: map product structure and surface object-model conflicts early. Organize design around objects (nouns), not tasks (verbs).
- An object is a discrete thing the user cares about (project, message, order) — not a page, not a feature.
- ORCA process: Objects, Relationships, Calls to action, Attributes.
- Attributes: information describing an object, per context. Drift across the product causes inconsistency.
- Relationships: a project contains tasks; a task belongs to a user. Unmapped relationships cause UI fragmentation.
- CTAs per object surface conflicts (e.g. archive doing three different things in three places).
- Resonates with engineers: object model maps to ERDs, schemas, API structure. Shared model = cleaner handoff.`,
    keywords: ['object', 'ooux', 'orca', 'attribute', 'relationship', 'cta', 'structure', 'schema', 'data model', 'entity', 'information architecture', 'ia', 'noun'],
  },
  'design-systems': {
    title: 'Design Systems — How to Scale',
    body: `
Goal: work within a design system correctly and know when it must evolve. Scale breaks isolated-correct decisions.
- A system is decisions, documented: tokens, components, patterns, principles. Only as useful as its documentation.
- Tokens: "brand-primary" not "#8F1F57"; "spacing-medium" not "16px". Change the token, everything updates. (This site uses the Keel --of-* tokens.)
- Components vs patterns: a component is a button; a pattern ("empty state") solves a recurring UX problem by combining components.
- System drift/breakage: new use cases that don't fit, inconsistent application, one-off token overrides that become permanent.
- Ambiguity at scale: no pattern? Find the nearest analog, define the object/attributes first, pressure-test against principles, validate with a designer before shipping. Craft judgment, not creative license.`,
    keywords: ['system', 'token', 'component', 'pattern', 'variant', 'atomic', 'scale', 'drift', 'tokens', 'keel', 'polaris', 'library', 'principle'],
  },
};

export function curriculumFor(moduleId) {
  return CURRICULUM[moduleId] || null;
}

// Lightweight keyword score so the tutor can also reference adjacent modules.
export function rankModules(question) {
  const q = (question || '').toLowerCase();
  return Object.entries(CURRICULUM)
    .map(([id, m]) => ({ id, title: m.title, score: m.keywords.reduce((s, k) => (q.includes(k) ? s + 1 : s), 0) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
