// ============================================================
// Design 101 — curriculum content (no CMS; typed source of truth)
// Mirrors the LBD modules.ts pattern. Arc: See → Know → Why → Structure → Scale
// ============================================================

export interface Slide {
  title: string;
  titleSlide?: boolean;
  body?: string;
  bullets?: string[];
  quote?: { text: string; author: string };
  highlight?: string;
  image?: string;
  link?: { label: string; url: string };
  split?: {
    left: { label: string; points: string[] };
    right: { label: string; points: string[] };
    footer?: string;
  };
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'podcast' | 'book' | 'tool' | 'framework' | 'course';
  description: string;
}

export interface BookSuggestion {
  title: string;
  author: string;
  url: string;
  thumbnailUrl?: string;
  note?: string;
  topPick?: boolean;
}

/** "Spot the issue" — learner critiques a UI, then reveals annotated issues. */
export interface CritiqueExercise {
  /** Optional screenshot path under /public/images. Falls back to a prompt placeholder. */
  image?: string;
  prompt: string;
  issues: { label: string; note: string }[];
}

/** "When to call a designer" — pick the right call, reveal rationale. */
export interface DecisionDrill {
  scenario: string;
  answer: 'ship' | 'fix-yourself' | 'escalate';
  rationale: string;
}

export interface ModulePractice {
  critique: CritiqueExercise[];
  decisions: DecisionDrill[];
  /** Seed prompts shown in the Ask-the-Tutor panel for this module. */
  tutorPrompts: string[];
}

export type ModuleIcon = 'eye' | 'search' | 'target' | 'boxes' | 'layers';

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  arc: string;
  description: string;
  icon: ModuleIcon;
  color: string;
  slides: Slide[];
  resources: Resource[];
  books: BookSuggestion[];
  practice: ModulePractice;
}

// ------------------------------------------------------------

export const modules: Module[] = [
  // ========================================================
  // MODULE 1 — DESIGN CRAFT: HOW TO SEE
  // ========================================================
  {
    id: 'design-craft',
    number: 1,
    title: 'Design Craft',
    subtitle: 'How to See',
    arc: 'See',
    description:
      'Build the vocabulary and judgment to read, evaluate, and critique design. Not to make you a visual designer — to give you a third option between deferring entirely to designers and overriding them on gut feeling: informed judgment.',
    icon: 'eye',
    color: 'var(--of-magenta-400)',
    slides: [
      { title: 'Design Craft', body: 'How to See', titleSlide: true },
      {
        title: 'The third option',
        body: 'Most non-designers either defer entirely to designers or override them on gut feeling. This module builds a third option: informed judgment. The goal is not to make you a visual designer — it is to let you read, evaluate, and critique design with reasons.',
      },

      // ── Visual Hierarchy ──────────────────────────────
      {
        title: 'Visual Hierarchy',
        bullets: [
          'Hierarchy is what the eye sees first, second, and third.',
          'Size, weight, contrast, and position create reading order.',
          'A flat hierarchy makes everything feel equally unimportant — so nothing lands.',
        ],
      },
      {
        title: 'The scanning order',
        body: 'Eyes do not read — they scan. Before a user reads a word, they have already decided where to look first. That sequence is not random.',
        bullets: [
          'The eye is drawn first to the largest element on the page.',
          'Then to the highest contrast: dark on light, or color on neutral.',
          'Then top-to-left, tracing a rough F-shape down the content.',
        ],
        highlight: 'Hierarchy is not decoration. It is a set of instructions to the eye.',
      },
      {
        title: 'The four levers',
        split: {
          left: {
            label: 'The lever',
            points: ['Size', 'Weight', 'Contrast', 'Position'],
          },
          right: {
            label: 'What it signals',
            points: [
              'Larger = more important. The H1 dominates because it must.',
              'Bold = emphasis. A 700-weight label reads as a heading even at body size.',
              'Dark on light = foreground. Muted gray recedes; black advances.',
              'Top-left = first. Center = special. Bottom = secondary.',
            ],
          },
          footer: 'Use all four together and you control exactly what the eye does.',
        },
      },
      {
        title: 'Flat is forgettable',
        split: {
          left: {
            label: 'Flat hierarchy',
            points: [
              'Page title: 16px, regular',
              'Section header: 16px, regular',
              'Body copy: 16px, regular',
              'CTA button: 16px, regular',
              'Everything competes. Nothing wins.',
            ],
          },
          right: {
            label: 'Clear hierarchy',
            points: [
              'Page title: 32px, bold — lands first',
              'Section header: 18px, semibold — organizes',
              'Body copy: 15px, regular — reads comfortably',
              'CTA button: 15px, bold + brand color — one clear action',
              'The eye knows exactly where to go.',
            ],
          },
          footer: 'When everything shouts, nothing is heard.',
        },
      },

      // ── Typography ────────────────────────────────────
      {
        title: 'Typography',
        body: 'Not font selection — typographic function.',
        bullets: [
          'Line length affects reading: too long and the eye loses its place.',
          'Type weight creates hierarchy without adding elements.',
          'Display type vs. body type — mixing them wrong breaks trust before a word is read.',
        ],
      },
      {
        title: 'Line length and reading ease',
        split: {
          left: {
            label: 'Too wide (80+ words per line)',
            points: [
              'The eye travels far to reach the end of each line.',
              'Returning to the start of the next line, it loses its place.',
              'Reading slows. Comprehension drops.',
              'The content feels like work.',
            ],
          },
          right: {
            label: 'Optimal (50–75 characters)',
            points: [
              'The eye moves a short, comfortable arc.',
              'Return sweep is easy — no searching for the next line.',
              'Reading flows without conscious effort.',
              'Rule of thumb: max-width: 65ch on body text.',
            ],
          },
          footer: 'max-width: 65ch is one of the highest-leverage CSS properties you can set.',
        },
      },
      {
        title: 'Weight creates hierarchy without adding elements',
        split: {
          left: {
            label: 'One weight throughout',
            points: [
              'Product name — 400 regular',
              'Version 2.4.1 — 400 regular',
              'Last updated: yesterday — 400 regular',
              'Status: active — 400 regular',
              'Everything looks like a label.',
            ],
          },
          right: {
            label: 'Strategic weight variation',
            points: [
              'Product name — 700 bold (dominant)',
              'Version 2.4.1 — 400 regular (secondary)',
              'Last updated — 400, muted color (tertiary)',
              'Status: ACTIVE — 600 semibold, semantic color',
              'Hierarchy is clear. No size change required.',
            ],
          },
          footer: 'A well-chosen weight scale costs nothing and replaces a messy font-size scale.',
        },
      },
      {
        title: 'The trust problem',
        body: 'Before a user reads a word, typography has already made a claim about the product.',
        split: {
          left: {
            label: 'Mixing wrong',
            points: [
              'Hero headline: decorative script font',
              'Body copy: same decorative script',
              'Buttons: unrelated third sans-serif',
              'The product feels unfinished — regardless of content quality.',
            ],
          },
          right: {
            label: 'Mixing right',
            points: [
              'Hero headline: display font (Space Grotesk)',
              'Body copy: body font (Inter) — designed for sustained reading',
              'UI elements: same body font, consistent weights',
              'Trust is established before a word is read.',
            ],
          },
          footer: 'Display type is for impact. Body type is for reading. They are different tools.',
        },
      },

      // ── Color ─────────────────────────────────────────
      {
        title: 'Color',
        body: 'Color is information, not decoration.',
        bullets: [
          'Contrast ratios are an accessibility floor, not a preference.',
          'Semantic color: error red, success green, neutral gray — used consistently.',
          'Watch for color doing too much work — carrying meaning it never defined.',
        ],
      },
      {
        title: 'Contrast is a floor, not a preference',
        split: {
          left: {
            label: 'Fails WCAG AA',
            points: [
              'Light gray text on white: ~1.5:1',
              'Gray placeholder text on light input: ~2.8:1',
              'Muted brand color on tinted background: ~2.1:1',
              'Common in "clean" designs that prioritize aesthetics over legibility.',
            ],
          },
          right: {
            label: 'Passes WCAG AA',
            points: [
              'Body text on white: 7:1 or higher',
              'Large text minimum: 3:1',
              'UI components and focus states: 3:1',
              'Use WebAIM Contrast Checker before shipping any text style.',
            ],
          },
          footer: 'If it fails contrast, it fails — regardless of how intentionally subtle the design.',
        },
      },
      {
        title: 'Semantic color',
        body: 'Semantic color means each color has a defined meaning, applied consistently everywhere.',
        bullets: [
          'Red = error or destructive action. Never use red for a CTA or promotional highlight.',
          'Green = success or confirmation. Never use green for warnings.',
          'Yellow / orange = caution. Proceed carefully.',
          'Blue = informational or in-progress. Neutral intent.',
          'Gray = disabled, inactive, or secondary. No urgency.',
        ],
        highlight: 'The moment red appears for something that is not an error, the semantic contract breaks — and users start second-guessing every red they see.',
      },
      {
        title: 'When color does too much',
        split: {
          left: {
            label: 'Color overloaded',
            points: [
              'Section backgrounds: teal, coral, violet, gold',
              'Tags: 8 colors, no documented meaning',
              'Links: purple in some sections, blue in others',
              'Alerts: orange (too close to warning)',
              'Users cannot build a model of what color means.',
            ],
          },
          right: {
            label: 'Color intentional',
            points: [
              'Brand color: primary actions and brand moments only',
              'Semantic: error, warning, success, info — defined once, used consistently',
              'Neutral grays: structure, borders, secondary text',
              'Every color use is answerable: "it means X."',
            ],
          },
        },
      },

      // ── Spacing & Layout ─────────────────────────────
      {
        title: 'Spacing & Layout',
        bullets: [
          'Proximity: things that are close feel related.',
          'Whitespace is structure, not emptiness.',
          'Crowded layouts feel stressful; sparse, intentional layouts feel premium.',
        ],
      },
      {
        title: 'Proximity groups without words',
        split: {
          left: {
            label: 'No proximity signal',
            points: [
              'Label ........... [Input]',
              '(equal gap)',
              'Label ........... [Input]',
              '(equal gap)',
              'Label ........... [Input]',
              'Evenly spaced — organized-looking, but each label feels disconnected from its field.',
            ],
          },
          right: {
            label: 'Proximity working',
            points: [
              'Label',
              '[Input field]   ← 4px gap',
              '',
              '— 24px gap between groups —',
              '',
              'Label',
              '[Input field]   ← 4px gap',
              'The label hugs its field. Groups breathe between them.',
            ],
          },
          footer: 'The space between groups must always be larger than the space within a group.',
        },
      },
      {
        title: 'Whitespace is active, not passive',
        split: {
          left: {
            label: 'Whitespace removed',
            points: [
              'Elements packed to the edges',
              'Cards: 8px padding',
              'Sections bleed into each other',
              'No room to breathe',
              'The layout feels anxious and low-value.',
            ],
          },
          right: {
            label: 'Whitespace intentional',
            points: [
              'Consistent card padding: 24px minimum',
              'Sections separated by 48–64px',
              'Body text at 1.55 line height',
              'Actions have space to stand alone',
              'The layout feels considered and trustworthy.',
            ],
          },
          footer: 'Premium products are not more spacious because they have less content. They are spacious because they treat whitespace as a structural decision.',
        },
      },
      {
        title: 'The spacing scale',
        body: 'Arbitrary spacing values accumulate into inconsistency. A spacing scale gives every decision a right answer.',
        bullets: [
          '4px — micro: icon-to-label, tight inline pairs',
          '8px — within a component: padding inside a chip, gap between stacked buttons',
          '16px — standard component internal padding',
          '24px — between related groups on a page',
          '48–64px — between major page sections',
        ],
        highlight: 'Pick a step from the scale, not an arbitrary value. If nothing fits, the layout is the problem.',
      },

      // ── Gestalt ───────────────────────────────────────
      {
        title: 'Gestalt Principles',
        body: 'How the brain completes patterns: similarity, proximity, continuity, closure, figure/ground.',
        highlight: "A UI that violates these feels 'off' even when you can't name why. Naming why is the skill.",
      },
      {
        title: 'Similarity',
        body: 'Things that look the same are perceived as belonging together. Color, shape, size, and weight all signal group membership.',
        split: {
          left: {
            label: 'Similarity working',
            points: [
              'All primary actions share the same button style',
              'All navigation links: same weight, same size, same color',
              'All status indicators: same icon family',
              'The user builds a mental map: this style means this.',
            ],
          },
          right: {
            label: 'Similarity broken',
            points: [
              'Primary actions: sometimes button, sometimes link, sometimes plain text',
              'Navigation: varies in weight and color across sections',
              'Status icons: mix of filled, outline, and emoji',
              'The user cannot build a reliable model.',
            ],
          },
        },
      },
      {
        title: 'Closure and continuity',
        body: 'The brain automatically completes incomplete shapes and follows implied paths. In UI, this means you can imply structure without drawing every line.',
        bullets: [
          'A row of items implies continuation — users expect to scroll for more.',
          'A clipped card edge implies scrollability — the cut-off content invites the scroll.',
          'Aligned elements imply a grid — the structure is felt, not stated.',
          'Broken alignment breaks the implied structure — and feels like a bug, not a style choice.',
        ],
        highlight: 'Designers use closure to imply depth and more-content. Violations feel like errors.',
      },
      {
        title: 'Figure and ground',
        body: 'Every element is either figure (what you focus on) or ground (what it sits on). The eye cannot process both simultaneously.',
        split: {
          left: {
            label: 'Figure/ground working',
            points: [
              'Modal on dimmed overlay — modal is figure, page is ground',
              'Dark text on light background — text is figure',
              'Hover highlight on a row — row becomes figure',
              'User always knows what is active and what is context.',
            ],
          },
          right: {
            label: 'Figure/ground broken',
            points: [
              'Two elements compete at the same contrast level',
              'Dropdown opens but background does not recede',
              'Tooltip and content both demand attention simultaneously',
              'User confusion: which layer am I on?',
            ],
          },
        },
      },

      // ── Design Critique ───────────────────────────────
      {
        title: 'Design Critique',
        body: 'How to talk about design without saying "I like it" or "I don\'t like it." The framework: What is it trying to do? Does it do that? What works? What doesn\'t — and why?',
      },
      {
        title: 'The four critique questions',
        bullets: [
          '1. What is this trying to do? — Establish the intent before evaluating the execution.',
          '2. Does it do that? — Judge the design against its own goal, not your preference.',
          '3. What works? — Name specific elements that succeed and state why.',
          '4. What does not work, and why? — Tie every critique to a named principle.',
        ],
        highlight: 'Critique that cannot answer "why" is preference. Critique that names the principle is useful.',
      },
      {
        title: 'Language that lands',
        split: {
          left: {
            label: 'Preference (not actionable)',
            points: [
              '"It feels off"',
              '"I don\'t like the colors"',
              '"Make it more modern"',
              '"It looks cluttered"',
              '"Can we make it pop?"',
            ],
          },
          right: {
            label: 'Critique (actionable)',
            points: [
              '"Hierarchy is flat — the CTA competes with three supporting actions"',
              '"This red reads as an error state, but this is a normal confirmation"',
              '"Reduce to one typeface family with two weights — three families is too many"',
              '"Group the related fields — proximity is missing between label and input"',
              '"Increase CTA contrast — it does not win the eye yet"',
            ],
          },
          footer: 'Same instinct, completely different outcome in the room.',
        },
      },
      {
        title: 'Critique applied: before you hand off',
        body: 'Run the four questions on the next screen you ship, before it leaves your hands.',
        bullets: [
          'What is this screen trying to do? Write it in one sentence.',
          'What action do I want the user to take? Does the visual hierarchy support it?',
          'Is there a color, spacing, or type choice that violates a principle?',
          'If a designer looked at this, what would they flag first?',
        ],
        highlight: 'The goal is not to design the screen yourself. It is to catch the issues that erode trust before they ship.',
      },

      // ── Closing ───────────────────────────────────────
      {
        title: 'Defer vs. Inform',
        split: {
          left: {
            label: 'Gut reaction',
            points: ['"It looks off"', '"I don\'t like the color"', '"Make it pop"', 'Overrides or defers blindly'],
          },
          right: {
            label: 'Informed critique',
            points: [
              '"Hierarchy is flat — the primary action competes with three others"',
              '"This red reads as an error, but it\'s a normal state"',
              '"Increase contrast on the CTA so it wins the eye"',
              'Names the principle at stake',
            ],
          },
          footer: 'Same instinct — but one is actionable and the other is noise.',
        },
      },
    ],
    resources: [
      { title: 'Gestalt Principles in UX', url: 'https://www.nngroup.com/articles/gestalt-principles-visual-perception/', type: 'article', description: 'NN/g on how perception groups elements.' },
      { title: 'Visual Hierarchy in UI Design', url: 'https://www.nngroup.com/articles/visual-hierarchy-ux-definition/', type: 'article', description: 'What the eye sees first, and why.' },
      { title: "Butterick's Practical Typography", url: 'https://practicaltypography.com/', type: 'tool', description: 'The fastest way to stop making common type mistakes.' },
      { title: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/', type: 'tool', description: 'Check color contrast against WCAG.' },
    ],
    books: [
      { title: "The Non-Designer's Design Book", author: 'Robin Williams', url: 'https://www.google.com/search?q=The+Non-Designer%27s+Design+Book', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780133966152-L.jpg', note: 'C.R.A.P: Contrast, Repetition, Alignment, Proximity. The canonical starting point.', topPick: true },
      { title: 'Refactoring UI', author: 'Adam Wathan & Steve Schoger', url: 'https://www.refactoringui.com/', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780578318820-L.jpg', note: 'Practical, tactical visual design for non-designers who ship.' },
      { title: 'Thinking with Type', author: 'Ellen Lupton', url: 'https://www.google.com/search?q=Thinking+with+Type+Ellen+Lupton', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9781568989693-L.jpg', note: 'Typography fundamentals, readable and applied.' },
    ],
    practice: {
      critique: [
        {
          prompt:
            'Look at a sign-up form you ship. Where does your eye land first? Is it the thing you want the user to do? Identify the reading order, then check it against intent.',
          issues: [
            { label: 'Flat hierarchy', note: 'Primary and secondary actions share the same weight — the user has to think about which to click.' },
            { label: 'Contrast misuse', note: 'A destructive or low-priority action is the most visually prominent element.' },
            { label: 'Proximity', note: 'Labels sit closer to the wrong input than the one they describe.' },
          ],
        },
        {
          prompt:
            'Find an empty state in your product. Does it explain what goes here and how to start — or is it just a blank panel with a spinner that resolved to nothing?',
          issues: [
            { label: 'No orientation', note: 'Empty state shows nothing about what this object is or why it matters.' },
            { label: 'No next action', note: 'There is no obvious, single call-to-action to populate it.' },
            { label: 'Tone', note: 'Reads as an error ("No data") rather than an invitation ("Add your first project").' },
          ],
        },
      ],
      decisions: [
        {
          scenario:
            'You need to change the label on a button from "Submit" to "Save changes" to match the rest of the app. No layout or color change.',
          answer: 'ship',
          rationale:
            'Copy alignment to an existing pattern is low-impact and consistency-improving. Ship it — escalating would just create a bottleneck.',
        },
        {
          scenario:
            'A page feels cramped. You want to add spacing, but the app uses spacing tokens and you are unsure which step to use between two elements.',
          answer: 'fix-yourself',
          rationale:
            'Use the nearest existing token and match the spacing of an analogous, well-reviewed area. This is exactly the judgment this course builds — no need to escalate a token choice.',
        },
        {
          scenario:
            'Marketing wants a brand-new full-page interactive hero with custom illustration and motion, central to the homepage relaunch.',
          answer: 'escalate',
          rationale:
            "High-impact, high-visibility, net-new visual language with no existing pattern. This is where a designer's judgment, context, and systems thinking pay off. Bring them in early.",
        },
      ],
      tutorPrompts: [
        'What is visual hierarchy, and how do I tell if mine is flat?',
        'Explain the difference between display type and body type with an example.',
        'How do I critique a screen without just saying "I like it"?',
      ],
    },
  },

  // ========================================================
  // MODULE 2 — USER-CENTERED DESIGN: HOW TO KNOW
  // ========================================================
  {
    id: 'user-centered',
    number: 2,
    title: 'User-Centered Design',
    subtitle: 'How to Know',
    arc: 'Know',
    description:
      'The most common mistake in product design is designing for what users say they want, or what the team assumes they need, rather than what the evidence shows. This module is about knowing the difference — and making calls when evidence is incomplete.',
    icon: 'search',
    color: 'var(--of-magenta-400)',
    slides: [
      { title: 'User-Centered Design', body: 'How to Know', titleSlide: true },

      // ── Mental Models ─────────────────────────────────
      {
        title: 'Mental Models',
        body: 'Users arrive with existing assumptions about how things should work. Match those models and the product feels intuitive. Violate them and users feel confused — even when the product is technically correct.',
      },
      {
        title: 'What a mental model is',
        split: {
          left: {
            label: 'Product matches the model',
            points: [
              'Shopping cart icon → stores items for later',
              'Trash icon → deletes permanently',
              'Back button → goes to the previous screen',
              'User feels in control. The system behaves as expected.',
            ],
          },
          right: {
            label: 'Product violates the model',
            points: [
              'Trash icon → archives (not deletes)',
              'Back button → closes without saving',
              'Save button that also navigates away',
              'User is confused — "Did that work? What just happened?"',
            ],
          },
          footer: 'Users do not blame the product. They blame themselves. That is a design failure.',
        },
      },
      {
        title: 'When models clash',
        body: 'Users do not read documentation before using a product. They pattern-match from everything they have used before.',
        bullets: [
          'When the product diverges from their pattern, users feel confused — not incompetent.',
          'They ask for help, file support tickets, or leave.',
          'The confusion compounds: every unexpected behavior makes the next one worse.',
        ],
        highlight: 'The question is not "is this technically correct?" It is "does this match what the user expects to happen?"',
      },
      {
        title: "How to surface your user's model",
        bullets: [
          'Watch someone use the product without helping them — what do they try first?',
          'Ask "what did you expect to happen?" after every unexpected action.',
          'Read support tickets that start with "I thought..." — each one is a model mismatch.',
          'Card sort: ask users to group your content. The groupings reveal their model.',
        ],
        highlight: 'The best time to find a mental model mismatch is in testing. The worst time is in production.',
      },

      // ── Three Methods ─────────────────────────────────
      {
        title: 'Three research methods worth knowing',
        bullets: [
          'Usability testing — watch someone use your product without helping them.',
          'Cognitive walkthrough — step through a flow asking "what would a user think here?"',
          'Contextual inquiry — understand what they are actually trying to accomplish, not just what they clicked.',
        ],
      },
      {
        title: 'Usability testing in 20 minutes',
        body: 'You do not need a lab or a researcher. You need a task, a user, and silence.',
        bullets: [
          '1. Write one task: "You need to add a team member. Please do that."',
          '2. Find one user: a colleague unfamiliar with the feature works.',
          '3. Watch without helping. Do not explain. Do not say "that\'s right."',
          '4. Note every moment of hesitation, wrong click, or spoken confusion.',
        ],
        highlight: 'Two users in 40 minutes will surface more issues than a week of internal review.',
      },
      {
        title: 'Cognitive walkthrough',
        body: 'Walk through a flow step by step. At each action, ask four questions:',
        bullets: [
          '1. Will users know they need to take this action?',
          '2. Will they be able to find the control for it?',
          '3. Will they understand that the control does what they need?',
          '4. After they act, will they know it worked?',
        ],
        highlight: 'Cognitive walkthrough requires no users — just honesty. It catches the gap between what you intended and what is actually visible.',
      },
      {
        title: 'Contextual inquiry: the why behind the click',
        split: {
          left: {
            label: 'What users click',
            points: [
              'Opens the export button',
              'Exports to CSV',
              'Opens Excel separately',
              'Pastes the data in',
              'Adds a formula manually',
            ],
          },
          right: {
            label: 'What they are actually trying to do',
            points: [
              'Send a polished summary to their manager every Friday.',
              'The real job: produce a weekly report.',
              'CSV → Excel → formula is a workaround, not a workflow.',
              'The right product solves the report — not the export.',
            ],
          },
          footer: 'Observation reveals the job. The click is just the surface.',
        },
      },

      // ── Nielsen's Heuristics ──────────────────────────
      {
        title: "Nielsen's 10 Usability Heuristics",
        body: 'The most durable framework in UX. Visibility of system status. Match between system and real world. User control and freedom. Error prevention. Recognition over recall.',
        highlight: 'Non-designers who know these 10 can self-evaluate most of their own work.',
      },
      {
        title: 'Heuristic 1: Visibility of system status',
        body: 'The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.',
        split: {
          left: {
            label: 'Violation',
            points: [
              'Button clicked — nothing visibly changes',
              'Form submitted — no confirmation message',
              'Long operation — no progress indicator',
              'User re-clicks. User wonders. User leaves.',
            ],
          },
          right: {
            label: 'Applied',
            points: [
              'Button shows a loading spinner immediately on click',
              'Form shows "Saved" for 2 seconds after submit',
              'Long operation shows a progress bar with time estimate',
              'User is informed at every step.',
            ],
          },
          footer: 'If a user ever wonders "did that work?" — visibility of status is broken.',
        },
      },
      {
        title: 'Heuristic 5: Error prevention',
        split: {
          left: {
            label: 'Error recovery (reactive)',
            points: [
              'User deletes 47 items accidentally',
              'System shows: "Items deleted. Undo?"',
              'User has 5 seconds to recover',
              'Recovery works, but the anxiety was unnecessary.',
            ],
          },
          right: {
            label: 'Error prevention (proactive)',
            points: [
              'Destructive action requires confirmation',
              '"Delete 47 items? This cannot be undone." + type to confirm',
              'User is forced to slow down before an irreversible action',
              'The error never happens.',
            ],
          },
          footer: 'Prevent first. Recover gracefully second. Never let it fail silently.',
        },
      },
      {
        title: 'Heuristic 6: Recognition over recall',
        split: {
          left: {
            label: 'Forces recall',
            points: [
              'Command-line: must remember exact syntax',
              'Search field with no suggestions or saved filters',
              'Form fields with placeholder text only (no persistent label)',
              'Dashboard with no inline help or hints',
            ],
          },
          right: {
            label: 'Supports recognition',
            points: [
              'Visual UI: select from visible, labeled options',
              'Search shows recent queries and suggested filters',
              'Form fields with persistent labels above each input',
              'Contextual tooltips and inline documentation',
            ],
          },
          footer: 'Every time a user has to remember something, they may not. Show it instead.',
        },
      },

      // ── User Journeys ─────────────────────────────────
      {
        title: 'User Journeys & Flow Mapping',
        bullets: [
          'Map the experience across a task, not a single screen.',
          'Entry points, decision points, error states, exits.',
          'Where do users drop off — and what question does that raise?',
        ],
      },
      {
        title: 'The anatomy of a journey',
        bullets: [
          'Entry point — where the user enters the flow (email link? nav? notification? direct URL?)',
          'Intent — what the user is trying to accomplish at this moment',
          'Decision points — where the user must choose or take action',
          'Error states — what happens when something goes wrong',
          'Exit — what does success look like? Failure? Abandon?',
        ],
        highlight: 'Most teams map the happy path. The value is in mapping error states and exits — that is where users actually struggle.',
      },
      {
        title: 'Where users drop off',
        split: {
          left: {
            label: 'Analytics: 42% drop-off at step 3',
            points: [
              '60% of users reach step 3',
              '18% continue to step 4',
              '42% abandon at step 3',
              'Data says where. It does not say why.',
            ],
          },
          right: {
            label: 'Journey map reveals',
            points: [
              'Step 3 requires account creation',
              'Users did not expect to need an account at this stage',
              'Mental model: "I thought I could check out as a guest"',
              'Fix: offer guest checkout at step 3.',
            ],
          },
          footer: 'Numbers tell you what to investigate. Journeys tell you what to fix.',
        },
      },
      {
        title: 'Users do not start where you think',
        body: 'Product teams design from a known entry point: homepage, nav, dashboard. Users enter from everywhere else.',
        bullets: [
          'A user arriving from a shared link has zero context from prior steps.',
          'A user returning after 3 weeks may not remember where they left off.',
          'A user who bookmarked a deep page skips your intended onboarding entirely.',
        ],
        highlight: 'Every screen is someone\'s first screen. Design accordingly.',
      },

      // ── Ambiguity ─────────────────────────────────────
      {
        title: 'Navigating Ambiguity',
        body: 'The one soft skill. Users say one thing and do another. Data conflicts. Stakeholders have opinions. Know when to run more research, when to prototype and test, and when to just make the call.',
        quote: { text: 'In product design, ambiguity is a craft problem, not a people problem.', author: 'Design 101' },
      },
      {
        title: 'Three types of uncertainty',
        split: {
          left: {
            label: 'Type of uncertainty',
            points: [
              'User behavior unclear',
              'Design direction unclear',
              'Business constraint unclear',
            ],
          },
          right: {
            label: 'Right response',
            points: [
              'Run research: usability test, contextual inquiry, analytics review',
              'Prototype: build the cheapest thing that tests the hypothesis',
              'Escalate: this is not a design decision alone',
            ],
          },
          footer: 'Ambiguity is not an excuse to delay. It is a diagnosis that tells you what to do next.',
        },
      },
      {
        title: 'When to make the call',
        body: 'Research is valuable. It is also a way to avoid making decisions.',
        bullets: [
          'You have seen the same behavior in 3+ users — that is a pattern.',
          'The decision is low-risk and reversible — bias toward shipping.',
          'Additional research will take longer than reversing the decision if it is wrong.',
          'You are the closest person to the context — your informed judgment is valid.',
        ],
        highlight: 'Designing with incomplete information is the job. The skill is knowing when incomplete is enough.',
      },
    ],
    resources: [
      { title: '10 Usability Heuristics for UI Design', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', type: 'framework', description: "Nielsen's heuristics — the reference everyone cites." },
      { title: 'Usability Testing 101', url: 'https://www.nngroup.com/articles/usability-testing-101/', type: 'article', description: 'How to run a basic test without a research team.' },
      { title: 'Journey Mapping 101', url: 'https://www.nngroup.com/articles/journey-mapping-101/', type: 'article', description: 'Mapping experience across a whole task.' },
    ],
    books: [
      { title: "Don't Make Me Think", author: 'Steve Krug', url: 'https://www.google.com/search?q=Don%27t+Make+Me+Think+Steve+Krug', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780321965516-L.jpg', note: 'The most approachable usability book ever written.', topPick: true },
      { title: 'The Design of Everyday Things', author: 'Don Norman', url: 'https://www.google.com/search?q=The+Design+of+Everyday+Things', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg', note: 'Where "mental models" and "affordances" come from.' },
      { title: 'Rocket Surgery Made Easy', author: 'Steve Krug', url: 'https://www.google.com/search?q=Rocket+Surgery+Made+Easy', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780321657299-L.jpg', note: 'DIY usability testing for small teams.' },
    ],
    practice: {
      critique: [
        {
          prompt:
            "Pick one flow you own and run it against Nielsen's heuristic \"visibility of system status.\" After every action, can the user tell what just happened and what is happening now?",
          issues: [
            { label: 'Silent actions', note: 'A save or submit gives no confirmation — the user re-clicks or wonders if it worked.' },
            { label: 'Hidden progress', note: 'Long operations show no progress or expectation of duration.' },
            { label: 'Stale state', note: 'The UI does not reflect the change until a manual refresh.' },
          ],
        },
      ],
      decisions: [
        {
          scenario:
            "A button's tooltip wording is unclear. You can rewrite it to match the action it triggers, based on watching two teammates get confused.",
          answer: 'fix-yourself',
          rationale:
            'You have lightweight evidence (two confused users) and the fix is low-impact copy. Make the call and note the observation.',
        },
        {
          scenario:
            'Analytics show 40% drop-off on step 3 of onboarding and nobody knows why. Leadership wants a redesign next sprint.',
          answer: 'escalate',
          rationale:
            'High-impact, unknown root cause. This needs research before design — exactly where a designer/researcher should lead, not where you guess at a redesign.',
        },
      ],
      tutorPrompts: [
        'How do I run a quick usability test with no budget?',
        "Walk me through applying Nielsen's heuristics to a checkout flow.",
        'What is a mental model and how do I avoid violating one?',
      ],
    },
  },

  // ========================================================
  // MODULE 3 — JOBS TO BE DONE: HOW TO THINK IN WHYS
  // ========================================================
  {
    id: 'jobs-to-be-done',
    number: 3,
    title: 'Jobs To Be Done',
    subtitle: 'How to Think in Whys',
    arc: 'Why',
    description:
      'User research tells you what users do. JTBD tells you why. It is one of the most misunderstood frameworks in product — often reduced to a sentence template without the thinking behind it. Here it is a design tool, not a strategy exercise.',
    icon: 'target',
    color: 'var(--of-magenta-400)',
    slides: [
      { title: 'Jobs To Be Done', body: 'How to Think in Whys', titleSlide: true },

      // ── Job vs Task ───────────────────────────────────
      {
        title: 'A job is not a task',
        body: '"I need to send a message" is a task. "I need to feel confident my team has what they need before I log off" is a job. The job is the progress a person is trying to make in a situation.',
      },
      {
        title: 'The milkshake example',
        body: "McDonald's hired a researcher to understand why people bought milkshakes in the morning.",
        split: {
          left: {
            label: "What McDonald's assumed",
            points: [
              'Customers want a tasty, sweet drink',
              'Compete with other milkshakes and desserts',
              'Target: sweet-cravers',
            ],
          },
          right: {
            label: 'The actual job',
            points: [
              'Long commute. Needs one hand free.',
              'Needs something to do for 30 minutes in the car.',
              'Needs to arrive at work without being hungry.',
              'Milkshake was thick (lasted long), consumed one-handed, and was boring in an acceptable way.',
            ],
          },
          footer: 'The competitor was not Dairy Queen. It was a banana — which failed the job (eaten too fast, too messy).',
        },
      },
      {
        title: 'Writing a job statement',
        body: 'A job statement captures the situation, motivation, and desired outcome — not the feature request.',
        bullets: [
          'Format: When [situation], I want to [motivation], so I can [outcome].',
          'Task: "When I finish a document, I want to export it to PDF."',
          'Job: "When I share work with a client, I want to send something polished that cannot be edited, so I look professional."',
          'The job reveals: maybe PDF is not the right answer. Maybe it is a branded, read-only share link.',
        ],
        highlight: 'The job statement decides which features are worth building. The task statement just describes how users currently cope.',
      },
      {
        title: 'The job behind the request',
        split: {
          left: {
            label: 'Feature request (proposed solution)',
            points: [
              '"We need a comments field on every record"',
              '"Can we add a status column to this table?"',
              '"Users want email notifications for everything"',
            ],
          },
          right: {
            label: 'Job behind it',
            points: [
              'Job: "I need to leave context for my teammate without a separate message"',
              'Job: "I need to know at a glance what needs my attention today"',
              'Job: "I need to trust nothing falls through the cracks when I\'m not looking"',
            ],
          },
          footer: 'Solve the job and you might find a better answer than the one they asked for.',
        },
      },

      // ── Three Dimensions ──────────────────────────────
      {
        title: 'Three dimensions of every job',
        split: {
          left: { label: 'Most products design for…', points: ['Functional — the practical outcome'] },
          right: { label: 'Human products also address…', points: ['Emotional — how they want to feel', 'Social — how they want to be perceived'] },
          footer: 'Address all three and the product feels human.',
        },
      },
      {
        title: 'Functional dimension',
        split: {
          left: {
            label: 'Functional job only',
            points: [
              'The data exports correctly',
              'The message is sent',
              'The file is saved',
              'Technically complete. Emotionally empty.',
            ],
          },
          right: {
            label: 'Functional + well executed',
            points: [
              'Export shows progress bar + "Download ready" confirmation',
              'Message shows delivered receipt',
              'File shows last-saved timestamp in the toolbar',
              'User knows the job is done.',
            ],
          },
          footer: 'Most products get the functional job right. The gap is almost always emotional or social.',
        },
      },
      {
        title: 'Emotional dimension',
        body: 'The emotional job is how the user wants to feel — or not feel — as a result of using the product.',
        bullets: [
          'Feel in control: the product is predictable and reversible.',
          'Feel competent: the product does not make me feel slow or confused.',
          'Feel confident: I trust this action worked and nothing was lost.',
          'Feel calm: nothing about this product is raising my anxiety.',
        ],
        highlight: 'When a product makes someone feel stupid or anxious, it is failing the emotional job. That is a design problem — not a user problem.',
      },
      {
        title: 'Social dimension',
        split: {
          left: {
            label: 'Consumer products',
            points: [
              'Instagram: "I want to be seen as creative and well-traveled"',
              'Notion: "I want to be seen as organized and thoughtful"',
              'Figma: "I want to be seen as a capable designer"',
            ],
          },
          right: {
            label: 'B2B / enterprise',
            points: [
              '"This report needs to make me look thorough to my manager"',
              '"I need to share this dashboard so my team sees I am on top of it"',
              '"I need to send something polished so the client trusts us"',
            ],
          },
          footer: 'Social jobs are often invisible to product teams but obvious in how outputs get shared.',
        },
      },

      // ── Four Forces ───────────────────────────────────
      {
        title: 'The Four Forces of Progress',
        bullets: [
          'Push — frustration with the current solution.',
          'Pull — attraction of the new one.',
          "Anxiety — fear the new thing won't work.",
          'Habit — the comfort of what they already know.',
        ],
        highlight: 'This is why technically superior products lose to familiar ones.',
      },
      {
        title: 'Push and Pull',
        split: {
          left: {
            label: 'Push (away from old)',
            points: [
              'Spreadsheet is getting unwieldy at 500 rows',
              'Too many people editing at once — constant conflicts',
              'No audit trail — cannot tell who changed what',
              'The pain is real and frequent.',
            ],
          },
          right: {
            label: 'Pull (toward new)',
            points: [
              'New tool promises real-time collaboration',
              'Has audit history built in',
              'Better search and filtering',
              'The benefit is clear and credible.',
            ],
          },
          footer: 'Both must be true for switching to happen. Strong pull with weak push = "nice to have, maybe later."',
        },
      },
      {
        title: 'Anxiety and Habit',
        split: {
          left: {
            label: 'Anxiety (fear of new)',
            points: [
              '"What if I lose my existing data?"',
              '"What if my team refuses to learn a new tool?"',
              '"What if it doesn\'t do what I actually need?"',
              'Reduce: free trials, easy imports, clear onboarding.',
            ],
          },
          right: {
            label: 'Habit (comfort of old)',
            points: [
              'The spreadsheet is slow, but I know where everything is.',
              'My whole team already knows how to use it.',
              'Switching means retraining 12 people.',
              'Reduce: migration support, familiar patterns, low switching cost.',
            ],
          },
          footer: 'Most new product failures are not pull failures. They are anxiety + habit failures.',
        },
      },
      {
        title: 'Forces in your product',
        body: 'Apply the four forces to any feature you are shipping or any adoption problem you are solving.',
        bullets: [
          'Push: what current friction is pushing users to look for something better?',
          'Pull: what specifically makes this feature attractive — from the user\'s perspective, not yours?',
          'Anxiety: what might make users hesitate? Data loss? Learning curve? Breaking existing workflows?',
          'Habit: what are users currently doing instead, and how strong is that behavior?',
        ],
        highlight: 'If you cannot name the push, there is no urgency. If you cannot reduce the anxiety, adoption will stall even after users try it.',
      },

      // ── Switch Interview ──────────────────────────────
      {
        title: 'The Switch Interview',
        body: 'Not "why do you use this product?" but "tell me about the day you decided to look for something different." The moment of switching is when the job becomes visible.',
      },
      {
        title: 'Why the standard question fails',
        split: {
          left: {
            label: '"Why do you use this product?"',
            points: [
              'Gets: rational, post-hoc justifications',
              '"It has the features I need"',
              '"My team uses it"',
              '"It integrates with our stack"',
              'Real answers — but they do not surface the job.',
            ],
          },
          right: {
            label: '"Tell me about the day you decided to look for something different"',
            points: [
              'Gets: the specific moment of frustration',
              'The situation that created the push',
              'What they tried first before switching',
              'What finally tipped the decision',
              'This is the job.',
            ],
          },
          footer: 'The switch is a crisis. Crises reveal what people actually need.',
        },
      },
      {
        title: 'What to listen for',
        body: 'In a switch interview, you are listening for the moment the old solution stopped being good enough.',
        bullets: [
          'The specific event: "The third time I had to..." or "It was a Friday and I needed to..."',
          'The emotional state: "I was frustrated" / "I was embarrassed" / "I felt like I was constantly fighting it"',
          'What they tried first: reveals the mental model and existing workarounds',
          'Why they finally committed: the pull that overcame habit and anxiety',
        ],
        highlight: 'The job is not in the answer — it is in the story. Keep asking "and then what?" until you reach the moment.',
      },

      // ── Bridge ────────────────────────────────────────
      {
        title: 'JTBD → OOUX (the bridge)',
        body: 'Jobs surface which objects matter, in which context, with which attributes. Running JTBD before OOUX makes the structural decisions faster and more grounded.',
        bullets: [
          'JTBD tells you what the user is trying to accomplish.',
          'OOUX tells you how to structure the product around that.',
          'The job "produce a polished weekly report" surfaces objects: Report, Section, Data Source, Recipient.',
          'Without the job, you might design a generic export instead of solving the actual workflow.',
        ],
      },
    ],
    resources: [
      { title: 'The JTBD Framework (Intercom)', url: 'https://www.intercom.com/resources/books/intercom-jobs-to-be-done', type: 'book', description: 'JTBD applied to SaaS product decisions.' },
      { title: "Know Your Customers' Jobs to Be Done (HBR)", url: 'https://hbr.org/2016/09/know-your-customers-jobs-to-be-done', type: 'article', description: "Christensen's milkshake, explained." },
      { title: 'The Re-Wired Group: Switch Interview', url: 'https://www.youtube.com/results?search_query=bob+moesta+switch+interview', type: 'video', description: 'Bob Moesta on uncovering the real job.' },
    ],
    books: [
      { title: 'Competing Against Luck', author: 'Clayton Christensen', url: 'https://www.google.com/search?q=Competing+Against+Luck', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780062382801-L.jpg', note: 'The original JTBD theory.', topPick: true },
      { title: 'When Coffee and Kale Compete', author: 'Alan Klement', url: 'https://www.google.com/search?q=When+Coffee+and+Kale+Compete', note: 'JTBD applied to product, free online.' },
      { title: 'Demand-Side Sales 101', author: 'Bob Moesta', url: 'https://www.google.com/search?q=Demand-Side+Sales+101+Bob+Moesta', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9781544509969-L.jpg', note: 'The forces and the switch, from the source.' },
    ],
    practice: {
      critique: [
        {
          prompt:
            'Take a feature your team is asked for. Write the task it performs, then the job behind it (functional + emotional + social). Does the requested feature actually serve the job?',
          issues: [
            { label: 'Task ≠ job', note: 'The feature solves the literal request but ignores why the user wanted it.' },
            { label: 'Functional-only', note: 'Emotional and social dimensions of the job are unaddressed.' },
            { label: 'Wrong job', note: 'The feature serves a job, but not the one worth serving for this user.' },
          ],
        },
      ],
      decisions: [
        {
          scenario:
            'A stakeholder insists on a feature "because a customer asked for it." You suspect the underlying job is different but you can frame the ticket either way.',
          answer: 'escalate',
          rationale:
            'When the real job is unclear and a stakeholder is committed, this is a discovery conversation, not a solo UI call. Bring design/PM in to run or interpret a switch interview before building.',
        },
        {
          scenario:
            'Two button copy options solve the same task; one also signals reassurance ("You can undo this anytime"). You pick the reassuring one.',
          answer: 'ship',
          rationale:
            'Addressing the emotional dimension of the job with a low-impact copy choice is exactly the taste this course builds. Ship it.',
        },
      ],
      tutorPrompts: [
        'What is the difference between a task and a job? Use my product as an example.',
        'How do the four forces explain why users resist a better tool?',
        'How would I run a switch interview with one customer?',
      ],
    },
  },

  // ========================================================
  // MODULE 4 — OOUX: HOW TO STRUCTURE
  // ========================================================
  {
    id: 'ooux',
    number: 4,
    title: 'OOUX',
    subtitle: 'How to Structure',
    arc: 'Structure',
    description:
      'Object-Oriented UX (Sophia Prater) organizes design around objects (nouns) instead of tasks (verbs). It maps directly to how engineers think about data and systems — which is exactly why it is so valuable for non-designers.',
    icon: 'boxes',
    color: 'var(--of-magenta-400)',
    slides: [
      { title: 'OOUX', body: 'How to Structure', titleSlide: true },

      // ── Objects ───────────────────────────────────────
      {
        title: 'What is an object?',
        body: 'A discrete thing your user cares about: a project, a message, an order, a report, a contact. Not a page. Not a feature. A thing. Identifying the objects is harder than it sounds.',
      },
      {
        title: 'Objects vs. pages',
        split: {
          left: {
            label: 'Thinking in pages (common)',
            points: [
              'Homepage',
              'Project list page',
              'Project detail page',
              'Task creation page',
              'Settings page',
            ],
          },
          right: {
            label: 'Thinking in objects (OOUX)',
            points: [
              'Project — has tasks, members, status, due date',
              'Task — belongs to a project, has assignee and state',
              'User — has projects, tasks, permissions',
              'Pages are just views of these objects.',
            ],
          },
          footer: 'Pages are temporary. Objects are permanent. Design around objects, not pages.',
        },
      },
      {
        title: 'Finding objects in your product',
        body: 'Objects appear as the nouns in user stories and job statements.',
        bullets: [
          'Read your job statements — circle every noun. Projects, tasks, reports, teams — those are candidates.',
          'Check your database — entities map closely to objects.',
          'Read support tickets: "I cannot find my invoice" → Invoice is an object.',
          'Ask: does this persist? Can it be created, saved, retrieved, and shared? If yes — it is an object.',
        ],
        highlight: 'If users name it and care about its state over time, it is an object.',
      },
      {
        title: 'When design and data models diverge',
        split: {
          left: {
            label: 'Diverged (common)',
            points: [
              'Design calls it "Campaign" in one section',
              'Engineering calls it "CampaignGroup" in the API',
              'A third section calls it "Program"',
              'Users see three names for one thing.',
              'Support tickets pile up. Confusion is permanent.',
            ],
          },
          right: {
            label: 'Aligned',
            points: [
              'One name: "Campaign" — everywhere',
              'API: /campaigns, /campaigns/:id',
              'UI: campaign list, detail, settings',
              'Users build a reliable mental model.',
              'Engineers and designers share a vocabulary.',
            ],
          },
          footer: 'Naming disagreements between design and engineering always surface as user confusion.',
        },
      },

      // ── ORCA ─────────────────────────────────────────
      {
        title: 'The ORCA process',
        bullets: [
          'Objects — identify them from research and content.',
          'Relationships — map how objects connect.',
          'Calls to action — what can a user do with each object?',
          'Attributes — what information describes it, in which context?',
        ],
      },
      {
        title: 'Relationships: how objects connect',
        split: {
          left: {
            label: 'Common relationship types',
            points: [
              'Contains: a Project contains Tasks',
              'Belongs to: a Task belongs to a User',
              'References: an Invoice references a Client',
              'Follows: a Comment follows a Task',
            ],
          },
          right: {
            label: 'What relationships surface',
            points: [
              'Navigation: where do I see a Task in context of its Project?',
              'Permissions: who can see or edit a Task?',
              'Cascades: if I delete a Project, what happens to its Tasks?',
              'These are structural decisions — not UI details.',
            ],
          },
          footer: 'Unmapped relationships are the largest single source of UI inconsistency in mature products.',
        },
      },
      {
        title: 'CTAs surface conflicts',
        split: {
          left: {
            label: 'Unmapped CTAs (common result)',
            points: [
              'Archive on list page: moves to Archive section',
              'Archive on detail page: deletes permanently',
              'Archive in bulk action: undefined behavior',
              'Three "archive" actions. Three outcomes.',
              'Users do not trust any of them.',
            ],
          },
          right: {
            label: 'Mapped CTAs (OOUX)',
            points: [
              'Task object CTAs defined once: complete, edit, move, archive, delete',
              'Archive = always soft-delete, consistent everywhere',
              'No conflicts. Every CTA is predictable.',
              'Trust is built through consistency.',
            ],
          },
          footer: 'If the same action does different things in different places, the object model is broken.',
        },
      },
      {
        title: 'Attributes: right information, right context',
        split: {
          left: {
            label: 'Project in a list view',
            points: ['Name', 'Status', 'Due date', 'Owner', '(4 attributes — quick scan)'],
          },
          right: {
            label: 'Project in detail view',
            points: ['Name + full description', 'Status + status history', 'Due date + all milestones', 'Owner + all team members', 'Task count + completion %', '(Full attribute set)'],
          },
          footer: 'Attribute drift = the same object shows different fields in different contexts for no reason. OOUX catches this before you build.',
        },
      },
      {
        title: 'Why engineers love OOUX',
        highlight: 'The object model maps to entity-relationship diagrams, schemas, and API structure. When design and engineering share one object model, handoff gets cleaner and edge cases surface earlier.',
      },
    ],
    resources: [
      { title: 'A Primer to OOUX', url: 'https://www.smashingmagazine.com/2020/10/object-oriented-ux/', type: 'article', description: "Sophia Prater's intro to object-oriented UX." },
      { title: 'OOUX: ORCA Process', url: 'https://www.ooux.com/', type: 'framework', description: 'The canonical methodology home.' },
      { title: 'Information Architecture (IxDF)', url: 'https://www.interaction-design.org/literature/topics/information-architecture', type: 'course', description: 'IA foundations behind OOUX.' },
    ],
    books: [
      { title: 'A Practical Guide to Information Architecture', author: 'Donna Spencer', url: 'https://www.google.com/search?q=A+Practical+Guide+to+Information+Architecture', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780955617904-L.jpg', note: 'Approachable IA grounding for OOUX.', topPick: true },
      { title: 'How to Make Sense of Any Mess', author: 'Abby Covert', url: 'https://www.google.com/search?q=How+to+Make+Sense+of+Any+Mess', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9781500615994-L.jpg', note: 'Short, sharp IA thinking.' },
    ],
    practice: {
      critique: [
        {
          prompt:
            'Pick a product area you own. List its objects (nouns the user cares about). For one object, write its attributes and CTAs. Where does the same object appear with different attributes or actions?',
          issues: [
            { label: 'Page, not object', note: 'You listed screens/features instead of the things users care about.' },
            { label: 'Attribute drift', note: 'The same object shows different fields in different places for no reason.' },
            { label: 'CTA conflict', note: 'The same action exists in multiple spots with inconsistent outcomes.' },
          ],
        },
      ],
      decisions: [
        {
          scenario:
            'You notice the design object model and the engineering data model diverge for one entity. Aligning them is a small rename in the UI.',
          answer: 'fix-yourself',
          rationale:
            'Surfacing and closing a small object-model divergence is squarely in your lane — and the most valuable thing OOUX trains you to catch. Note it and align the naming.',
        },
        {
          scenario:
            "A new feature introduces an object that doesn't fit the existing model and would change navigation across several areas.",
          answer: 'escalate',
          rationale:
            'A new top-level object that reshapes IA is high-impact and cross-cutting. Define the object/attributes first, then validate with a designer before building.',
        },
      ],
      tutorPrompts: [
        'Help me identify the objects in my product area.',
        'What is the difference between an object and a page?',
        'How does an OOUX object model relate to our database schema?',
      ],
    },
  },

  // ========================================================
  // MODULE 5 — DESIGN SYSTEMS: HOW TO SCALE
  // ========================================================
  {
    id: 'design-systems',
    number: 5,
    title: 'Design Systems',
    subtitle: 'How to Scale',
    arc: 'Scale',
    description:
      'Individual design decisions are easy to get right in isolation. Scale is what breaks them. How decisions compound, what makes a system hold together, and how to make good choices when working within — or extending — one.',
    icon: 'layers',
    color: 'var(--of-magenta-400)',
    slides: [
      { title: 'Design Systems', body: 'How to Scale', titleSlide: true },

      // ── What a System Is ──────────────────────────────
      {
        title: 'A system is decisions, documented',
        body: 'Not just a component library. Tokens (color, spacing, type), components (buttons, forms), patterns (how components combine), and principles (when to use what, and why). The system is only as useful as its documentation.',
      },
      {
        title: 'Four layers of a design system',
        split: {
          left: {
            label: 'Layer',
            points: ['Tokens', 'Components', 'Patterns', 'Principles'],
          },
          right: {
            label: 'What it contains',
            points: [
              'Color, type, spacing, radius, shadow — the raw values',
              'Button, input, card, modal — reusable elements with defined states',
              'Empty state, destructive confirm — component combinations solving recurring problems',
              'When to use what, and why — the decisions that make the system coherent',
            ],
          },
          footer: 'A component library without principles is a parts list. A system has reasoning.',
        },
      },
      {
        title: 'Consistency at scale',
        body: 'Individual decisions are easy to get right in isolation. The system compounds them.',
        split: {
          left: {
            label: 'Without a system',
            points: [
              'Team A uses 16px spacing. Team B uses 15px. Team C uses 18px.',
              'One engineer uses #D11A82. Another uses #D11A83.',
              'At one page: invisible. Across 40 pages: it feels broken.',
              'No one made a wrong decision. The system made no decision at all.',
            ],
          },
          right: {
            label: 'With a system',
            points: [
              'All spacing comes from the token scale: 4, 8, 16, 24, 48px',
              'All brand color: var(--of-magenta-600)',
              'The right answer is the only answer.',
              'Consistency is structural, not disciplinary.',
            ],
          },
          footer: 'The goal is not consistency for its own sake. It is consistency as trust-building with the user.',
        },
      },
      {
        title: 'The documentation problem',
        split: {
          left: {
            label: 'Library (not a system)',
            points: [
              'Components exist in Figma and in code',
              'No guidance on when to use each variant',
              'No principles for edge cases',
              'Engineers guess. Designers inconsistency-check. Trust erodes.',
            ],
          },
          right: {
            label: 'System',
            points: [
              'Components exist in Figma + code',
              'Each: purpose, variants, states, when not to use',
              'Principles answer: "what do we do when nothing fits?"',
              'The system can answer every question it was built to answer.',
            ],
          },
        },
      },

      // ── Tokens ────────────────────────────────────────
      {
        title: 'Design Tokens',
        body: 'A color token is not "#8F1F57." It is "brand-primary." A spacing token is not "16px." It is "spacing-medium." Tokens separate decisions from implementation — change the token, everything updates.',
        highlight: 'This whole site is built on the Keel token system: every color, space, and type size is an --of-* token.',
      },
      {
        title: 'Why not just use values?',
        split: {
          left: {
            label: 'Hardcoded values',
            points: [
              'Button background: #80074D',
              'Link color: #80074D',
              'Active nav item: #80074D',
              'You want to rebrand. You search-and-replace.',
              'You miss 3 uses. Some files had a slightly different hex.',
              'Inconsistency is now permanent.',
            ],
          },
          right: {
            label: 'Token',
            points: [
              'Button background: var(--of-bg-brand)',
              'Link color: var(--of-fg-brand)',
              'Active nav: var(--of-bg-brand)',
              'You rebrand. You change the token value once.',
              'Every use updates automatically.',
              'No searching. No missing.',
            ],
          },
          footer: 'Tokens are not a naming convention. They are a single source of truth for every design decision.',
        },
      },
      {
        title: 'Primitive vs. semantic tokens',
        split: {
          left: {
            label: 'Primitive (the palette)',
            points: [
              '--of-magenta-600: #80074D',
              '--of-gray-900: #14101A',
              '--of-gray-200: #DCD4DC',
              'Just values. No meaning.',
              'Never used directly in components.',
            ],
          },
          right: {
            label: 'Semantic (the decision)',
            points: [
              '--of-bg-brand: var(--of-magenta-600)',
              '--of-fg-default: var(--of-gray-900)',
              '--of-border-line: var(--of-gray-200)',
              'These carry meaning. Components use these — never primitives.',
            ],
          },
          footer: 'If a component references a primitive token directly, it has opted out of the system. That is a code review flag.',
        },
      },
      {
        title: 'Tokens in the wild: Keel',
        body: 'Every design decision on this site is a Keel token. Nothing is hardcoded.',
        bullets: [
          'Background: var(--of-bg-base) — adapts to light and dark mode automatically',
          'Brand gradient (sidebar title): var(--of-gradient-brand)',
          'All spacing: var(--of-space-4), var(--of-space-8) — never arbitrary px values',
          'All type sizes: var(--of-text-sm), var(--of-text-lg) — always from the scale',
        ],
        highlight: 'Open DevTools and inspect any element on this site. You will see tokens — not values. That is the system working.',
      },

      // ── Patterns vs Components ────────────────────────
      {
        title: 'Patterns vs. Components',
        split: {
          left: { label: 'Component', points: ['A button', 'A modal', 'A form field', 'States + variants'] },
          right: { label: 'Pattern', points: ['"Empty state"', '"Destructive confirm"', 'Combines components', 'Solves a recurring UX problem'] },
          footer: 'Knowing when you need a new component, a new pattern, or a designer is the key skill.',
        },
      },
      {
        title: 'Component anatomy: states and variants',
        split: {
          left: {
            label: 'Button states',
            points: ['Default', 'Hover', 'Focus (keyboard navigation)', 'Active / pressed', 'Loading', 'Disabled'],
          },
          right: {
            label: 'Button variants',
            points: [
              'Primary — brand color, one per page',
              'Secondary / ghost — supporting actions',
              'Destructive — irreversible actions, red semantic color',
              'Icon-only — requires visible tooltip',
            ],
          },
          footer: 'A component without defined states is an asset, not a system element. It will be misused.',
        },
      },
      {
        title: 'Pattern: the empty state',
        body: 'An empty state is a pattern — it combines components to solve a specific recurring problem: what does a user see when there is nothing to show yet?',
        split: {
          left: {
            label: 'No pattern applied',
            points: [
              'Blank panel',
              '"No tasks found"',
              'No action. No explanation.',
              'User wonders: is this broken? Did I do something wrong?',
            ],
          },
          right: {
            label: 'Empty state pattern',
            points: [
              'Icon: a task checkbox (signals what goes here)',
              'Heading: "No tasks yet"',
              'Body: "Add a task to get started on this project."',
              'CTA: "Add task" button',
              'User knows what this is, and exactly what to do.',
            ],
          },
        },
      },

      // ── System Drift ──────────────────────────────────
      {
        title: 'When the system breaks',
        bullets: [
          "New use cases that don't fit existing components.",
          'Inconsistent application across teams.',
          'One-off token overrides that quietly become permanent.',
        ],
      },
      {
        title: 'How drift starts',
        split: {
          left: {
            label: 'How it happens',
            points: [
              '"The card needs 12px padding here — just hardcode it for now"',
              '"I need a slightly different shade of blue — close enough"',
              '"This icon is not in the library — I\'ll use a similar one from Google"',
            ],
          },
          right: {
            label: 'What it becomes',
            points: [
              '6 months later: 8 different padding values across similar components',
              'The "similar" blue is now a permanent third brand color',
              'Four icon families in production',
              'The system looks like it exists. It no longer functions like one.',
            ],
          },
          footer: '"Just this once" is how every permanent exception starts.',
        },
      },
      {
        title: 'Exception vs. evolution',
        body: 'Not every deviation from the system is drift. Some use cases are genuinely new.',
        bullets: [
          'Exception: a single specific context with no expected recurrence. Document it; do not add it to the system.',
          'Evolution: a new use case that will recur across the product. Design it properly; add it to the system.',
          'Signal to escalate: when you find yourself building the same exception in three different places — that is a missing pattern.',
        ],
        highlight: 'The system should make the right answer easy. When the right answer keeps requiring exceptions, the system needs to evolve.',
      },

      // ── Closing ───────────────────────────────────────
      {
        title: 'Navigating ambiguity at scale',
        body: "When there is no pattern for what you're building: look for the nearest analog, define the object and its attributes first (Module 4), pressure-test against the principles, validate with a designer before shipping.",
        quote: { text: 'This is craft judgment, not creative license.', author: 'Design 101' },
      },
    ],
    resources: [
      { title: 'Design Systems 101 (NN/g)', url: 'https://www.nngroup.com/articles/design-systems-101/', type: 'article', description: 'The clearest definition of what a system is.' },
      { title: 'Atomic Design', url: 'https://atomicdesign.bradfrost.com/', type: 'book', description: "Brad Frost's free online book on system structure." },
      { title: 'Keel design system', url: 'https://github.com/czhengjuarez/Keel', type: 'tool', description: 'The system that powers this site (and its --of-* tokens).' },
      { title: 'Shopify Polaris', url: 'https://polaris.shopify.com/', type: 'tool', description: 'A mature, well-documented real-world system to study.' },
    ],
    books: [
      { title: 'Design Systems', author: 'Alla Kholmatova', url: 'https://www.google.com/search?q=Design+Systems+Alla+Kholmatova', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9783945749586-L.jpg', note: 'How systems are built and maintained in practice.', topPick: true },
      { title: 'Atomic Design', author: 'Brad Frost', url: 'https://atomicdesign.bradfrost.com/', thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780996550208-L.jpg', note: 'The mental model for component hierarchy.' },
      { title: 'Expressive Design Systems', author: 'Yesenia Perez-Cruz', url: 'https://www.google.com/search?q=Expressive+Design+Systems', note: 'Keeping systems flexible, not rigid.' },
    ],
    practice: {
      critique: [
        {
          prompt:
            "Audit one product area against your design system. What follows the system, what doesn't, and what's missing? For one off-system element, decide: exception, or sign the system needs to evolve?",
          issues: [
            { label: 'Silent override', note: 'A hardcoded value replaces a token "just this once."' },
            { label: 'Reinvented component', note: 'A bespoke element duplicates one the system already provides.' },
            { label: 'Missing pattern', note: 'A recurring problem has no shared pattern, so everyone solves it differently.' },
          ],
        },
      ],
      decisions: [
        {
          scenario:
            'You need a card layout that already exists as a system component. You can drop it in with existing tokens.',
          answer: 'ship',
          rationale:
            'Using an existing component with existing tokens is the system working as intended. Ship it confidently.',
        },
        {
          scenario:
            'Your feature needs a spacing value between two token steps. You consider hardcoding 18px.',
          answer: 'fix-yourself',
          rationale:
            "Don't hardcode — pick the nearest token and match an analogous reviewed area. If many places need the in-between value, that's a signal to raise with the system owners (but the immediate call is yours).",
        },
        {
          scenario:
            'No pattern exists for a complex new data-dense view that several teams will reuse.',
          answer: 'escalate',
          rationale:
            'A net-new, reusable, cross-team pattern is high-impact and shapes the system itself. Define the structure, then validate with a designer/system owner before it sets precedent.',
        },
      ],
      tutorPrompts: [
        'What exactly is a design token, and why not just use hex values?',
        'How do I decide between a new component and a new pattern?',
        'When should I override the system vs. evolve it?',
      ],
    },
  },
];

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}
